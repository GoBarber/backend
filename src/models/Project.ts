import { uuid } from 'uuidv4';

class Project {
  id: string;

  url: string;

  name: string;

  description: string;

  constructor(url: string, name: string, description: string) {
    this.id = uuid();
    this.url = url;
    this.name = name;
    this.description = description;
  }
}

export default Project;