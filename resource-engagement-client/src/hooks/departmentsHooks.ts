import { useCallback, useEffect, useState } from "react";
import { departmentsService } from "../services/departmentsService";
import type {
  Department,
  CreateDepartmentRequest,
  UpdateDepartmentRequest,
} from "../types/departments";

export function useDepartments() {
  const [items, setItems] = useState<Department[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await departmentsService.getAll();
      setItems(res);
    } catch (e: any) {
      setError(e?.message ?? "Failed to load departments");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return { items, loading, error, reload: load };
}

export function useDepartment(id: number | null) {
  const [item, setItem] = useState<Department | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (id == null) return;
    setLoading(true);
    setError(null);
    try {
      const res = await departmentsService.getById(id);
      setItem(res);
    } catch (e: any) {
      setError(e?.message ?? "Failed to load department");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  return { item, loading, error, reload: load };
}

export function useDepartmentActions(onChanged?: () => void) {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const create = useCallback(
    async (payload: CreateDepartmentRequest) => {
      setPending(true);
      setError(null);
      try {
        await departmentsService.create(payload);
        onChanged?.();
      } catch (e: any) {
        setError(e?.message ?? "Failed to create department");
        throw e;
      } finally {
        setPending(false);
      }
    },
    [onChanged],
  );

  const update = useCallback(
    async (id: number, payload: UpdateDepartmentRequest) => {
      setPending(true);
      setError(null);
      try {
        await departmentsService.update(id, payload);
        onChanged?.();
      } catch (e: any) {
        setError(e?.message ?? "Failed to update department");
        throw e;
      } finally {
        setPending(false);
      }
    },
    [onChanged],
  );

  const remove = useCallback(
    async (id: number) => {
      setPending(true);
      setError(null);
      try {
        await departmentsService.delete(id);
        onChanged?.();
      } catch (e: any) {
        setError(e?.message ?? "Failed to delete department");
        throw e;
      } finally {
        setPending(false);
      }
    },
    [onChanged],
  );

  return { create, update, remove, pending, error };
}