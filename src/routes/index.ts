import { Router } from 'express';
import projectsRouter from './projects.routes';
import usersRouter from './users.routes';

const routes = Router();

routes.use('/projects', projectsRouter);
routes.use("/users", usersRouter);

export default routes;
