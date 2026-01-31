import { baseServices } from "./baseService";
import type {
  Department,
  CreateDepartmentRequest,
  UpdateDepartmentRequest,
} from "../types/departments";

class DepartmentsService {
  async getAll(): Promise<Department[]> {
    return await baseServices.get("departments");
  }

  async getById(id: number): Promise<Department> {
    return await baseServices.get(`departments/${id}`);
  }

  async create(payload: CreateDepartmentRequest): Promise<Department> {
    return await baseServices.post("departments", payload);
  }

  async update(id: number, payload: UpdateDepartmentRequest): Promise<Department> {
    return await baseServices.put(`departments/${id}`, payload);
  }

  async delete(id: number): Promise<void> {
    await baseServices.delete(`departments/${id}`);
  }
}

export const departmentsService = new DepartmentsService();