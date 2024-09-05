import fs from 'fs';
import path from 'path';
import { addVideoDetailsToDB } from './video.controllers.mjs';
import { asyncHandler } from '../utils/asyncHandler.js';
import ApiError from '../utils/ApiError.js';
import ApiResponce from '../utils/ApiResponce.js';
import { v4 as uuidv4 } from 'uuid';
import { getVideoDurationInSeconds } from 'get-video-duration';
import prisma from '../db/client.mjs';
import { uploadToCloudinary } from '../utils/cloudinary.js';
import convertToHLS from '../utils/hlsConverter.js';
const __dirname = path.resolve();

export const initializeUpload = asyncHandler(async (req, res) => {
  const { fileName, fileSize, totalChunks } = req.body;

  if (!fileName || !fileSize || !totalChunks) {
    return res.status(400).json(new ApiError(400, 'Invalid  request data'));
  }

  const params = {
    fileName,
    fileSize: `${fileSize}`,
    totalChunks,
    uploadedChunks: 0,
  };

  const uploade = await prisma.uploadHistory.create({
    data: params,
  });

  if (uploade) {
    res
      .status(200)
      .json(
        new ApiResponce(
          200,
          { uploadId: uploade.id },
          'Uploading chunk initiated'
        )
      );
  } else {
    return res.status(400).json(new ApiError(500, 'Something went wrong'));
  }
});

export const uploadChunk = asyncHandler(async (req, res) => {
  const uploadId = req.body?.uploadId
    ? parseInt(req.body?.uploadId)
    : undefined;
  const chunkIndex = req.body?.chunkIndex
    ? parseInt(req.body?.chunkIndex)
    : undefined;
  const chunkData = req.file;

  if (!uploadId || chunkIndex === undefined || !chunkData) {
    return res.status(400).json(new ApiError(400, 'Invalid request data'));
  }

  const uploade = await prisma.uploadHistory.findUnique({
    where: { id: uploadId },
  });
  if (!uploade) {
    return res.status(404).json(new ApiError(404, 'Upload session not found'));
  }

  const chunkDir = path.join(__dirname, 'public/uploads', uploadId.toString());
  if (!fs.existsSync(chunkDir)) {
    fs.mkdirSync(chunkDir, { recursive: true });
  }

  const chunkPath = path.join(chunkDir, `chunk_${chunkIndex}`);
  fs.rename(chunkData.path, chunkPath, async (err) => {
    if (err) {
      return res.status(500).json(new ApiError(500, 'Error saving chunk', err));
    }

    await prisma.uploadHistory.update({
      where: { id: uploadId },
      data: { uploadedChunks: { increment: 1 } },
    });

    res
      .status(200)
      .json(new ApiResponce(200, {}, 'Chunk uploaded successfully'));
  });
});

export const completeUpload = asyncHandler(async (req, res) => {
  const uploadId = req.body?.uploadId
    ? parseInt(req.body?.uploadId)
    : undefined;
  const { title, description, channelId } = req.body;
  const thumnailLocalPath = req.file?.path;

  if (!uploadId) {
    return res.status(400).json(new ApiError(400, 'Invalid request data'));
  }

  const uploadData = await prisma.uploadHistory.findUnique({
    where: { id: uploadId },
  });
  if (!uploadData) {
    return res.status(404).json(new ApiError(404, 'Upload session not found'));
  }

  if (!title || !channelId) {
    return res.status(400).json(new ApiError(400, 'All the details required'));
  }
  if (!thumnailLocalPath) {
    return res.status(400).json(new ApiError(400, 'Thumbnail not found'));
  }
  if (uploadData.uploadedChunks !== uploadData.totalChunks) {
    return res
      .status(400)
      .json(new ApiError(400, 'Not all chunks have been uploaded'));
  }

  const chunkDir = path.join(__dirname, 'public/uploads', uploadId.toString());
  const finalFilePath = path.join(
    __dirname,
    'public/uploads',
    `${uploadData.fileName.replace(/[ .]/g, '_')}`
  );

  mergeChunks(chunkDir, finalFilePath, uploadData.totalChunks).then(
    async (resp) => {
      if (resp) {
        const stream = fs.createReadStream(finalFilePath);
        getVideoDurationInSeconds(stream).then(async (duration) => {
          console.log(duration);
          const mp4FileName = path.basename(finalFilePath);
          const thumbnail = await uploadToCloudinary(thumnailLocalPath);
          const video = await prisma.video.create({
            data: {
              title,
              userId: req.user.id,
              channelId,
              status: 'PROCESSIGN',
              description,
              thumbnail: thumbnail.url,
              file_key: mp4FileName,
              duration: duration,
            },
          });
          if (video) {
            convertToHLS(finalFilePath, video.id);
          }
          return res.status(200).json({
            message: 'Upload complete and Processing the video',
          });
        });
      }
    }
  );
});

const mergeChunks = async (chunkDir, finalPath, totalChunks) => {
  return new Promise((resolve, reject) => {
    try {
      const chunkFiles = Array.from(
        { length: totalChunks },
        (_, i) => `chunk_${i}`
      ).map((f) => path.join(chunkDir, f));

      const writeStream = fs.createWriteStream(finalPath);

      for (let i = 0; i < chunkFiles.length; i++) {
        const data = fs.readFileSync(chunkFiles[i]);
        writeStream.write(data);
        fs.unlinkSync(chunkFiles[i]);
      }

      writeStream.end(() => {
        fs.rmdirSync(chunkDir);
        resolve(true);
      });
    } catch (error) {
      reject(error.message);
    }
  });
};
