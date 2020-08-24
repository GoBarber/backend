import AppError from '@shared/errors/AppError';

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
    const hashGeneratorSpy = jest.spyOn(fakeHashProvider, 'generateHash');

    const { token } = await fakeTokenRepo.generate(user.id);
    await resetPassword.execute({ password: '123123', token });

    const updatedUser = await fakeUserRepo.findById(user.id);

    expect(updatedUser?.password).toBe('123123');
    expect(hashGeneratorSpy).toBeCalledWith('123123');
  });

  it('should not reset password when wrong token is passed', async () => {
    try {
      const token = 'token_inexistente';
      await resetPassword.execute({ password: '123123', token });

      fail('it should not reach here');
    } catch (error) {
      expect(error).toEqual(
        new AppError('Este usuário não solicitou mudanças de senha.'),
      );
    }
  });

  it('should not reset password for non-existing user', async () => {
    try {
      const { token } = await fakeTokenRepo.generate('qsdasdsa');
      await resetPassword.execute({ password: '123123', token });

      fail('it should not reach here');
    } catch (error) {
      expect(error).toEqual(new AppError('Usuário inexistente.'));
    }
  });

  it('should not reset password after two hours', async () => {
    try {
      const { token } = await fakeTokenRepo.generate(user.id);

      // Adds three hours.
      jest.spyOn(Date, 'now').mockImplementationOnce(() => {
        const customDate = new Date();
        return customDate.setHours(customDate.getHours() + 3);
      });

      await resetPassword.execute({ password: '123123', token });

      fail('it should not reach here');
    } catch (error) {
      expect(error).toEqual(new AppError('Token Expirado.'));
    }
  });
});
