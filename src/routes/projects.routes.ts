import { Router } from 'express';
import { uuid } from 'uuidv4';
import ProjectsRepository from '../repositories/ProjectsRepository';

const projectsRouter = Router();
const projectsRepository = new ProjectsRepository();



projectsRouter.get('/', (request, response) => {
  const projects = projectsRepository.all();

  return response.json(projects);
});



projectsRouter.post('/', (request, response) => {
  const { url, name, description } = request.body;


  const findProjectSameURL = projectsRepository.findByURL(url);

  if (findProjectSameURL) {
    return response.status(400).json({ message: 'This project is already registered.' });
  }

  const Project = {
    id: uuid(),
    name,
    url,
    description
  };

  const project = projectsRepository.create(url, name, description);

  return response.json(project);
});



export default projectsRouter;
