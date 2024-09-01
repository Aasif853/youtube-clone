import { Router } from 'express';
import {
  registerUser,
  logoutUser,
  signIpWithGoogle,
  refreshAccesToken,
  getCurrentUser,
  updateUserDetails,
  updateUserAvatar,
} from '../controllers/user.controller.js';
import { upload } from '../middleware/multer.middleware.js';
import verifyJWT from '../middleware/auth.middleware.js';
const router = Router();

router.route('/register').post(upload.single('avatar'), registerUser);
router.route('/google_sign_in').post(signIpWithGoogle);
router.route('/refresh-token').post(refreshAccesToken);

// secured routes
router.route('/getCurrentUser').get(verifyJWT, getCurrentUser);
router.route('/udpateAvatar').put(verifyJWT, updateUserAvatar);
router.route('/:id').put(verifyJWT, updateUserDetails);
router.route('/logout').post(verifyJWT, logoutUser);

export default router;
