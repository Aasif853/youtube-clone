import { Router } from "express";
import userRouter from "./user.routes.js";
import videoRouter from "./video.routes.js";
import channelRouter from "./channel.routes.js";
import uploadRouter from "./upload.routes.js";

const router = Router();

// app.use('/auth');
router.use("/users", userRouter);
router.use("/upload", uploadRouter);
router.use("/videos", videoRouter);
router.use("/channel", channelRouter);

export default router;
