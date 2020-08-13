import { Router } from 'express';

import AuthenticateUserService from '@modules/users/services/AuthenticateUserService';
import UserRepository from '@modules/users/infra/typeorm/repositories/UserRepository';

const sessionRouter = Router();

sessionRouter.post('/', async (request, response) => {
  const userRepository = new UserRepository();
  const { email, password } = request.body;

  const auth = new AuthenticateUserService(userRepository);

  const { user, token } = await auth.execute({
    email,
    password,
  });

  delete user.password;

  return response.json({
    user,
    token,
  });
});

export default sessionRouter;
