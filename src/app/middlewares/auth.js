import jwt from 'jsonwebtoken';
import authConfig from '../../config/auth';

export default async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader)
    return res.status(401).json({ error: 'Token not provided.' });

  // A sintaxe [, token] significa que o [1] será atribuído à constante token
  const [, token] = authHeader.split(' ');

  jwt.verify(token, authConfig.secret, (err, result) => {
    if (err) return res.status(401).json({ error: 'Invalid Token.' });
    req.userId = result.id;

    return next();
  });

  return 0;
};
