import { Router } from 'express';
import {
  getChannelDetails,
  subscribeToChannel,
  unSubscribeToChannel,
  updateChannel,
  updateImages,
} from '../controllers/channel.controllers.js';
import verifyJWT from '../middleware/auth.middleware.js';
import { upload } from '../middleware/multer.middleware.js';

const router = Router();

router.get('/:id', verifyJWT(true), getChannelDetails);
router.post('/:id/subscribe', verifyJWT(), subscribeToChannel);
router.post('/:id/unsubscribe', verifyJWT(), unSubscribeToChannel);
router.put('/:id', verifyJWT(), updateChannel);
router.put(
  '/image/:id',
  verifyJWT(),
  upload.fields([
    { name: 'avatar', maxCount: 1 },
    { name: 'coverImage', maxCount: 1 },
  ]),
  updateImages
);

export default router;
