import { Router } from "express";
import {
  initializeUpload,
  uploadChunk,
  completeUpload,
} from "../controllers/upload.controller.mjs";
import multer from "multer";
const upload = multer();

const router = Router();

router.post("/initialize", initializeUpload);
router.post("/chunk", upload.single("chunkData"), uploadChunk);
router.post("/complete", completeUpload);

export default router;
