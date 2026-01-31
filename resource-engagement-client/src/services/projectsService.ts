import { baseServices } from "./baseService";
import type {
  Project,
  CreateProjectRequest,
  UpdateProjectRequest,
} from "../types";

class ProjectsService {
  async getAll(): Promise<Project[]> {
    return await baseServices.get("projects");
  }

  async getById(id: number): Promise<Project> {
    return await baseServices.get(`projects/${id}`);
  }

  async create(payload: CreateProjectRequest): Promise<Project> {
    return await baseServices.post<Project>("projects", payload);
  }

  async update(id: number, payload: UpdateProjectRequest): Promise<Project> {
    return await baseServices.put<Project>(`projects/${id}`, payload);
  }

  async delete(id: number): Promise<void> {
    await baseServices.delete<void>(`projects/${id}`);
  }
}

export const projectsService = new ProjectsService();
