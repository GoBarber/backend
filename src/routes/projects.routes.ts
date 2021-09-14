import { Router } from 'express';
import { getCustomRepository } from "typeorm";

import ProjectsRepository from '../repositories/ProjectsRepository';
import CreateProjectService from '../services/CreateProjectService';
import ensureAuthenticated from '../middlewares/EnsureAuthenticated';


const projectsRouter = Router();
// projectsRouter.use(ensureAuthenticated); // COLOCAR PARA APENAS UMA ROTA!!!!



projectsRouter.get('/', async (request, response) => {
  const projectsRepository = getCustomRepository(ProjectsRepository);
  const projects = await projectsRepository.find();

  return response.json(projects);
});



projectsRouter.post('/', ensureAuthenticated, async (request, response) => {
  try {
    const { url, name, description, user_id} = request.body;
    
    const createProject = new CreateProjectService();
    const project = await createProject.execute({ url, name, description, user_id });

    return response.json(project);
  }
  catch (e) {
    const { message } = e as Error
    return response.status(400).json({ message: message });
  }
});


projectsRouter.get('/my-projects', ensureAuthenticated, async (request, response) => {
  const projectsRepository = getCustomRepository(ProjectsRepository);

  const id = request.user.id
  const projects = await projectsRepository.find({ where: { user_id: id } });

  return response.json(projects);
});



export default projectsRouter;
