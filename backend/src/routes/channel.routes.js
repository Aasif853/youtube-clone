import { Router } from "express";
import {
  getChannelDetails,
  subscribeToChannel,
} from "../controllers/channel.controllers.js";
import verifyJWT from "../middleware/auth.middleware.js";

// import multer from "multer";
// const upload = multer();

const router = Router();

router.get("/:id", getChannelDetails);
router.post("/:id/subscribe", verifyJWT, subscribeToChannel);

export default router;
