import fs from 'fs';
import path from 'path';

import uploadConfig from '@config/upload';
import AppError from '@shared/errors/AppError';

import User from '../infra/typeorm/entities/User';
import IUserRepository from '../repositories/IUserRepository';

interface Request {
  user_id: string;
  avatarFilename: string;
}

class UpdateUserAvatarService {
  constructor(private userRepository: IUserRepository) {}

  public async execute({ user_id, avatarFilename }: Request): Promise<User> {
    const user = await this.userRepository.findById(user_id);

    if (!user)
      throw new AppError(
        'Apenas usuário autenticados podem mudar o avatar.',
        401,
      );

    // Se já possuir avatar, o deleta.
    if (user.avatar) {
      const userAvatarFilePath = path.join(uploadConfig.directory, user.avatar);
      const userAvatarFileExistis = await fs.promises.stat(userAvatarFilePath); // Retorna true, caso caso o arquivo seja encontrado

      if (userAvatarFileExistis) await fs.promises.unlink(userAvatarFilePath);
    }

    // Adiciona o novo avatar
    user.avatar = avatarFilename;
    await this.userRepository.save(user);

    return user;
  }
}

export default UpdateUserAvatarService;
