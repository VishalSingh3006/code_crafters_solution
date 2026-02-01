import { useState, useEffect } from "react";
import { resourceAllocationsApi } from "../services/resourceAllocations";
import type {
  ResourceAllocation,
  CreateResourceAllocationRequest,
  UpdateResourceAllocationRequest,
} from "../types";

export const useResourceAllocations = () => {
  const [allocations, setAllocations] = useState<ResourceAllocation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAll = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await resourceAllocationsApi.getAll();
      setAllocations(response);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to fetch resource allocations");
    } finally {
      setLoading(false);
    }
  };

  const fetchByEngagementId = async (engagementId: number) => {
    try {
      setLoading(true);
      setError(null);
      const response = await resourceAllocationsApi.getByEngagementId(engagementId);
      setAllocations(response);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to fetch resource allocations");
    } finally {
      setLoading(false);
    }
  };

  const fetchByEmployeeId = async (employeeId: number) => {
    try {
      setLoading(true);
      setError(null);
      const response = await resourceAllocationsApi.getByEmployeeId(employeeId);
      setAllocations(response);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to fetch resource allocations");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  return {
    allocations,
    loading,
    error,
    refetch: fetchAll,
    fetchByEngagementId,
    fetchByEmployeeId,
  };
};

export const useResourceAllocationActions = () => {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const create = async (data: CreateResourceAllocationRequest) => {
    try {
      setPending(true);
      setError(null);
      const response = await resourceAllocationsApi.create(data);
      return response;
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to create resource allocation");
      throw err;
    } finally {
      setPending(false);
    }
  };

  const update = async (id: number, data: UpdateResourceAllocationRequest) => {
    try {
      setPending(true);
      setError(null);
      const response = await resourceAllocationsApi.update(id, data);
      return response;
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to update resource allocation");
      throw err;
    } finally {
      setPending(false);
    }
  };

  const remove = async (id: number) => {
    try {
      setPending(true);
      setError(null);
      await resourceAllocationsApi.delete(id);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to delete resource allocation");
      throw err;
    } finally {
      setPending(false);
    }
  };

  return { create, update, remove, pending, error };
};