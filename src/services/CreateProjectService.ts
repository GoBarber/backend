import Project from '../models/Project';
import ProjectsRepository from '../repositories/ProjectsRepository';

interface Request {
    url: string;
    name: string;
    description: string;
}


class CreateProjectService {
  private projectsRepository: ProjectsRepository;

  constructor(projectsRepository: ProjectsRepository) {
    this.projectsRepository = projectsRepository;
  }

  public execute({ url, name, description }: Request): Project {
    const findoProjectSameURL = this.projectsRepository.findByURL(url);

    if (findoProjectSameURL) {
      throw Error('This project is already registered.');
    }

    const project = this.projectsRepository.create({ url, name, description });

    return project;
  }
}

export default CreateProjectService;
