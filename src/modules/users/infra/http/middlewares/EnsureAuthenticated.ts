import { verify } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

import authConfig from '@config/auth';
import AppError from '@shared/errors/AppError';

interface TokenPayload {
  iat: number;
  exp: number;
  sub: string;
}

interface User {
  id: string;
}

export default function EnsureAuthenticated(
  request: Request,
  response: Response,
  next: NextFunction,
): void {
  const authHeader = request.headers.authorization;

  if (!authHeader) throw new AppError('JWT token is missing', 401);

  const [, token] = authHeader.split(' '); // Barrer token

  try {
    const decoded = verify(token, authConfig.jwt.secret);

    // Como decoded tem 2 possíveis retornos (string ou object), esta sintaxe força que a variável seja reconhecida como a interface que foi criada
    const { sub } = decoded as TokenPayload;

    // Como request não tem o atributo usuário, é possível sobrescrever a tipagem da biblioteca
    // Para isso, será usada a configuração apresentada em  @types
    request.user = {
      id: sub,
    };

    return next();
  } catch {
    throw new AppError('Invalid JWT Token.', 406);
  }
}
