export const hanleFileChunking = asyncHandler(async (req, res) => {
  const filePath = "./public/temp/echo.3-s01e01.mp4";
  const folderName = crypto.randomUUID();
  const chunkDir = `./public/temp/chunks/${folderName}`;
  console.log("filePath", filePath);
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

  return res
    .status(200)
    .json(new ApiRenponse(200, {}, "Uploaded Successfully"));
});
