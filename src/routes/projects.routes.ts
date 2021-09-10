import { Router } from 'express';

import ProjectsRepository from '../repositories/ProjectsRepository';
import CreateProjectServiceService from '../services/CreateProjectService';


const projectsRouter = Router();
const projectsRepository = new ProjectsRepository();


projectsRouter.get('/', (request, response) => {
  const projects = projectsRepository.all();

  return response.json(projects);
});



projectsRouter.post('/', (request, response) => {
  const { url, name, description } = request.body;

  try {
    const createProject = new CreateProjectServiceService(projectsRepository);
    const project = createProject.execute({url, name, description});

    return response.json(project);
  }
  catch (e) {
    const { message } = e as Error
    return response.status(400).json({ message: message });
  }
});



export default projectsRouter;
