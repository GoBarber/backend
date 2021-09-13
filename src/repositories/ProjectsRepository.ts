import { EntityRepository, Repository } from "typeorm";

import Project from '../models/Project';


@EntityRepository(Project)
class ProjectsRepository extends Repository<Project> { 

  public async findByURL(url: string): Promise<Project | null> {
    const findProject = await this.findOne({ where: { url } });

    return findProject || null;
  }
  
}

export default ProjectsRepository;