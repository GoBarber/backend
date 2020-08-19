import AppError from '@shared/errors/AppError';
import FakeStorageProvider from '@shared/container/helper/StorageHelper/fakes/FakeStorageProvider';

import User from '../infra/typeorm/entities/User';
import FakeUserRepository from '../repositories/fakes/FakeUserRepository';
// import FakeHashProvider from '../helpers/HashHelper/fakes/FakeHashProvider';
import UpdateUserAvatarService from './UpdateUserAvatarService';

describe('UpdateUserAvatar', () => {
  let user: User;
  let updateAvatar: UpdateUserAvatarService;
  let fakeStorageProvider: FakeStorageProvider;

  beforeEach(async () => {
    const fakeRepo = new FakeUserRepository();

    fakeStorageProvider = new FakeStorageProvider();
    updateAvatar = new UpdateUserAvatarService(fakeRepo, fakeStorageProvider);

    user = await fakeRepo.create({
      name: 'Teste',
      email: 'teste@teste.com',
      password: 'teste123',
    });
  });

  it('should create user avatar', async () => {
    await updateAvatar.execute({
      avatarFilename: 'avatar.jpg',
      user_id: user.id,
    });

    expect(user).toHaveProperty('avatar');
    expect(user.avatar).toBe('avatar.jpg');
  });

  it('should not update avatar of unauthenticated user', async () => {
    try {
      await updateAvatar.execute({
        avatarFilename: 'avatar.jpg',
        user_id: 'non-existent-user',
      });
    } catch (error) {
      expect(error).toBeInstanceOf(AppError);
      expect(error).toHaveProperty('message');
      expect(error).toHaveProperty('statusCode');
    }
  });

  it('should delete avatar if user already had one', async () => {
    const deleteFileFunction = jest.spyOn(fakeStorageProvider, 'deleteFile');

    await updateAvatar.execute({
      avatarFilename: 'avatar.jpg',
      user_id: user.id,
    });

    await updateAvatar.execute({
      avatarFilename: 'updatedAvatar.jpg',
      user_id: user.id,
    });

    expect(user).toHaveProperty('avatar');
    expect(user.avatar).toBe('updatedAvatar.jpg');
    expect(deleteFileFunction).toHaveBeenCalledWith('avatar.jpg');
  });
});
