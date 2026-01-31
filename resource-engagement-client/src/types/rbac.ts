export type Role = "admin" | "user" | "viewer";

export type Permission =
  | "MANAGE_USERS"
  | "MANAGE_2FA"
  | "VIEW_DASHBOARD"
  | "VIEW_PROFILE";

export const ALL_PERMISSIONS: Permission[] = [
  "MANAGE_USERS",
  "MANAGE_2FA",
  "VIEW_DASHBOARD",
  "VIEW_PROFILE",
];

export const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  admin: ALL_PERMISSIONS,
  user: ["VIEW_DASHBOARD", "VIEW_PROFILE"],
  viewer: ["VIEW_DASHBOARD"],
};

export interface RbacState {
  roles: Role[];
}
