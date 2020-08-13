import { compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';

import authConfig from '@config/auth';
import AppError from '@shared/errors/AppError';

import User from '../infra/typeorm/entities/User';
import IUserRepository from '../repositories/IUserRepository';

interface Request {
  email: string;
  password: string;
}

interface Response {
  user: User;
  token: string;
}

class AuthenticateUserService {
  constructor(private userRepository: IUserRepository) {}

  public async execute({ email, password }: Request): Promise<Response> {
    const user = await this.userRepository.findByEmail(email);

    if (!user)
      throw new AppError('Combinação incorreta de email e senha.', 401);

    const match = await compare(password, user.password);
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
