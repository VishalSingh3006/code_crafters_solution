export enum UserRole {
  Admin = "Admin",
  Manager = "Manager",
  Employee = "Employee",
  User = "User",
}

export type Role =
  | keyof typeof UserRole
  | UserRole
  | "Admin"
  | "Manager"
  | "Employee"
  | "User";

export const DEFAULT_ROLES: Role[] = Object.values(UserRole) as Role[];

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
