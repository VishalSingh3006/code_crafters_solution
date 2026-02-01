import { useState, useEffect } from "react";
import { engagementPositionsApi } from "../services/engagementPositions";
import type {
  EngagementPosition,
  CreateEngagementPositionRequest,
  UpdateEngagementPositionRequest,
} from "../types";

export const useEngagementPositions = () => {
  const [positions, setPositions] = useState<EngagementPosition[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAll = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await engagementPositionsApi.getAll();
      setPositions(response);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to fetch engagement positions");
    } finally {
      setLoading(false);
    }
  };

  const fetchByEngagementId = async (engagementId: number) => {
    try {
      setLoading(true);
      setError(null);
      const response = await engagementPositionsApi.getByEngagementId(engagementId);
      setPositions(response);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to fetch engagement positions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  return {
    positions,
    loading,
    error,
    refetch: fetchAll,
    fetchByEngagementId,
  };
};

export const useEngagementPositionActions = () => {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const create = async (data: CreateEngagementPositionRequest) => {
    try {
      setPending(true);
      setError(null);
      const response = await engagementPositionsApi.create(data);
      return response;
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to create engagement position");
      throw err;
    } finally {
      setPending(false);
    }
  };

  const update = async (id: number, data: UpdateEngagementPositionRequest) => {
    try {
      setPending(true);
      setError(null);
      const response = await engagementPositionsApi.update(id, data);
      return response;
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to update engagement position");
      throw err;
    } finally {
      setPending(false);
    }
  };

  const remove = async (id: number) => {
    try {
      setPending(true);
      setError(null);
      await engagementPositionsApi.delete(id);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to delete engagement position");
      throw err;
    } finally {
      setPending(false);
    }
  };

  return { create, update, remove, pending, error };
};