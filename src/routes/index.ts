import { Router } from 'express';

const routes = Router();

routes.get('/', (request, response) => {
  // const { name, email } = request.body;

  response.json({ message: '111aaa' });
});

export default routes;
