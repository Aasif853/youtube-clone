import { Router } from 'express';
import {
  createuser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
} from '../controllers/user.controller.mjs';
import { checkSchema } from 'express-validator';
import { userValidator } from '../utils/user.validators.mjs';
import { resolveUserById } from '../utils/helper.mjs';
const router = Router();

router.route('/').get(getUsers).post(checkSchema(userValidator), createuser);
router
  .route('/:id')
  .get(resolveUserById, getUser)
  .put(resolveUserById, updateUser)
  .delete(resolveUserById, deleteUser);

export default router;
