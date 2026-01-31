import { useCallback, useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  fetchProjects,
  createProject,
  updateProject,
  deleteProject,
} from "../store/projectsSlice";
import { projectsService } from "../services/projectsService";
import type {
  CreateProjectRequest,
  UpdateProjectRequest,
  Project,
} from "../types";

export function useProjects() {
  const dispatch = useAppDispatch();
  const items = useAppSelector((s) => s.projects.items);
  const loading = useAppSelector((s) => s.projects.loading);
  const error = useAppSelector((s) => s.projects.error);

  const load = useCallback(() => {
    dispatch(fetchProjects());
  }, [dispatch]);

  useEffect(() => {
    load();
  }, [load]);

  return { items, loading, error, reload: load };
}

export function useProject(id: number | null) {
  const [item, setItem] = useState<Project | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (id == null) return;
    setLoading(true);
    setError(null);
    try {
      const res = await projectsService.getById(id);
      setItem(res);
    } catch (e: any) {
      setError(e?.message ?? "Failed to load project");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  return { item, loading, error, reload: load };
}

export function useProjectActions() {
  const dispatch = useAppDispatch();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const create = useCallback(
    async (payload: CreateProjectRequest) => {
      setPending(true);
      setError(null);
      try {
        await dispatch(createProject(payload)).unwrap();
      } catch (e: any) {
        setError(e?.message ?? "Failed to create project");
      } finally {
        setPending(false);
      }
    },
    [dispatch],
  );

  const update = useCallback(
    async (id: number, payload: UpdateProjectRequest) => {
      setPending(true);
      setError(null);
      try {
        await dispatch(updateProject({ id, payload })).unwrap();
      } catch (e: any) {
        setError(e?.message ?? "Failed to update project");
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
        await dispatch(deleteProject(id)).unwrap();
      } catch (e: any) {
        setError(e?.message ?? "Failed to delete project");
      } finally {
        setPending(false);
      }
    },
    [dispatch],
  );

  return { create, update, remove, pending, error };
}
