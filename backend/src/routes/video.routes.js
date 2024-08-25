import { Router } from "express";
import {
  getVidoes,
  getSingleVideo,
  postVideos,
} from "../controllers/video.controllers.mjs";
import { body } from "express-validator";

import multer from "multer";
const upload = multer();

const router = Router();

router.get("/", getVidoes);
router.get("/:id", getSingleVideo);
router.post("/", body("title").isString(), postVideos);

export default router;
