import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import User from '../infra/typeorm/entities/User';
import IUserRepository from '../repositories/IUserRepository';
import IHashProvider from '../helpers/HashHelper/models/IHashProvider';

interface Request {
  name: string;
  email: string;
  password: string;
}

@injectable()
class CreateUserService {
  constructor(
    @inject('UsersRepository')
    private userRepository: IUserRepository,

    @inject('HashProvider')
    private hashProvider: IHashProvider,
  ) {}

  async execute({ name, email, password }: Request): Promise<User> {
    const checkUserExists = await this.userRepository.findByEmail(email);
    if (checkUserExists) throw new AppError('Email já registrado.');

    const hashedPassword = await this.hashProvider.generateHash(password);

    const user = await this.userRepository.create({
      name,
      email,
      password: hashedPassword,
    });

    return user;
  }
}

export default CreateUserService;
