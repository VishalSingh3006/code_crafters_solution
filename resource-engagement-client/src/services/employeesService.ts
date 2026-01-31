import { baseServices } from "./baseService";
import type {
  Employee,
  CreateEmployeeRequest,
  UpdateEmployeeRequest,
} from "../types";

class EmployeesService {
  async getAll(): Promise<Employee[]> {
    return await baseServices.get("employees");
  }

  async getById(id: number): Promise<Employee> {
    return await baseServices.get(`employees/${id}`);
  }

  async create(payload: CreateEmployeeRequest): Promise<Employee> {
    return await baseServices.post<Employee>("employees", payload);
  }

  async update(id: number, payload: UpdateEmployeeRequest): Promise<Employee> {
    return await baseServices.put<Employee>(`employees/${id}`, payload);
  }

  async delete(id: number): Promise<void> {
    await baseServices.delete<void>(`employees/${id}`);
  }
}

export const employeesService = new EmployeesService();
