import Project from '../models/Project';

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


  public create(url: string, name: string, description: string): Project {
    const appointment = new Project(url, name, description);

    this.projects.push(appointment);

    return appointment;
  }
}

export default ProjectsRepository;