import ffmpeg from "fluent-ffmpeg";
import ffmpegStatic from "ffmpeg-static";
import fs from "fs";
import path from "path";
import { asyncHandler } from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponce from "../utils/ApiResponce.js";
import { uploadToCloudinary } from "../utils/cloudinary.js";
import ApiRenponse from "../utils/ApiResponce.js";
ffmpeg.setFfmpegPath(ffmpegStatic);
import { v4 as uuidv4 } from "uuid";

export const hanleFileChunking = asyncHandler(async (req, res) => {
  const filePath = "./public/temp/Old_empty_Ranch.mp4";
  const folderName = uuidv4();
  const chunkDir = `./public/temp/chunks/${folderName}`;
  if (!fs.existsSync(filePath)) {
    return res.status(400).json(new ApiError(400, "File deos not exit"));
  }

  if (!fs.existsSync(chunkDir)) {
    fs.mkdirSync(chunkDir, { recursive: true });
  }

  const fileSize = fs.statSync(filePath).size;
  const chunkSize = 10 * 1024 * 1024; // 10 MB
  const totalChunks = Math.ceil(fileSize / chunkSize);

  for (let chunkPart = 0; chunkPart < totalChunks; chunkPart++) {
    const start = chunkPart * chunkSize;
    const end = Math.min(start + chunkSize, fileSize) - 1;
    const destinationChunkPath = path.join(chunkDir, `chunk-${chunkPart}`);

    const readStream = fs.createReadStream(filePath, { start, end });
    const writeStream = fs.createWriteStream(destinationChunkPath);

    await new Promise((resolve, reject) => {
      readStream.pipe(writeStream);
      writeStream.on("finish", resolve);
      writeStream.on("error", reject);
    });
  }
  handleFileMerging(chunkDir);
  return res
    .status(200)
    .json(new ApiResponce(200, {}, "Uploaded Successfully"));
});

export const handleFileMerging = async (chunkDir) => {
  const outputPath = "./public/temp/Old_empty_Ranch-merged.mp4";

  const chunkFiles = fs.readdirSync(chunkDir).sort((a, b) => {
    const numA = parseInt(a.split("-")[1], 10);
    const numB = parseInt(b.split("-")[1], 10);
    return numA - numB;
  });

  const writeStream = fs.createWriteStream(outputPath);

  for (const chunkFile of chunkFiles) {
    const chunkPath = path.join(chunkDir, chunkFile);
    const data = fs.readFileSync(chunkPath);
    writeStream.write(data);
  }

  writeStream.end();

  writeStream.on("finish", () => {
    convertToHLS(outputPath);
  });

  writeStream.on("error", (err) => {
    return res
      .status(500)
      .json({ message: "Error during file merging", error: err.message });
  });
};

export const processVideoFile = asyncHandler(async (req, res) => {
  const filePath = "./public/temp/Old_empty_Ranch.mp4";
  if (!fs.existsSync(filePath)) {
    console.log("error on file path");
  }

  convertToHLS(filePath, uuidv4());
  return res
    .status(200)
    .json(new ApiRenponse(200, {}, "Coverting process initiated"));
});

const convertToHLS = async (filePath, uuid) => {
  if (!fs.existsSync(filePath)) {
    console.log("error on file path");
  }
  const resolutions = [
    {
      resolution: "320x180",
      videoBitrate: "500k",
      audioBitrate: "64k",
    },
    {
      resolution: "854x480",
      videoBitrate: "1000k",
      audioBitrate: "128k",
    },
    {
      resolution: "1280x720",
      videoBitrate: "2500k",
      audioBitrate: "192k",
    },
  ];

  const mp4FileName = path.basename(filePath);
  const variantPlaylists = [];
  const __dirname = path.resolve();
  const outoutPath = `./public/videos/${uuid}`;
  if (!fs.existsSync(outoutPath)) {
    fs.mkdirSync(outoutPath, { recursive: true });
  }

  for (const { resolution, videoBitrate, audioBitrate } of resolutions) {
    console.log(
      `HLS conversion starting for ${resolution}, forFile ${filePath}`,
    );
    const outputFileName = `${outoutPath}/${mp4FileName.replace(
      ".",
      "_",
    )}_${resolution}.m3u8`;
    const segmentFileName = `${outoutPath}/${mp4FileName.replace(
      ".",
      "_",
    )}_${resolution}_%03d.ts`;

    await new Promise((resolve, reject) => {
      ffmpeg(filePath)
        .outputOptions([
          `-c:v h264`,
          `-b:v ${videoBitrate}`,
          `-c:a aac`,
          `-b:a ${audioBitrate}`,
          `-vf scale=${resolution}`,
          `-f hls`,
          `-hls_time 10`,
          `-hls_list_size 0`,
          `-hls_segment_filename ${segmentFileName}`,
        ])
        .output(outputFileName)
        .on("end", () => resolve())
        .on("error", (err) => reject(err))
        .run();
    });
    const variantPlaylist = {
      resolution,
      outputFileName,
    };
    variantPlaylists.push(variantPlaylist);
    console.log(`HLS conversion done for ${resolution}`);
  }
  console.log(`HLS master m3u8 playlist generating`);
  let masterPlaylist = variantPlaylists
    .map((variantPlaylist) => {
      const { resolution, outputFileName } = variantPlaylist;
      const bandwidth =
        resolution === "320x180"
          ? 676800
          : resolution === "854x480"
            ? 1353600
            : 3230400;
      return `#EXT-X-STREAM-INF:BANDWIDTH=${bandwidth},RESOLUTION=${resolution}\n${outputFileName}`;
    })
    .join("\n");
  masterPlaylist = `#EXTM3U\n` + masterPlaylist;

  const masterPlaylistFileName = `${mp4FileName.replace(".", "_")}_master.m3u8`;
  const masterPlaylistPath = `${outoutPath}/${masterPlaylistFileName}`;
  fs.writeFileSync(masterPlaylistPath, masterPlaylist);
  console.log(`HLS master m3u8 playlist generated`);
  // uploadToCoudinaty(outoutPath, uuid);
};

const uploadToCoudinaty = async (folderPath, uuid) => {
  console.log("Upload started");
  console.time("req_time");
  if (!fs.existsSync(folderPath)) {
    throw error("Folder does not exist");
  }

  const files = fs.readdirSync(folderPath);
  for (const file of files) {
    // if (!file.startsWith(mp4FileName.replace('.', '_'))) {
    //   continue;
    // }

    const filePath = path.join(folderPath, file);

    await uploadToCloudinary(filePath, `videos/${uuid}`);
    console.log(`Uploaded ${filePath} to s3. Also deleted locally`);
    // fs.unlinkSync(filePath);
  }

  console.log("Success. Time taken: ");
  console.timeEnd("req_time");
};
export default convertToHLS;
