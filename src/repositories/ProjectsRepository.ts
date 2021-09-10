import Project from '../models/Project';


interface CreateProjectDTO {
    url: string;
    name: string;
    description: string;
}


class ProjectsRepository {
  private projects: Project[];

  constructor() {
    this.projects = [];
  }


  public all(): Project[] {
    return this.projects;
  }


  public findByURL(url: string): Project | null {
      
    // Validation of url
    const findProject = this.projects.find(Project => url == Project.url);

    return findProject || null;
  }


  public create({url, name, description}: CreateProjectDTO): Project {
    const project = new Project({ url, name, description });

    this.projects.push(project);

    return project;
  }
}

export default ProjectsRepository;