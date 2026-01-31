import { baseServices } from "./baseService";
import type { 
  ProjectClientEngagement, 
  CreateProjectClientEngagementRequest, 
  UpdateProjectClientEngagementRequest 
} from "../types";

export const projectClientEngagementsApi = {
  getAll: () => baseServices.get("/projectclientengagements"),
  
  getProjectEngagements: () => 
    baseServices.get("/projectclientengagements/projects"),
  
  getClientEngagements: () => 
    baseServices.get("/projectclientengagements/clients"),
  
  getById: (id: number) => 
    baseServices.get(`/projectclientengagements/${id}`),
  
  create: (data: CreateProjectClientEngagementRequest) => 
    baseServices.post<ProjectClientEngagement>("/projectclientengagements", data),
  
  update: (id: number, data: UpdateProjectClientEngagementRequest) => 
    baseServices.put<ProjectClientEngagement>(`/projectclientengagements/${id}`, data),
  
  delete: (id: number) => 
    baseServices.delete(`/projectclientengagements/${id}`),
};