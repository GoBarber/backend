import { Router } from 'express';
import SessionsController from '../controllers/SessionsController';

const sessionRouter = Router();
const controller = new SessionsController();

sessionRouter.post('/', controller.create);

export default sessionRouter;
