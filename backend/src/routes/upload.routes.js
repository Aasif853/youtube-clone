import { Router } from "express";
import { body } from "express-validator";
import {
  initializeUpload,
  uploadChunk,
  completeUpload,
} from "../controllers/upload.controller.mjs";
import multer from "multer";
const upload = multer();

const router = Router();

router.post("/initialize", uploadFileToS3);
router.post("/chunk", upload.single("chunkData"), uploadFileToS3);
router.post("/complete", uploadFileToS3);

export default router;
