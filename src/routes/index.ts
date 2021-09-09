import { Router } from 'express';
import projectsRouter from './projects.routes';

const routes = Router();

routes.use('/projects', projectsRouter);

export default routes;
