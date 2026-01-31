import { baseServices } from "./baseService";
import type {
  Designation,
  CreateDesignationRequest,
  UpdateDesignationRequest,
} from "../types/designations";

class DesignationsService {
  async getAll(): Promise<Designation[]> {
    return await baseServices.get("designations");
  }

  async getById(id: number): Promise<Designation> {
    return await baseServices.get(`designations/${id}`);
  }

  async create(payload: CreateDesignationRequest): Promise<Designation> {
    return await baseServices.post("designations", payload);
  }

  async update(id: number, payload: UpdateDesignationRequest): Promise<Designation> {
    return await baseServices.put(`designations/${id}`, payload);
  }

  async delete(id: number): Promise<void> {
    await baseServices.delete(`designations/${id}`);
  }
}

export const designationsService = new DesignationsService();