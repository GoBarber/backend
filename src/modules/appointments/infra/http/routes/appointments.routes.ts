import { Router } from 'express';

import ensureAuthenticated from '@modules/users/infra/http/middlewares/EnsureAuthenticated';

import AppointmentsController from '../controllers/AppointmentController';

const appointmentsRouter = Router();
const controller = new AppointmentsController();

appointmentsRouter.use(ensureAuthenticated);

appointmentsRouter.post('/', controller.create);

export default appointmentsRouter;
