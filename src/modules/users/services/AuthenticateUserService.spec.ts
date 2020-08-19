import AppError from '@shared/errors/AppError';
import AuthenticateUserService from './AuthenticateUserService';
import FakeUserRepository from '../repositories/fakes/FakeUserRepository';
import FakeHashProvider from '../helpers/HashHelper/fakes/FakeHashProvider';
import CreateUserService from './CreateUserService';
import User from '../infra/typeorm/entities/User';

describe('AuthenticateUser', () => {
  let authUser: AuthenticateUserService;
  let user: User;
  const fakeHasProvider: FakeHashProvider = new FakeHashProvider();

  beforeEach(async () => {
    const fakeRepo = new FakeUserRepository();
    const createUser = new CreateUserService(fakeRepo, fakeHasProvider);

    authUser = new AuthenticateUserService(fakeRepo, fakeHasProvider);

    user = await createUser.execute({
      name: 'Teste',
      email: 'teste@gmail.com',
      password: '123@56',
    });
  });

  it('should be able to authenticate user', async () => {
    const response = await authUser.execute({
      email: 'teste@gmail.com',
      password: '123@56',
    });

    expect(response).toHaveProperty('token');
    expect(response).toHaveProperty('user');
    expect(response.user).toEqual(user);
  });

  it('should not authenticate user with email not registred', async () => {
    try {
      await authUser.execute({
        email: 'teste2@gmail.com',
        password: '123@56',
      });
    } catch (error) {
      expect(error).toBeInstanceOf(AppError);
      expect(error).toHaveProperty('message');
      expect(error).toHaveProperty('statusCode');
    }
  });

  it('should not authenticate user with wrong password', async () => {
    try {
      await authUser.execute({
        email: 'teste@gmail.com',
        password: '123@567',
      });
    } catch (error) {
      expect(error).toBeInstanceOf(AppError);
      expect(error).toHaveProperty('message');
      expect(error).toHaveProperty('statusCode');
    }
  });
});
