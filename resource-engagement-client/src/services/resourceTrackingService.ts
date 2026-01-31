import axios, { AxiosResponse } from "axios";
import { baseServices } from "./baseService";
import {
  Delivery,
  CreateDeliveryDto,
  UpdateDeliveryDto,
  StaffingRecord,
  CreateStaffingRecordDto,
  UpdateStaffingRecordDto,
  RecruitmentRecord,
  CreateRecruitmentRecordDto,
  UpdateRecruitmentRecordDto,
  BillingRecord,
  CreateBillingRecordDto,
  UpdateBillingRecordDto,
  ResourceAnalytics,
  DeliveryAnalytics,
  StaffingAnalytics,
  BillingAnalytics,
  RecruitmentAnalytics,
} from "../types/resourceTracking";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5000/api";

class ResourceTrackingService {
  private api = axios.create({
    baseURL: `${API_BASE_URL}/resource-tracking`,
    headers: {
      "Content-Type": "application/json",
    },
  });

  constructor() {
    // Add request interceptor to include auth token using the same method as baseService
    this.api.interceptors.request.use((config) => {
      const token = localStorage.getItem("authToken");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    // Add response interceptor to handle errors
    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          localStorage.removeItem("authToken");
          localStorage.removeItem("user");
          window.location.href = "/login";
        }
        return Promise.reject(error);
      }
    );
  }

  // Delivery Methods
  async getAllDeliveries(): Promise<Delivery[]> {
    const response: AxiosResponse<Delivery[]> = await this.api.get("/delivery");
    return response.data;
  }

  async getDeliveryById(id: number): Promise<Delivery> {
    const response: AxiosResponse<Delivery> = await this.api.get(`/delivery/${id}`);
    return response.data;
  }

  async createDelivery(delivery: CreateDeliveryDto): Promise<Delivery> {
    const response: AxiosResponse<Delivery> = await this.api.post("/delivery", delivery);
    return response.data;
  }

  async updateDelivery(id: number, delivery: UpdateDeliveryDto): Promise<void> {
    await this.api.put(`/delivery/${id}`, delivery);
  }

  async deleteDelivery(id: number): Promise<void> {
    await this.api.delete(`/delivery/${id}`);
  }

  // Staffing Methods
  async getAllStaffingRecords(): Promise<StaffingRecord[]> {
    const response: AxiosResponse<StaffingRecord[]> = await this.api.get("/Staffing");
    return response.data;
  }

  async getStaffingRecordById(id: number): Promise<StaffingRecord> {
    const response: AxiosResponse<StaffingRecord> = await this.api.get(`/Staffing/${id}`);
    return response.data;
  }

  async createStaffingRecord(staffingRecord: CreateStaffingRecordDto): Promise<StaffingRecord> {
    const response: AxiosResponse<StaffingRecord> = await this.api.post("/Staffing", staffingRecord);
    return response.data;
  }

  async updateStaffingRecord(id: number, staffingRecord: UpdateStaffingRecordDto): Promise<void> {
    await this.api.put(`/Staffing/${id}`, staffingRecord);
  }

  async deleteStaffingRecord(id: number): Promise<void> {
    await this.api.delete(`/Staffing/${id}`);
  }

  // Recruitment Methods
  async getAllRecruitmentRecords(): Promise<RecruitmentRecord[]> {
    const response: AxiosResponse<RecruitmentRecord[]> = await this.api.get("/recruitment");
    return response.data;
  }

  async getRecruitmentRecordById(id: number): Promise<RecruitmentRecord> {
    const response: AxiosResponse<RecruitmentRecord> = await this.api.get(`/recruitment/${id}`);
    return response.data;
  }

  async createRecruitmentRecord(recruitmentRecord: CreateRecruitmentRecordDto): Promise<RecruitmentRecord> {
    const response: AxiosResponse<RecruitmentRecord> = await this.api.post("/recruitment", recruitmentRecord);
    return response.data;
  }

  async updateRecruitmentRecord(id: number, recruitmentRecord: UpdateRecruitmentRecordDto): Promise<void> {
    await this.api.put(`/recruitment/${id}`, recruitmentRecord);
  }

  async deleteRecruitmentRecord(id: number): Promise<void> {
    await this.api.delete(`/recruitment/${id}`);
  }

  // Billing Methods
  async getAllBillingRecords(): Promise<BillingRecord[]> {
    const response: AxiosResponse<BillingRecord[]> = await this.api.get("/billing");
    return response.data;
  }

  async getBillingRecordById(id: number): Promise<BillingRecord> {
    const response: AxiosResponse<BillingRecord> = await this.api.get(`/billing/${id}`);
    return response.data;
  }

  async createBillingRecord(billingRecord: CreateBillingRecordDto): Promise<BillingRecord> {
    const response: AxiosResponse<BillingRecord> = await this.api.post("/billing", billingRecord);
    return response.data;
  }

  async updateBillingRecord(id: number, billingRecord: UpdateBillingRecordDto): Promise<void> {
    await this.api.put(`/billing/${id}`, billingRecord);
  }

  async deleteBillingRecord(id: number): Promise<void> {
    await this.api.delete(`/billing/${id}`);
  }

  // Analytics Methods
  async getResourceAnalytics(): Promise<ResourceAnalytics> {
    const response: AxiosResponse<ResourceAnalytics> = await this.api.get("/analytics");
    return response.data;
  }

  async getDeliveryAnalytics(): Promise<DeliveryAnalytics> {
    const response: AxiosResponse<DeliveryAnalytics> = await this.api.get("/analytics/delivery");
    return response.data;
  }

  async getStaffingAnalytics(): Promise<StaffingAnalytics> {
    const response: AxiosResponse<StaffingAnalytics> = await this.api.get("/analytics/staffing");
    return response.data;
  }

  async getBillingAnalytics(): Promise<BillingAnalytics> {
    const response: AxiosResponse<BillingAnalytics> = await this.api.get("/analytics/billing");
    return response.data;
  }

  async getRecruitmentAnalytics(): Promise<RecruitmentAnalytics> {
    const response: AxiosResponse<RecruitmentAnalytics> = await this.api.get("/analytics/recruitment");
    return response.data;
  }
}

export default new ResourceTrackingService();