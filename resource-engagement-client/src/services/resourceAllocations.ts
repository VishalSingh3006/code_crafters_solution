import { baseServices } from "./baseService";
import type {
  ResourceAllocation,
  CreateResourceAllocationRequest,
  UpdateResourceAllocationRequest,
} from "../types";

export const resourceAllocationsApi = {
  getAll: () => baseServices.get("/resourceallocations"),
  
  getByEngagementId: (engagementId: number) => 
    baseServices.get(`/resourceallocations/engagement/${engagementId}`),
  
  getByEmployeeId: (employeeId: number) => 
    baseServices.get(`/resourceallocations/employee/${employeeId}`),
  
  getById: (id: number) => 
    baseServices.get(`/resourceallocations/${id}`),
  
  create: (data: CreateResourceAllocationRequest) => 
    baseServices.post<ResourceAllocation>("/resourceallocations", data),
  
  update: (id: number, data: UpdateResourceAllocationRequest) => 
    baseServices.put<ResourceAllocation>(`/resourceallocations/${id}`, data),
  
  delete: (id: number) => 
    baseServices.delete(`/resourceallocations/${id}`),
};