import type { AxiosResponse } from "axios";
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

class ResourceTrackingService {
  // Delivery Methods
  async getAllDeliveries(): Promise<Delivery[]> {
    return (await baseServices.get("resource-tracking/delivery")) as Delivery[];
  }

  async getDeliveryById(id: number): Promise<Delivery> {
    return (await baseServices.get(
      `resource-tracking/delivery/${id}`,
    )) as Delivery;
  }

  async createDelivery(delivery: CreateDeliveryDto): Promise<Delivery> {
    return await baseServices.post<Delivery>(
      "resource-tracking/delivery",
      delivery,
    );
  }

  async updateDelivery(id: number, delivery: UpdateDeliveryDto): Promise<void> {
    await baseServices.put<void>(`resource-tracking/delivery/${id}`, delivery);
  }

  async deleteDelivery(id: number): Promise<void> {
    await baseServices.delete<void>(`resource-tracking/delivery/${id}`);
  }

  // Staffing Methods
  async getAllStaffingRecords(): Promise<StaffingRecord[]> {
    return (await baseServices.get(
      "resource-tracking/Staffing",
    )) as StaffingRecord[];
  }

  async getStaffingRecordById(id: number): Promise<StaffingRecord> {
    return (await baseServices.get(
      `resource-tracking/Staffing/${id}`,
    )) as StaffingRecord;
  }

  async createStaffingRecord(
    staffingRecord: CreateStaffingRecordDto,
  ): Promise<StaffingRecord> {
    return await baseServices.post<StaffingRecord>(
      "resource-tracking/Staffing",
      staffingRecord,
    );
  }

  async updateStaffingRecord(
    id: number,
    staffingRecord: UpdateStaffingRecordDto,
  ): Promise<void> {
    await baseServices.put<void>(
      `resource-tracking/Staffing/${id}`,
      staffingRecord,
    );
  }

  async deleteStaffingRecord(id: number): Promise<void> {
    await baseServices.delete<void>(`resource-tracking/Staffing/${id}`);
  }

  // Recruitment Methods
  async getAllRecruitmentRecords(): Promise<RecruitmentRecord[]> {
    return (await baseServices.get(
      "resource-tracking/recruitment",
    )) as RecruitmentRecord[];
  }

  async getRecruitmentRecordById(id: number): Promise<RecruitmentRecord> {
    return (await baseServices.get(
      `resource-tracking/recruitment/${id}`,
    )) as RecruitmentRecord;
  }

  async createRecruitmentRecord(
    recruitmentRecord: CreateRecruitmentRecordDto,
  ): Promise<RecruitmentRecord> {
    return await baseServices.post<RecruitmentRecord>(
      "resource-tracking/recruitment",
      recruitmentRecord,
    );
  }

  async updateRecruitmentRecord(
    id: number,
    recruitmentRecord: UpdateRecruitmentRecordDto,
  ): Promise<void> {
    await baseServices.put<void>(
      `resource-tracking/recruitment/${id}`,
      recruitmentRecord,
    );
  }

  async deleteRecruitmentRecord(id: number): Promise<void> {
    await baseServices.delete<void>(`resource-tracking/recruitment/${id}`);
  }

  // Billing Methods
  async getAllBillingRecords(): Promise<BillingRecord[]> {
    return (await baseServices.get(
      "resource-tracking/billing",
    )) as BillingRecord[];
  }

  async getBillingRecordById(id: number): Promise<BillingRecord> {
    return (await baseServices.get(
      `resource-tracking/billing/${id}`,
    )) as BillingRecord;
  }

  async createBillingRecord(
    billingRecord: CreateBillingRecordDto,
  ): Promise<BillingRecord> {
    return await baseServices.post<BillingRecord>(
      "resource-tracking/billing",
      billingRecord,
    );
  }

  async updateBillingRecord(
    id: number,
    billingRecord: UpdateBillingRecordDto,
  ): Promise<void> {
    await baseServices.put<void>(
      `resource-tracking/billing/${id}`,
      billingRecord,
    );
  }

  async deleteBillingRecord(id: number): Promise<void> {
    await baseServices.delete<void>(`resource-tracking/billing/${id}`);
  }

  // Analytics Methods
  async getResourceAnalytics(): Promise<ResourceAnalytics> {
    return (await baseServices.get(
      "resource-tracking/analytics",
    )) as ResourceAnalytics;
  }

  async getDeliveryAnalytics(): Promise<DeliveryAnalytics> {
    return (await baseServices.get(
      "resource-tracking/analytics/delivery",
    )) as DeliveryAnalytics;
  }

  async getStaffingAnalytics(): Promise<StaffingAnalytics> {
    return (await baseServices.get(
      "resource-tracking/analytics/staffing",
    )) as StaffingAnalytics;
  }

  async getBillingAnalytics(): Promise<BillingAnalytics> {
    return (await baseServices.get(
      "resource-tracking/analytics/billing",
    )) as BillingAnalytics;
  }

  async getRecruitmentAnalytics(): Promise<RecruitmentAnalytics> {
    return (await baseServices.get(
      "resource-tracking/analytics/recruitment",
    )) as RecruitmentAnalytics;
  }
}

export default new ResourceTrackingService();
