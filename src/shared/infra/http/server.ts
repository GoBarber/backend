/* eslint-disable no-console */
import 'reflect-metadata';

import cors from 'cors';
import 'express-async-errors';
import express, { Request, Response, NextFunction } from 'express';

import '../database';
import routes from './routes';
import AppError from '../../errors/AppError';
import uploadConfig from '../../../config/upload';

const app = express();

app.use(cors());
app.use(express.json());
app.use('/files', express.static(uploadConfig.directory));
app.use(routes);

// O middleware para tratativa de erro deve ser colocar depois das rotas
// Diferente de outros middlewares, possui 4 parâmetros
app.use((err: Error, request: Request, response: Response, _: NextFunction) => {
  if (err instanceof AppError) {
    return response
      .status(err.statusCode)
      .json({ status: 'error', message: err.message });
  }

  console.error(err);
  return response.status(500).json({
    status: 'error',
    message: 'Internal Server Error',
  });
});

app.listen(3333, () => {
  console.log('Server started on port 3333!');
});
