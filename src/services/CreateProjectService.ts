import { getCustomRepository } from "typeorm";

import Project from '../models/Project';
import ProjectsRepository from '../repositories/ProjectsRepository';


interface Request {
    url: string;
    name: string;
    description: string;
}


class CreateProjectService {
  public async execute({ url, name, description }: Request): Promise<Project> {
    const projectsRepository = getCustomRepository(ProjectsRepository);
    
    const findoProjectSameURL = await projectsRepository.findByURL(url);

    if (findoProjectSameURL) {
      throw Error('This project is already registered.');
    }

    const project = projectsRepository.create({ url, name, description });
    await projectsRepository.save(project);

    return project;
  }
}

export default CreateProjectService;
