import AWS from 'aws-sdk';
import fs from 'fs';

AWS.config.update({
  region: process.env.S3_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});
const storage = new AWS.S3();

export const uploadToAwsS3 = async (
  localFilePath,
  key,
  contentType = false
) => {
  try {
    if (!localFilePath) return null;

    // const file = fs.readFileSync(localFilePath);
    const fileStream = fs.createReadStream(localFilePath);

    const params = {
      Bucket: process.env.AWS_BUCKET,
      Key: key,
      Body: fileStream,
    };
    if (contentType) {
      params['contentType'] = contentType;
    }
    const uploadResult = await storage
      .upload(params)
      .promise()
      .catch((error) => {
        console.log(error);
      });
    if (fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
    }
    return uploadResult;
  } catch (err) {
    if (fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
    }
  }
};

export const getSignedS3Url = async (objectKey, expiresInSeconds = 3600) => {
  const params = {
    Bucket: process.env.AWS_BUCKET,
    Key: objectKey,
    Expires: expiresInSeconds, // URL expires in 1 hour (default)
  };

  return storage.getSignedUrlPromise('getObject', params);
};
