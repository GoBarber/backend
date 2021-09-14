import { Router } from 'express';
import { getCustomRepository } from "typeorm";

import ProjectsRepository from '../repositories/ProjectsRepository';
import CreateProjectService from '../services/CreateProjectService';


const projectsRouter = Router();
const projectsRepository = new ProjectsRepository();


projectsRouter.get('/', async (request, response) => {
  const projectsRepository = getCustomRepository(ProjectsRepository);
  const projects = await projectsRepository.find();

  return response.json(projects);
});



projectsRouter.post('/', async (request, response) => {
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



export default projectsRouter;
