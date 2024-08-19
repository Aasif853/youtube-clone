import { Router } from 'express';
import {
  getVidoes,
  getSingleVideo,
  postVideos,
} from '../controllers/video.controllers.mjs';
import { body } from 'express-validator';
import {
  uploadFileToS3,
  multiPartUploadToS3,
} from '../controllers/upload.controller.mjs';
import multer from 'multer';
const upload = multer();

const router = Router();

router.get('/', getVidoes);
router.get('/:id', getSingleVideo);
router.post('/', body('title').isString(), postVideos);
router.post('/upload', upload.single('file'), uploadFileToS3);
// router.post('/upload', upload.single('file'), uploadFileToS3);
router.post('/multi-part-upload', multiPartUploadToS3);

export default router;
