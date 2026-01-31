export interface Project {
  id: number;
  name: string;
  description: string;
  clientId: number;
}

export interface CreateProjectRequest {
  name: string;
  description: string;
  clientId: number;
}

export interface UpdateProjectRequest {
  name: string;
  description: string;
  clientId: number;
}
