import sharp from 'sharp';
import { asyncHandler } from '../utils/asyncHandler';

const optimizeImage = asyncHandler(async (req, res, next) => {
  if (!req.file) {
    return next(new Error('No file uploaded'));
  }

  try {
    const filePath = req.file.path;

    // Optimize image using sharp and overwrite the original file
    await sharp(filePath)
      .resize({ width: 800 }) // Resize image to width of 800px
      .jpeg({ quality: 80 }) // Compress image to 80% quality for JPEG
      .toFile(filePath); // Overwrite the original file

    // Attach the optimized file details to req.file (optional, but keeps structure)
    req.file.optimizedPath = filePath;
    req.file.optimizedFilename = req.file.originalname;

    next();
  } catch (error) {
    next(error);
  }
});
