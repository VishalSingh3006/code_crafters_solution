export interface PortfolioCompany {
  id: number;
  name: string;
  currencyCode: string;
  status: string;
  startDate: string;
  endDate?: string;
}

export interface CreatePortfolioCompanyRequest {
  name: string;
  currencyCode: string;
  status: string;
  startDate: string;
  endDate?: string;
}

export interface UpdatePortfolioCompanyRequest {
  name: string;
  currencyCode: string;
  status: string;
  startDate: string;
  endDate?: string;
}