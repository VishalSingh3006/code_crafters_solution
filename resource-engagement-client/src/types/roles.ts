export type Role = "Admin" | "Manager" | "Employee" | "User";

export interface AssignRoleRequest {
  email: string;
  role: Role;
}

export interface RemoveRoleRequest {
  email: string;
  role: Role;
}

export interface UserRolesResponseDto {
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  roles: Role[];
}

export interface MyRolesResponse {
  roles: Role[];
}
