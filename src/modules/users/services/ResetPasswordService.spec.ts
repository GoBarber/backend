// import AppError from '@shared/errors/AppError';

import User from '../infra/typeorm/entities/User';
import ResetPasswordService from './ResetPasswordService';
import FakeUserRepository from '../repositories/fakes/FakeUserRepository';
import FakeHashProvider from '../helpers/HashHelper/fakes/FakeHashProvider';
import FakeUserTokensRepository from '../repositories/fakes/FakeUserTokenRepository';

describe('ResetPassword', () => {
  let fakeUserRepo: FakeUserRepository;
  let fakeTokenRepo: FakeUserTokensRepository;
  let resetPassword: ResetPasswordService;
  let fakeHashProvider: FakeHashProvider;

  let user: User;

  beforeEach(async () => {
    fakeHashProvider = new FakeHashProvider();

    fakeUserRepo = new FakeUserRepository();
    fakeTokenRepo = new FakeUserTokensRepository();
    resetPassword = new ResetPasswordService(
      fakeUserRepo,
      fakeTokenRepo,
      fakeHashProvider,
    );

    user = await fakeUserRepo.create({
      name: 'Teste',
      email: 'teste@teste.com',
      password: '123456',
    });
  });

  it('should be able to reset the password', async () => {
    const { token } = await fakeTokenRepo.generate(user.id);

    await resetPassword.execute({ password: '123123', token });

    const updatedUser = await fakeUserRepo.findById(user.id);

    expect(updatedUser?.password).toBe('123123');
  });
});
