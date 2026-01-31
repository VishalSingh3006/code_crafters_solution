import { baseServices } from "./baseService";

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

class PortfolioCompanyService {
  async getAll(): Promise<PortfolioCompany[]> {
    return baseServices.get("portfolio-companies");
  }

  async getById(id: number): Promise<PortfolioCompany> {
    return baseServices.get(`portfolio-companies/${id}`);
  }

  async create(portfolioCompany: CreatePortfolioCompanyRequest): Promise<PortfolioCompany> {
    return baseServices.post("portfolio-companies", portfolioCompany);
  }

  async update(id: number, portfolioCompany: UpdatePortfolioCompanyRequest): Promise<PortfolioCompany> {
    return baseServices.put(`portfolio-companies/${id}`, portfolioCompany);
  }

  async delete(id: number): Promise<void> {
    return baseServices.delete(`portfolio-companies/${id}`);
  }
}

export const portfolioCompanyService = new PortfolioCompanyService();