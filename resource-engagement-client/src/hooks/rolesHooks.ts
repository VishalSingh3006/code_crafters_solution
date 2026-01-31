import { useEffect, useState, useCallback } from "react";
import { rolesService } from "../services/rolesService";
import type {
  Role,
  AssignRoleRequest,
  RemoveRoleRequest,
  UserRolesResponseDto,
} from "../types";

export function useRolesData() {
  const [availableRoles, setAvailableRoles] = useState<Role[]>([]);
  const [usersWithRoles, setUsersWithRoles] = useState<UserRolesResponseDto[]>(
    [],
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [roles, users] = await Promise.all([
        rolesService.getAvailableRoles(),
        rolesService.getAllUsersWithRoles(),
      ]);
      setAvailableRoles(roles);
      setUsersWithRoles(users);
    } catch (e: any) {
      setError(e?.message ?? "Failed to load roles data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const refreshUsers = useCallback(async () => {
    try {
      const users = await rolesService.getAllUsersWithRoles();
      setUsersWithRoles(users);
    } catch {}
  }, []);

  return {
    availableRoles,
    usersWithRoles,
    loading,
    error,
    refreshUsers,
    reload: load,
  };
}

export function useRolesAdmin() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const assign = useCallback(async (payload: AssignRoleRequest) => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const res = await rolesService.assignRole(payload);
      setSuccess(res.message);
    } catch (e: any) {
      setError(e?.message ?? "Failed to assign role");
      throw e;
    } finally {
      setLoading(false);
    }
  }, []);

  const remove = useCallback(async (payload: RemoveRoleRequest) => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const res = await rolesService.removeRole(payload);
      setSuccess(res.message);
    } catch (e: any) {
      setError(e?.message ?? "Failed to remove role");
      throw e;
    } finally {
      setLoading(false);
    }
  }, []);

  return { assign, remove, loading, error, success };
}

export function useMyRoles() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await rolesService.getMyRoles();
      setRoles(res.roles);
    } catch (e: any) {
      setError(e?.message ?? "Failed to load my roles");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const isAdmin = roles.includes("Admin");
  const isManager = roles.includes("Manager");

  return { roles, isAdmin, isManager, loading, error, reload: load };
}
