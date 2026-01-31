import { baseServices } from "./baseService";

export interface Skill {
  id: number;
  name: string;
}

export interface CreateSkillRequest {
  name: string;
}

export interface UpdateSkillRequest {
  name: string;
}

class SkillsService {
  async getAll(): Promise<Skill[]> {
    return baseServices.get<Skill[]>("skills");
  }

  async getById(id: number): Promise<Skill> {
    return baseServices.get<Skill>(`skills/${id}`);
  }

  async create(skill: CreateSkillRequest): Promise<Skill> {
    return baseServices.post<Skill>("skills", skill);
  }

  async update(id: number, skill: UpdateSkillRequest): Promise<Skill> {
    return baseServices.put<Skill>(`skills/${id}`, skill);
  }

  async delete(id: number): Promise<void> {
    return baseServices.delete<void>(`skills/${id}`);
  }
}

export const skillsService = new SkillsService();