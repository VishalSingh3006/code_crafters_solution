import { baseServices } from "./baseService";
import type {
  Client,
  CreateClientRequest,
  UpdateClientRequest,
} from "../types";

class ClientsService {
  async getAll(): Promise<Client[]> {
    return await baseServices.get("clients");
  }

  async getById(id: number): Promise<Client> {
    return await baseServices.get(`clients/${id}`);
  }

  async create(payload: CreateClientRequest): Promise<Client> {
    return await baseServices.post<Client>("clients", payload);
  }

  async update(id: number, payload: UpdateClientRequest): Promise<Client> {
    return await baseServices.put<Client>(`clients/${id}`, payload);
  }

  async delete(id: number): Promise<void> {
    await baseServices.delete<void>(`clients/${id}`);
  }
}

export const clientsService = new ClientsService();
