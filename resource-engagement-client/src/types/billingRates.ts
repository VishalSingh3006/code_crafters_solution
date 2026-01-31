export interface BillingRate {
  id: number;
  role: string;
  level: string;
  usdRate: number;
  inrRate: number;
  currency: "USD" | "INR";
  effectiveDate: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBillingRateRequest {
  role: string;
  level: string;
  usdRate: number;
  inrRate: number;
  currency: "USD" | "INR";
  effectiveDate: string;
  description: string;
}

export interface UpdateBillingRateRequest {
  role: string;
  level: string;
  usdRate: number;
  inrRate: number;
  currency: "USD" | "INR";
  effectiveDate: string;
  description: string;
}

export interface CalculateRevenueRequest {
  hours: number;
}

export interface RevenueCalculation {
  billingRateId: number;
  role: string;
  level: string;
  hours: number;
  usdRevenue: number;
  inrRevenue: number;
  primaryCurrency: string;
  usdRate: number;
  inrRate: number;
}

export interface RevenueSummary {
  totalUsdRevenue: number;
  totalInrRevenue: number;
  hours: number;
  currentExchangeRate: number;
  totalRates: number;
  rateBreakdown: RevenueCalculation[];
  calculatedAt: string;
}

export interface UpdateExchangeRateRequest {
  exchangeRate: number;
}

export interface ExchangeRateResponse {
  exchangeRate: number;
}

export interface UpdateExchangeRateResponse {
  message: string;
  affectedRates: number;
}
