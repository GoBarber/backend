import fs from 'fs';
import path from 'path';
import { inject, injectable } from 'tsyringe';

import uploadConfig from '@config/upload';
import AppError from '@shared/errors/AppError';
import IStorageProvider from '@shared/container/helper/StorageHelper/models/IStorageProvider';

import User from '../infra/typeorm/entities/User';
import IUserRepository from '../repositories/IUserRepository';

interface Request {
  user_id: string;
  avatarFilename: string;
}

@injectable()
class UpdateUserAvatarService {
  constructor(
    @inject('UsersRepository')
    private userRepository: IUserRepository,

    @inject('StorageProvider')
    private storageProvider: IStorageProvider,
  ) {}

  public async execute({ user_id, avatarFilename }: Request): Promise<User> {
    const user = await this.userRepository.findById(user_id);

    if (!user)
      throw new AppError(
        'Apenas usuário autenticados podem mudar o avatar.',
        401,
      );

    // Se já possuir avatar, o deleta.
    if (user.avatar) this.storageProvider.deleteFile(user.avatar);

    // Adiciona o novo avatar
    const fileName = await this.storageProvider.saveFile(avatarFilename);
    user.avatar = fileName;

    await this.userRepository.save(user);

    return user;
  }
}

export default UpdateUserAvatarService;
