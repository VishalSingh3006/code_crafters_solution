import { useState, useEffect } from "react";
import { projectClientEngagementsApi } from "../services/projectClientEngagements";
import type {
  ProjectClientEngagement,
  CreateProjectClientEngagementRequest,
  UpdateProjectClientEngagementRequest,
} from "../types";

export const useProjectClientEngagements = () => {
  const [engagements, setEngagements] = useState<ProjectClientEngagement[]>([]);
  const [projectEngagements, setProjectEngagements] = useState<ProjectClientEngagement[]>([]);
  const [clientEngagements, setClientEngagements] = useState<ProjectClientEngagement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAllEngagements = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await projectClientEngagementsApi.getAll();
      setEngagements(response);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to fetch engagements");
    } finally {
      setLoading(false);
    }
  };

  const fetchProjectEngagements = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await projectClientEngagementsApi.getProjectEngagements();
      setProjectEngagements(response);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to fetch project engagements");
    } finally {
      setLoading(false);
    }
  };

  const fetchClientEngagements = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await projectClientEngagementsApi.getClientEngagements();
      setClientEngagements(response);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to fetch client engagements");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllEngagements();
    fetchProjectEngagements();
    fetchClientEngagements();
  }, []);

  return {
    engagements,
    projectEngagements,
    clientEngagements,
    loading,
    error,
    refetch: fetchAllEngagements,
    refetchProjectEngagements: fetchProjectEngagements,
    refetchClientEngagements: fetchClientEngagements,
  };
};

export const useProjectClientEngagementActions = () => {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const create = async (data: CreateProjectClientEngagementRequest) => {
    try {
      setPending(true);
      setError(null);
      const response = await projectClientEngagementsApi.create(data);
      return response;
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to create engagement");
      throw err;
    } finally {
      setPending(false);
    }
  };

  const update = async (id: number, data: UpdateProjectClientEngagementRequest) => {
    try {
      setPending(true);
      setError(null);
      const response = await projectClientEngagementsApi.update(id, data);
      return response;
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to update engagement");
      throw err;
    } finally {
      setPending(false);
    }
  };

  const remove = async (id: number) => {
    try {
      setPending(true);
      setError(null);
      await projectClientEngagementsApi.delete(id);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to delete engagement");
      throw err;
    } finally {
      setPending(false);
    }
  };

  return { create, update, remove, pending, error };
};