import { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  fetchBillingRates,
  fetchBillingRateById,
  createBillingRate,
  updateBillingRate,
  deleteBillingRate,
  fetchRevenueSummary,
  updateExchangeRate,
  fetchExchangeRate,
  setCurrentRate,
  clearError,
  setExchangeRate,
} from "../store/billingRateSlice";
import type {
  CreateBillingRateRequest,
  UpdateBillingRateRequest,
  UpdateExchangeRateRequest,
} from "../types/billingRates";

export const useBillingRates = () => {
  const dispatch = useAppDispatch();
  const { rates, currentRate, revenueSummary, exchangeRate, loading, error } =
    useAppSelector((state) => state.billingRates);

  const getAllRates = useCallback(() => {
    return dispatch(fetchBillingRates());
  }, [dispatch]);

  const getRateById = useCallback(
    (id: number) => {
      return dispatch(fetchBillingRateById(id));
    },
    [dispatch],
  );

  const createRate = useCallback(
    (payload: CreateBillingRateRequest) => {
      return dispatch(createBillingRate(payload));
    },
    [dispatch],
  );

  const updateRate = useCallback(
    (id: number, payload: UpdateBillingRateRequest) => {
      return dispatch(updateBillingRate({ id, payload }));
    },
    [dispatch],
  );

  const deleteRate = useCallback(
    (id: number) => {
      return dispatch(deleteBillingRate(id));
    },
    [dispatch],
  );

  const getRevenueSummary = useCallback(
    (hours: number = 40) => {
      return dispatch(fetchRevenueSummary(hours));
    },
    [dispatch],
  );

  const updateGlobalExchangeRate = useCallback(
    (payload: UpdateExchangeRateRequest) => {
      return dispatch(updateExchangeRate(payload));
    },
    [dispatch],
  );

  const getExchangeRate = useCallback(() => {
    return dispatch(fetchExchangeRate());
  }, [dispatch]);

  const setCurrentBillingRate = useCallback(
    (rate: typeof currentRate) => {
      dispatch(setCurrentRate(rate));
    },
    [dispatch],
  );

  const clearBillingRateError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  const setLocalExchangeRate = useCallback(
    (rate: number) => {
      dispatch(setExchangeRate(rate));
    },
    [dispatch],
  );

  return {
    // State
    rates,
    currentRate,
    revenueSummary,
    exchangeRate,
    loading,
    error,

    // Actions
    getAllRates,
    getRateById,
    createRate,
    updateRate,
    deleteRate,
    getRevenueSummary,
    updateGlobalExchangeRate,
    getExchangeRate,
    setCurrentBillingRate,
    clearBillingRateError,
    setLocalExchangeRate,
  };
};
