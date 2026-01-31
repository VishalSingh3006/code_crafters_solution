import { useState, useCallback } from 'react';
import { portfolioCompaniesService } from '../services/portfolioCompaniesService';
import type { 
  PortfolioCompany,
  CreatePortfolioCompanyRequest,
  UpdatePortfolioCompanyRequest
} from '../types/portfolioCompanies';

export const usePortfolioCompanies = () => {
  const [companies, setCompanies] = useState<PortfolioCompany[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadCompanies = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await portfolioCompaniesService.getAll();
      setCompanies(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load portfolio companies');
    } finally {
      setLoading(false);
    }
  }, []);

  return { companies, loading, error, loadCompanies };
};

export const usePortfolioCompanyActions = (onSuccess?: () => void) => {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const create = useCallback(async (company: CreatePortfolioCompanyRequest) => {
    setPending(true);
    setError(null);
    try {
      await portfolioCompaniesService.create(company);
      onSuccess?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create portfolio company');
      throw err;
    } finally {
      setPending(false);
    }
  }, [onSuccess]);

  const update = useCallback(async (id: number, company: UpdatePortfolioCompanyRequest) => {
    setPending(true);
    setError(null);
    try {
      await portfolioCompaniesService.update(id, company);
      onSuccess?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update portfolio company');
      throw err;
    } finally {
      setPending(false);
    }
  }, [onSuccess]);

  const remove = useCallback(async (id: number) => {
    setPending(true);
    setError(null);
    try {
      await portfolioCompaniesService.delete(id);
      onSuccess?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete portfolio company');
      throw err;
    } finally {
      setPending(false);
    }
  }, [onSuccess]);

  return { create, update, remove, pending, error };
};