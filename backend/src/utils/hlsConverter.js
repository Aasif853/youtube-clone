import ffmpeg from 'fluent-ffmpeg';
import ffmpegStatic from 'ffmpeg-static';
import fs from 'fs';
import path from 'path';
import { uploadToCloudinary } from '../utils/cloudinary.js';
import { uploadToAwsS3 } from '../utils/awsFileUploader.js';
const __dirname = path.resolve();
ffmpeg.setFfmpegPath(ffmpegStatic);

const HLS_TIME = 15;

const RESOLUTIONS = [
  {
    resolution: '426x240',
    videoBitrate: '300k', // 0.3 Mbps
    audioBitrate: '64k',
    bandWidth: '364000',
  },
  {
    resolution: '640x360',
    videoBitrate: '500k', // 0.5 Mbps
    audioBitrate: '96k',
    bandWidth: '596000',
  },
  {
    resolution: '854x480',
    videoBitrate: '1000k', // 1.0 Mbps
    audioBitrate: '128k',
    bandWidth: '1128000',
  },
  // {
  //   "resolution": "1280x720",
  //   "videoBitrate": "2500k",  // 2.5 Mbps
  //   "audioBitrate": "128k"
  //    bandWidth: '2628000'
  // },
  // {
  //   "resolution": "1920x1080",
  //   "videoBitrate": "4500k",  // 4.5 Mbps
  //   "audioBitrate": "192k"
  //    bandWidth: '4692000'
  // }
];
const convertToHLS = async (filePath, uuid) => {
  if (!fs.existsSync(filePath)) {
    console.log('error on file path');
  }

  const mp4FileName = path.basename(filePath).replace(' ', '');
  const variantPlaylists = [];
  const outoutPath = `./public/videos/${uuid}`;
  if (!fs.existsSync(outoutPath)) {
    fs.mkdirSync(outoutPath, { recursive: true });
  }

  for (const {
    resolution,
    videoBitrate,
    audioBitrate,
    bandWidth,
  } of RESOLUTIONS) {
    console.log(
      `HLS conversion starting for ${resolution}, forFile ${filePath}`
    );
    const outputFileName = `${outoutPath}/${mp4FileName.replace(
      '.',
      '_'
    )}_${resolution}.m3u8`;
    const segmentFileName = `${outoutPath}/${mp4FileName.replace(
      '.',
      '_'
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
          `-hls_time ${HLS_TIME}`,
          `-hls_list_size 0`,
          `-hls_segment_filename ${segmentFileName}`,
        ])
        .output(outputFileName)
        .on('end', () => resolve())
        .on('error', (err) => reject(err))
        .run();
    });
    const variantPlaylist = {
      resolution,
      outputFileName,
      bandWidth,
    };
    variantPlaylists.push(variantPlaylist);
    console.log(`HLS conversion done for ${resolution}`);
  }
  let masterPlaylist = variantPlaylists
    .map((variantPlaylist) => {
      const { resolution, outputFileName, bandWidth } = variantPlaylist;
      return `#EXT-X-STREAM-INF:BANDWIDTH=${bandWidth},RESOLUTION=${resolution}\n./${outputFileName}`;
    })
    .join('\n');
  masterPlaylist = `#EXTM3U\n` + masterPlaylist;

  const masterPlaylistFileName = `${mp4FileName.replace('.', '_')}_master.m3u8`;
  const masterPlaylistPath = `${outoutPath}/${masterPlaylistFileName}`;
  fs.writeFileSync(masterPlaylistPath, masterPlaylist);
  console.log(`HLS master m3u8 playlist generated`);
  fs.unlinkSync(filePath);
  console.log(`Uploading to AWS S3 bucket`);
  // await uploadToS3(outoutPath, mp4FileName, uuid);

  // uploadToCoudinaty(outoutPath, uuid);
};

const uploadToS3 = async (hlsFolder, mp4FileName, uuid) => {
  try {
    const files = fs.readdirSync(hlsFolder);
    const uploadPromises = files.map(async (file) => {
      if (!file.startsWith(mp4FileName.replace('.', '_'))) {
        return;
      }
      const filePath = path.join(hlsFolder, file);
      const contentType = file.endsWith('.ts')
        ? 'video/mp2t'
        : file.endsWith('.m3u8')
          ? 'application/x-mpegURL'
          : null;

      if (contentType) {
        await uploadToAwsS3(filePath, `videos/${uuid}/${file}`, contentType);
        console.log(`Uploaded ${file} to S3`);
      }
    });

    // Wait for all uploads to complete
    await Promise.all(uploadPromises);

    // Clean up local folder after successful uploads
    fs.rmdirSync(hlsFolder, { recursive: true });
    console.log(`Uploaded all media to S3 and cleaned up local files.`);
  } catch (error) {
    console.error('Error during upload to S3:', error);
  } finally {
    console.timeEnd('req_time');
  }
};

export default convertToHLS;
