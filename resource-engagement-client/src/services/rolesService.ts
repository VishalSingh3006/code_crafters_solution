import { baseServices } from "./baseService";
import type {
  Role,
  AssignRoleRequest,
  RemoveRoleRequest,
  UserRolesResponseDto,
  MyRolesResponse,
} from "../types";

class RolesService {
  async getAvailableRoles(): Promise<Role[]> {
    return await baseServices.get("roles/available");
  }

  async assignRole(payload: AssignRoleRequest): Promise<{ message: string }> {
    return await baseServices.post<{ message: string }>(
      "roles/assign",
      payload,
    );
  }

  async removeRole(payload: RemoveRoleRequest): Promise<{ message: string }> {
    return await baseServices.post<{ message: string }>(
      "roles/remove",
      payload,
    );
  }

  async getUserRoles(email: string): Promise<UserRolesResponseDto> {
    return await baseServices.get(
      `roles/user/${encodeURIComponent(email)}`,
    );
  }

  async getAllUsersWithRoles(): Promise<UserRolesResponseDto[]> {
    return await baseServices.get("roles/users");
  }

  async getMyRoles(): Promise<MyRolesResponse> {
    return await baseServices.get("roles/my-roles");
  }
}

export const rolesService = new RolesService();
