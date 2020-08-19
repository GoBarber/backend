import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import IMailProvider from '@shared/container/helper/MailHelper/models/IMailProvider';

import IUserRepository from '../repositories/IUserRepository';

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
  ) {}

  async execute({ email }: Request): Promise<void> {
    const checkUserExists = await this.userRepository.findByEmail(email);
    if (!checkUserExists) throw new AppError('Email não cadastrado.');

    await this.mailProvider.sendMail(email, 'Recuperar.');
  }
}

export default ForgotPasswordService;
