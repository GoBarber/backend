import { inject, injectable } from 'tsyringe';
import { differenceInHours } from 'date-fns';

import AppError from '@shared/errors/AppError';

import IUserRepository from '../repositories/IUserRepository';
import IHashProvider from '../helpers/HashHelper/models/IHashProvider';
import IUserTokensRepository from '../repositories/IUserTokensRepository';

interface Request {
  password: string;
  token: string;
}

@injectable()
class ResetPasswordService {
  constructor(
    @inject('UsersRepository')
    private userRepository: IUserRepository,

    @inject('UserTokensRepository')
    private userTokensRepository: IUserTokensRepository,

    @inject('HashProvider')
    private hashProvider: IHashProvider,
  ) {}

  async execute({ password, token }: Request): Promise<void> {
    const userToken = await this.userTokensRepository.findByToken(token);

    if (!userToken)
      throw new AppError('Este usuário não solicitou mudanças de senha.');

    const tokenCreation = userToken.created_at;

    if (differenceInHours(Date.now(), tokenCreation) > 2)
      throw new AppError('Token Expirado.');

    const user = await this.userRepository.findById(userToken.user_id);

    if (!user) throw new AppError('Usuário inexistente.');

    user.password = await this.hashProvider.generateHash(password);

    await this.userRepository.save(user);
  }
}

export default ResetPasswordService;
