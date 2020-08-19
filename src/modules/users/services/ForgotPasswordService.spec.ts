// import AppError from '@shared/errors/AppError';

import FakeMailProvider from '@shared/container/helper/MailHelper/fakes/FakeMailProvider';

import AppError from '@shared/errors/AppError';
import ForgotPasswordService from './ForgotPasswordService';
import FakeUserRepository from '../repositories/fakes/FakeUserRepository';

describe('ForgotPassword', () => {
  let forgotPassword: ForgotPasswordService;
  let fakeUserRepo: FakeUserRepository;
  let fakeMailProvider: FakeMailProvider;

  beforeEach(async () => {
    fakeMailProvider = new FakeMailProvider();
    fakeUserRepo = new FakeUserRepository();
    forgotPassword = new ForgotPasswordService(fakeUserRepo, fakeMailProvider);
  });

  it('should be able to recover password', async () => {
    await fakeUserRepo.create({
      name: 'Teste',
      email: 'teste@teste.com',
      password: 'teste123',
    });

    const sendMailSpy = jest.spyOn(fakeMailProvider, 'sendMail');

    await forgotPassword.execute({
      email: 'teste@teste.com',
    });

    expect(sendMailSpy).toHaveBeenCalled();
  });

  it('should not recover password of non-existing user', async () => {
    try {
      await forgotPassword.execute({
        email: 'teste@teste.com',
      });

      expect(true).toBe(false);
    } catch (error) {
      expect(error).toBeInstanceOf(AppError);
      expect(error).toHaveProperty('message');
      expect(error).toHaveProperty('statusCode');
      expect(error.message).toBe('Email não cadastrado.');
    }
  });
});
