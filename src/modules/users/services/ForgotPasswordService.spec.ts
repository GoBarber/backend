import AppError from '@shared/errors/AppError';
import FakeMailProvider from '@shared/container/helper/MailHelper/fakes/FakeMailProvider';

import User from '../infra/typeorm/entities/User';
import ForgotPasswordService from './ForgotPasswordService';
import FakeUserRepository from '../repositories/fakes/FakeUserRepository';
import FakeUserTokensRepository from '../repositories/fakes/FakeUserTokenRepository';

describe('ForgotPassword', () => {
  let forgotPassword: ForgotPasswordService;
  let fakeUserRepo: FakeUserRepository;
  let fakeMailProvider: FakeMailProvider;
  let fakeTokenRepo: FakeUserTokensRepository;
  let user: User;

  beforeEach(async () => {
    fakeUserRepo = new FakeUserRepository();
    fakeMailProvider = new FakeMailProvider();
    fakeTokenRepo = new FakeUserTokensRepository();
    forgotPassword = new ForgotPasswordService(
      fakeUserRepo,
      fakeMailProvider,
      fakeTokenRepo,
    );

    user = await fakeUserRepo.create({
      name: 'Teste',
      email: 'teste@teste.com',
      password: 'teste123',
    });
  });

  it('should be able to recover password', async () => {
    const sendMailSpy = jest.spyOn(fakeMailProvider, 'sendMail');

    await forgotPassword.execute({ email: user.email });

    expect(sendMailSpy).toHaveBeenCalled();
  });

  it('should not recover password of non-existing user', async () => {
    try {
      await forgotPassword.execute({
        email: 'non_existing_email@email.com',
      });

      expect(true).toBe(false);
    } catch (error) {
      expect(error).toBeInstanceOf(AppError);
      expect(error).toHaveProperty('message');
      expect(error).toHaveProperty('statusCode');
      expect(error.message).toBe('Email não cadastrado.');
    }
  });

  it('should generate forgot password token', async () => {
    const generateTokenSpy = jest.spyOn(fakeTokenRepo, 'generate');

    await forgotPassword.execute({ email: user.email });

    expect(generateTokenSpy).toHaveBeenCalledWith(user.id);
  });
});
