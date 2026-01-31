import { baseServices } from "./baseService";
import type {
  BillingRate,
  CreateBillingRateRequest,
  UpdateBillingRateRequest,
  CalculateRevenueRequest,
  RevenueCalculation,
  RevenueSummary,
  UpdateExchangeRateRequest,
  ExchangeRateResponse,
  UpdateExchangeRateResponse,
} from "../types/billingRates";

class BillingRateService {
  async getAll(): Promise<BillingRate[]> {
    return await baseServices.get("billingrates");
  }

  async getById(id: number): Promise<BillingRate> {
    return await baseServices.get(`billingrates/${id}`);
  }

  async getByRole(role: string): Promise<BillingRate[]> {
    return await baseServices.get(
      `billingrates/by-role/${encodeURIComponent(role)}`,
    );
  }

  async getByLevel(level: string): Promise<BillingRate[]> {
    return await baseServices.get(
      `billingrates/by-level/${encodeURIComponent(level)}`,
    );
  }

  async getByCurrency(currency: string): Promise<BillingRate[]> {
    return await baseServices.get(`billingrates/by-currency/${currency}`);
  }

  async create(payload: CreateBillingRateRequest): Promise<BillingRate> {
    return await baseServices.post<BillingRate>("billingrates", payload);
  }

  async update(
    id: number,
    payload: UpdateBillingRateRequest,
  ): Promise<BillingRate> {
    return await baseServices.put<BillingRate>(`billingrates/${id}`, payload);
  }

  async delete(id: number): Promise<void> {
    await baseServices.delete<void>(`billingrates/${id}`);
  }

  async calculateRevenue(
    id: number,
    payload: CalculateRevenueRequest,
  ): Promise<RevenueCalculation> {
    return await baseServices.post<RevenueCalculation>(
      `billingrates/${id}/calculate-revenue`,
      payload,
    );
  }

  async getRevenueSummary(hours: number = 40): Promise<RevenueSummary> {
    return await baseServices.get(
      `billingrates/revenue-summary?hours=${hours}`,
    );
  }

  async updateExchangeRate(
    payload: UpdateExchangeRateRequest,
  ): Promise<UpdateExchangeRateResponse> {
    return await baseServices.put<UpdateExchangeRateResponse>(
      "billingrates/update-exchange-rate",
      payload,
    );
  }

  async getExchangeRate(): Promise<ExchangeRateResponse> {
    return await baseServices.get("billingrates/exchange-rate");
  }
}

export const billingRateService = new BillingRateService();
