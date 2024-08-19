import AWS from "aws-sdk";
import fs from "fs";

AWS.config.update({
  region: process.env.S3_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});
const storage = new AWS.S3();

const uploadOnAws = (async = (localFilePath) => {
  if (!localFilePath) return null;

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
});
