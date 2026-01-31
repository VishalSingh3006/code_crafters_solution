import type { Permission, Role } from "../types/rbac";
import { ROLE_PERMISSIONS } from "../types/rbac";

export function hasRole(userRoles: string[] | undefined, role: Role): boolean {
  if (!userRoles || userRoles.length === 0) return false;
  return userRoles.includes(role);
}

export function permissionsForRoles(
  roles: string[] | undefined,
): Set<Permission> {
  const set = new Set<Permission>();
  if (!roles) return set;
  for (const r of roles) {
    const perms = ROLE_PERMISSIONS[r as Role];
    if (perms) perms.forEach((p) => set.add(p));
  }
  return set;
}

export function hasPermission(
  roles: string[] | undefined,
  permission: Permission,
): boolean {
  if (!roles || roles.length === 0) return false;
  // Admin shortcut: if admin role present, grant all
  if (roles.includes("admin")) return true;
  const set = permissionsForRoles(roles);
  return set.has(permission);
}

export function hasAnyPermission(
  roles: string[] | undefined,
  permissions: Permission[],
): boolean {
  if (!roles || roles.length === 0) return false;
  if (roles.includes("admin")) return true;
  const set = permissionsForRoles(roles);
  return permissions.some((p) => set.has(p));
}

export function hasAllPermissions(
  roles: string[] | undefined,
  permissions: Permission[],
): boolean {
  if (!roles || roles.length === 0) return false;
  if (roles.includes("admin")) return true;
  const set = permissionsForRoles(roles);
  return permissions.every((p) => set.has(p));
}
