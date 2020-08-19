import { sign } from 'jsonwebtoken';

import { inject, injectable } from 'tsyringe';

import authConfig from '@config/auth';
import AppError from '@shared/errors/AppError';

import User from '../infra/typeorm/entities/User';
import IUserRepository from '../repositories/IUserRepository';
import IHashProvider from '../helpers/HashHelper/models/IHashProvider';

interface Request {
  email: string;
  password: string;
}

interface Response {
  user: User;
  token: string;
}

@injectable()
class AuthenticateUserService {
  constructor(
    @inject('UsersRepository')
    private userRepository: IUserRepository,

    @inject('HashProvider')
    private hashProvider: IHashProvider,
  ) {}

  public async execute({ email, password }: Request): Promise<Response> {
    const user = await this.userRepository.findByEmail(email);

    if (!user)
      throw new AppError('Combinação incorreta de email e senha.', 401);

    const match = await this.hashProvider.compareHash(password, user.password);
    if (!match)
      throw new AppError('Combinação incorreta de email e senha.', 401);

    const token = sign({}, authConfig.jwt.secret, {
      subject: user.id,
      expiresIn: authConfig.jwt.expiredIn,
    });

    return {
      user,
      token,
    };
  }
}

export default AuthenticateUserService;
