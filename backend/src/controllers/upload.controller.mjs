import AWS from "aws-sdk";

import fs from "fs";
import { addVideoDetailsToDB } from "./video.controllers.mjs";

AWS.config.update({
  region: process.env.S3_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEYId,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});
const storage = new AWS.S3();

export const uploadFileToS3 = async (req, res) => {
  console.log("🚀 ~ uploadFileToS3 ~ req:", req.file);

  if (!req.file) return res.status(400).send("No file received");

  const file = req.file;

  const params = {
    Bucket: process.env.AWS_BUCKET,
    Key: file.originalname,
    Body: file.buffer,
  };

  storage.upload(params, (err, data) => {
    if (err) {
      console.log("🚀 ~ s3.upload ~ err:", err);
      res.status(400).send("File cannot be upload");
    } else {
      console.log("🚀 ~ s3.upload ~ data:", data);
      res.status(200).send("File upload successfully");
    }
  });
  //   res.json(req.file);
};

export const multiPartUploadToS3 = async (req, res) => {
  const filePath = "/Users/macos/Downloads/MP4 1280 10MG.mp4";

  if (!fs.existsSync(filePath)) res.status(400).send("File does not exist");

  const file = fs.statSync(filePath);
  console.log("🚀 ~ multiPartUploadToS3 ~ file:", file.size);

  const uploadParams = {
    Bucket: process.env.AWS_BUCKET,
    Key: "trial-key1",
    // ACL: 'public-read',
    ContentType: "video/mp4",
  };
  try {
    const multiPartParams = await storage
      .createMultipartUpload(uploadParams)
      .promise();
    console.log("🚀 ~ multiPartUploadToS3 ~ multiPartParams:", multiPartParams);

    const fileSize = file.size,
      chunSize = 10 * 1024 * 1024; // 10 MB
    const numberOfParts = Math.ceil(fileSize / chunSize);

    const uploadedETags = [];
    for (let chunkPart = 0; chunkPart < numberOfParts; chunkPart++) {
      const start = chunkPart * chunSize,
        end = Math.min(start + chunSize, fileSize);
      const partParams = {
        Bucket: uploadParams.Bucket,
        Key: uploadParams.Key,
        UploadId: multiPartParams.UploadId,
        PartNumber: chunkPart + 1,
        Body: fs.createReadStream(filePath, { start, end }),
        ContentLength: end - start,
      };

      const data = await storage.uploadPart(partParams).promise();
      console.log(
        "🚀 ~ multiPartUploadToS3 ~ data:",
        partParams.PartNumber,
        data.ETag,
      );
      uploadedETags.push({
        PartNumber: uploadedETags.PartNumber,
        ETag: data.ETag,
      });
    }
    const completeParams = {
      Bucket: uploadParams.Bucket,
      Key: uploadParams.Key,
      UploadId: multiPartParams.UploadId,
      //   MultipartUpload: { Parts: uploadedETags },
    };
    const data = await storage.listParts(completeParams).promise();
    const parts = data.Parts.map((part) => ({
      ETag: part.ETag,
      PartNumber: part.PartNumber,
    }));

    completeParams.MultipartUpload = {
      Parts: parts,
    };
    const completeRes = await storage
      .completeMultipartUpload(completeParams)
      .promise();
    console.log("🚀 ~ multiPartUploadToS3 ~ completeRes:", completeRes);
    const videoParam = {
      title: "test 1",
      description: "asdasdf",
      url: completeRes.Location,
      thumbnail: "asdfasdf",
      userId: "6fd6b37a-d3b5-4505-9a9f-6e2f7e933ecf",
    };
    try {
      const videoData = await addVideoDetailsToDB(videoParam);
      res.status(200).send("File Uploaded Successfully");
    } catch (err) {
      console.log("🚀 ~ createuser ~ err:", err);
      res.status(400);
      return res.status(400).send(err);
    }
  } catch (err) {
    console.log("🚀 ~ multiPartUploadToS3 ~ err:", err);

    res.sendStatus(400);
  }
};
