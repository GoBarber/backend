import fs from 'fs';
import path from 'path';
import { getRepository } from 'typeorm';

import User from '../models/User';
import AppError from '../errors/AppError';
import uploadConfig from '../config/upload';

interface Request {
  user_id: string;
  avatarFilename: string;
}

class UpdateUserAvatarService {
  public async execute({ user_id, avatarFilename }: Request): Promise<User> {
    const userRepository = getRepository(User);

    const user = await userRepository.findOne(user_id);

    if (!user)
      throw new AppError('Only authenticated users can change avatar', 401);

    // Se já possuir avatar, o deleta.
    if (user.avatar) {
      const userAvatarFilePath = path.join(uploadConfig.directory, user.avatar);
      const userAvatarFileExistis = await fs.promises.stat(userAvatarFilePath); // Retorna true, caso caso o arquivo seja encontrado

      if (userAvatarFileExistis) await fs.promises.unlink(userAvatarFilePath);
    }

    // Adiciona o novo avatar
    user.avatar = avatarFilename;
    await userRepository.save(user);

    return user;
  }
}

export default UpdateUserAvatarService;
