import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import IMailProvider from '@shared/container/helper/MailHelper/models/IMailProvider';

import IUserRepository from '../repositories/IUserRepository';
import IUserTokensRepository from '../repositories/IUserTokensRepository';

interface Request {
  email: string;
}

@injectable()
class ForgotPasswordService {
  constructor(
    @inject('UsersRepository')
    private userRepository: IUserRepository,

    @inject('EmailProvider')
    private mailProvider: IMailProvider,

    @inject('UserTokensRepository')
    private userTokensRepository: IUserTokensRepository,
  ) {}

  async execute({ email }: Request): Promise<void> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) throw new AppError('Email não cadastrado.');

    await this.userTokensRepository.generate(user.id);

    await this.mailProvider.sendMail(email, 'Recuperar.');
  }
}

export default ForgotPasswordService;
