import { useCallback, useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  fetchClients,
  createClient,
  updateClient,
  deleteClient,
} from "../store/clientsSlice";
import type {
  CreateClientRequest,
  UpdateClientRequest,
  Client,
} from "../types";

export function useClients() {
  const dispatch = useAppDispatch();
  const items = useAppSelector((s) => s.clients.items);
  const loading = useAppSelector((s) => s.clients.loading);
  const error = useAppSelector((s) => s.clients.error);

  const load = useCallback(() => {
    dispatch(fetchClients());
  }, [dispatch]);

  useEffect(() => {
    load();
  }, [load]);

  return { items, loading, error, reload: load };
}

export function useClientActions() {
  const dispatch = useAppDispatch();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const create = useCallback(
    async (payload: CreateClientRequest) => {
      setPending(true);
      setError(null);
      try {
        await dispatch(createClient(payload)).unwrap();
      } catch (e: any) {
        setError(e?.message ?? "Failed to create client");
      } finally {
        setPending(false);
      }
    },
    [dispatch],
  );

  const update = useCallback(
    async (id: number, payload: UpdateClientRequest) => {
      setPending(true);
      setError(null);
      try {
        await dispatch(updateClient({ id, payload })).unwrap();
      } catch (e: any) {
        setError(e?.message ?? "Failed to update client");
      } finally {
        setPending(false);
      }
    },
    [dispatch],
  );

  const remove = useCallback(
    async (id: number) => {
      setPending(true);
      setError(null);
      try {
        await dispatch(deleteClient(id)).unwrap();
      } catch (e: any) {
        setError(e?.message ?? "Failed to delete client");
      } finally {
        setPending(false);
      }
    },
    [dispatch],
  );

  return { create, update, remove, pending, error };
}
