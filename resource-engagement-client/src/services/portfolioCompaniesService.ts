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

class PortfolioCompaniesService {
  async getAll(): Promise<PortfolioCompany[]> {
    return baseServices.get("PortfolioCompanies");
  }

  async getById(id: number): Promise<PortfolioCompany> {
    return baseServices.get(`PortfolioCompanies/${id}`);
  }

  async create(company: CreatePortfolioCompanyRequest): Promise<PortfolioCompany> {
    return baseServices.post("PortfolioCompanies", company);
  }

  async update(id: number, company: UpdatePortfolioCompanyRequest): Promise<PortfolioCompany> {
    return baseServices.put(`PortfolioCompanies/${id}`, company);
  }

  async delete(id: number): Promise<void> {
    return baseServices.delete(`PortfolioCompanies/${id}`);
  }
}

export const portfolioCompaniesService = new PortfolioCompaniesService();