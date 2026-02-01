import { baseServices } from "./baseService";
import type {
  EngagementPosition,
  CreateEngagementPositionRequest,
  UpdateEngagementPositionRequest,
} from "../types";

export const engagementPositionsApi = {
  getAll: () => baseServices.get("/engagementpositions"),
  
  getByEngagementId: (engagementId: number) => 
    baseServices.get(`/engagementpositions/engagement/${engagementId}`),
  
  getById: (id: number) => 
    baseServices.get(`/engagementpositions/${id}`),
  
  create: (data: CreateEngagementPositionRequest) => 
    baseServices.post<EngagementPosition>("/engagementpositions", data),
  
  update: (id: number, data: UpdateEngagementPositionRequest) => 
    baseServices.put<EngagementPosition>(`/engagementpositions/${id}`, data),
  
  delete: (id: number) => 
    baseServices.delete(`/engagementpositions/${id}`),
};