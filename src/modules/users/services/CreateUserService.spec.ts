import AppError from '@shared/errors/AppError';
import CreateUserService from './CreateUserService';
import FakeUserRepository from '../repositories/fakes/FakeUserRepository';
import FakeHashProvider from '../helpers/HashHelper/fakes/FakeHashProvider';

describe('CreateUser', () => {
  let createUser: CreateUserService;

  beforeEach(() => {
    const fakeRepo = new FakeUserRepository();
    const fakeHashProvider = new FakeHashProvider();

    createUser = new CreateUserService(fakeRepo, fakeHashProvider);
  });

  it('should create a new user', async () => {
    const user = await createUser.execute({
      email: 'teste@gmail.com',
      name: 'Teste',
      password: '123@56',
    });

    expect(user).toHaveProperty('id');
    expect(user.email).toBe('teste@gmail.com');
  });

  it('should not create user with repeated email', async () => {
    await createUser.execute({
      email: 'teste@gmail.com',
      name: 'Teste',
      password: '123@56',
    });

    await expect(
      createUser.execute({
        email: 'teste@gmail.com',
        name: 'Teste2',
        password: '123@56',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
