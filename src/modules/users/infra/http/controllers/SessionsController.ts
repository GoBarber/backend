import { container } from 'tsyringe';
import { Request, Response } from 'express';

import AuthenticateUserService from '@modules/users/services/AuthenticateUserService';

export default class SessionsController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { email, password } = request.body;

    const auth = container.resolve(AuthenticateUserService);

    const { user, token } = await auth.execute({
      email,
      password,
    });

    delete user.password;

    return response.json({
      user,
      token,
    });
  }
}
