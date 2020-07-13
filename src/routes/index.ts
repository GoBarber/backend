import { Request, Response, Router, NextFunction } from 'express';

import { uuid, isUuid } from 'uuidv4';

const routes = Router();

const projects: Array<any> = [];

// Middlewares
function validateProjectId(
  request: Request,
  response: Response,
  next: NextFunction,
) {
  const { id } = request.params;

  if (!isUuid(id))
    return response.status(404).json({ error: 'Invalid Project ID.' });

  return next();
}

routes.use('/projects/:id', validateProjectId);

routes.get('/projects', (request, response) => {
  const { title } = request.query;

  const result = title
    ? projects.filter(project => project.title.includes(title))
    : projects;

  response.json(result);
});

routes.post('/projects', (request, response) => {
  const { title, owner } = request.body;
  const project = { id: uuid(), title, owner };

  projects.push(project);
  return response.json(project);
});

routes.put('/projects/:id', (request, response) => {
  const { id } = request.params;
  const { title, owner } = request.body;
  const projectIndex = projects.findIndex(project => project.id === id);

  const project = {
    id,
    title,
    owner,
  };

  projects[projectIndex] = project;

  return response.json(project);
});

routes.delete('/projects/:id', (request, response) => {
  const { id } = request.params;
  const projectIndex = projects.findIndex(project => project.id === id);

  projects.splice(projectIndex, 1);

  return response.status(204).send();
});

export default routes;
