import { Router } from "express";
import {
  registerUser,
  logoutUser,
  signIpWithGoogle,
  refreshAccesToken,
  createuser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
} from "../controllers/user.controller.js";
import { upload } from "../middleware/multer.middleware.js";
import verifyJWT from "../middleware/auth.middleware.js";
const router = Router();

router.route("/register").post(upload.single("avatar"), registerUser);
router.route("/google_sign_in").post(signIpWithGoogle);
router.route("/refresh-token").post(refreshAccesToken);

// secured routes
router.route("/").get(getUsers).post(verifyJWT, createuser);
router
  .route("/:id")
  .get(verifyJWT, getUser)
  .put(verifyJWT, updateUser)
  .delete(verifyJWT, deleteUser);
router.route("/logout").post(verifyJWT, logoutUser);

export default router;
