import AWS from 'aws-sdk';
import fs from 'fs';
import path from 'path';
import { addVideoDetailsToDB } from './video.controllers.mjs';
import { asyncHandler } from '../utils/asyncHandler.js';
import ApiError from '../utils/ApiError.js';
import ApiResponce from '../utils/ApiResponce.js';
import { v4 as uuidv4 } from 'uuid';

import convertToHLS from '../utils/hlsConverter.js';
const __dirname = path.resolve();

let videoUploads = {};

export const initializeUpload = asyncHandler(async (req, res) => {
  const { fileName, fileSize, totalChunks } = req.body;

  if (!fileName || !fileSize || !totalChunks) {
    return res.status(400).json(new ApiError(400, 'Invalid  request data'));
  }

  const uploadId = uuidv4();
  videoUploads[uploadId] = {
    fileName,
    fileSize,
    totalChunks,
    uploadedChunks: 0,
    chunks: [],
  };

  res
    .status(200)
    .json(new ApiResponce(200, { uploadId }, 'Uploading chunk initiated'));
});

export const uploadChunk = asyncHandler(async (req, res) => {
  const { uploadId, chunkIndex } = req.body;
  const chunkData = req.file;
  console.log('🚀 ~ uploadChunk ~ chunkData:', uploadId, chunkIndex, req.file);

  if (!uploadId || chunkIndex === undefined || !chunkData) {
    return res.status(400).json({ message: 'Invalid request data' });
  }

  if (!videoUploads[uploadId]) {
    return res.status(404).json({ message: 'Upload session not found' });
  }

  const chunkDir = path.join(__dirname, 'public/uploads', uploadId);
  if (!fs.existsSync(chunkDir)) {
    fs.mkdirSync(chunkDir, { recursive: true });
  }

  const chunkPath = path.join(chunkDir, `chunk_${chunkIndex}`);
  fs.rename(chunkData.path, chunkPath, function (err) {
    if (err) {
      return res.status(500).json(new ApiError(500, 'Error saving chunk', err));
    }

    videoUploads[uploadId].chunks.push(chunkIndex);
    videoUploads[uploadId].uploadedChunks += 1;

    res
      .status(200)
      .json(new ApiResponce(200, {}, 'Chunk uploaded successfully'));
  });
});

export const completeUpload = asyncHandler(async (req, res) => {
  const { uploadId, title, description } = req.body;
  const thumnailLocalPath = req.file?.path;

  if (!uploadId || !videoUploads[uploadId]) {
    return res.status(400).json(new ApiError(400, 'Invalid upload session'));
  }

  const uploadData = videoUploads[uploadId];

  if (uploadData.uploadedChunks !== uploadData.totalChunks) {
    return res
      .status(400)
      .json(new ApiError(400, 'Not all chunks have been uploaded'));
  }

  const chunkDir = path.join(__dirname, 'public/uploads', uploadId);
  const finalFilePath = path.join(
    __dirname,
    'public/uploads',
    `${uploadData.fileName.replace(' ', '')}`
  );
  
  // Merge chunks
  const chunkFiles = Array.from(
    { length: uploadData.totalChunks },
    (_, i) => `chunk_${i}`
  ).map((f) => path.join(chunkDir, f));
  const writeStream = fs.createWriteStream(finalFilePath);

  chunkFiles.forEach((chunk) => {
    const data = fs.readFileSync(chunk);
    writeStream.write(data);
    fs.unlinkSync(chunk);
  });

  writeStream.end();
  fs.rmdirSync(chunkDir);
  convertToHLS(finalFilePath, uploadId);

  return res.status(200).json({
    message: 'Upload complete and Processing the video',
  });
});
