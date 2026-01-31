import { useCallback, useEffect, useState } from "react";
import { employeesService } from "../services/employeesService";
import type {
  Employee,
  CreateEmployeeRequest,
  UpdateEmployeeRequest,
} from "../types";

export function useEmployees() {
  const [items, setItems] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await employeesService.getAll();
      setItems(res);
    } catch (e: any) {
      setError(e?.message ?? "Failed to load employees");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return { items, loading, error, reload: load };
}

export function useEmployee(id: number | null) {
  const [item, setItem] = useState<Employee | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (id == null) return;
    setLoading(true);
    setError(null);
    try {
      const res = await employeesService.getById(id);
      setItem(res);
    } catch (e: any) {
      setError(e?.message ?? "Failed to load employee");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  return { item, loading, error, reload: load };
}

export function useEmployeeActions(onChanged?: () => void) {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const create = useCallback(
    async (payload: CreateEmployeeRequest) => {
      setPending(true);
      setError(null);
      try {
        await employeesService.create(payload);
        onChanged?.();
      } catch (e: any) {
        setError(e?.message ?? "Failed to create employee");
        throw e;
      } finally {
        setPending(false);
      }
    },
    [onChanged],
  );

  const update = useCallback(
    async (id: number, payload: UpdateEmployeeRequest) => {
      setPending(true);
      setError(null);
      try {
        await employeesService.update(id, payload);
        onChanged?.();
      } catch (e: any) {
        setError(e?.message ?? "Failed to update employee");
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
        await employeesService.delete(id);
        onChanged?.();
      } catch (e: any) {
        setError(e?.message ?? "Failed to delete employee");
        throw e;
      } finally {
        setPending(false);
      }
    },
    [onChanged],
  );

  return { create, update, remove, pending, error };
}
