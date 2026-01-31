import { useAppSelector } from "../store/store";
import { selectRoles } from "../store/auth/authThunks";
import {
  hasPermission,
  hasAnyPermission,
  hasAllPermissions,
} from "../utils/rbac";
import type { Permission, Role } from "../types/rbac";

export function useRoles(): string[] {
  return useAppSelector(selectRoles);
}

export function usePermission(permission: Permission): boolean {
  const roles = useRoles();
  return hasPermission(roles, permission);
}

export function useAnyPermission(permissions: Permission[]): boolean {
  const roles = useRoles();
  return hasAnyPermission(roles, permissions);
}

export function useAllPermissions(permissions: Permission[]): boolean {
  const roles = useRoles();
  return hasAllPermissions(roles, permissions);
}

export function useHasRole(role: Role): boolean {
  const roles = useRoles();
  return roles.includes(role);
}
