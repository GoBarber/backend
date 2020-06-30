import { Router } from 'express';
import User from './app/models/User';

const routes = new Router();

routes.get('/', async (req, res) => {
  const user = await User.create({
    name: 'Bernardo Henrique',
    email: 'bernardo@gmail.com',
    password_hash: '1203190318',
  });

  res.json(user);
});

export default routes;
