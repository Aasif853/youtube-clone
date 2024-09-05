import { Router } from 'express';
import {
  initializeUpload,
  uploadChunk,
  completeUpload,
} from '../controllers/upload.controller.mjs';
import {
  hanleFileChunking,
  processVideoFile,
} from '../controllers/transcode.controller.js';
import { upload } from '../middleware/multer.middleware.js';
import verifyJWT from '../middleware/auth.middleware.js';
const router = Router();

router.get('/hanleFileChunking', hanleFileChunking);
router.get('/processVideoFile', processVideoFile);
router.route('/initialize').post(verifyJWT, initializeUpload);
router.route('/chunk').post(verifyJWT, upload.single('chunkData'), uploadChunk);
router.route('/complete').post(verifyJWT, upload.single('thumbnail'), completeUpload);

export default router;
  