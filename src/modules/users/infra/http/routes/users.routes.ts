import multer from 'multer';
import { Router } from 'express';

import uploadConfig from '@config/upload';

import UsersController from '../controllers/UsersControllers';
import ensureAuth from '../middlewares/EnsureAuthenticated';
import UserAvatarController from '../controllers/UserAvatarControllers';

const userRouter = Router();
const upload = multer(uploadConfig);
const userController = new UsersController();
const userAvatarController = new UserAvatarController();

// User
userRouter.post('/', userController.create);

// Avatar
userRouter.patch(
  '/avatar',
  ensureAuth,
  upload.single('avatar'),
  userAvatarController.update,
);

export default userRouter;
