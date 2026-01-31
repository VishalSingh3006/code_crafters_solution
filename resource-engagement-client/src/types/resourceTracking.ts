// Resource Tracking Types
export interface Delivery {
  id: number;
  deliveryName: string;
  description?: string;
  projectId: number;
  employeeId: number;
  plannedDeliveryDate: string;
  actualDeliveryDate?: string;
  estimatedEffort: number;
  actualEffort?: number;
  priority: DeliveryPriority;
  status: DeliveryStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CreateDeliveryDto {
  deliveryName: string;
  description?: string;
  projectId: number;
  employeeId: number;
  plannedDeliveryDate: string;
  actualDeliveryDate?: string;
  estimatedEffort: number;
  actualEffort?: number;
  priority: DeliveryPriority;
}

export interface UpdateDeliveryDto {
  deliveryName?: string;
  description?: string;
  projectId?: number;
  employeeId?: number;
  plannedDeliveryDate?: string;
  actualDeliveryDate?: string;
  estimatedEffort?: number;
  actualEffort?: number;
  priority?: DeliveryPriority;
  status?: DeliveryStatus;
  notes?: string;
  completionPercentage?: number;
}

export enum DeliveryPriority {
  Low = 'Low',
  Medium = 'Medium',
  High = 'High',
  Critical = 'Critical'
}

export enum DeliveryStatus {
  NotStarted = 'NotStarted',
  InProgress = 'InProgress',
  Completed = 'Completed',
  OnHold = 'OnHold',
  Cancelled = 'Cancelled'
}

// Staffing Types
export interface StaffingRecord {
  id: number;
  employeeId: number;
  projectId: number;
  startDate: string;
  endDate?: string;
  allocationPercentage: number;
  role: string;
  hourlyRate: number;
  totalHours?: number;
  status: StaffingStatus;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateStaffingRecordDto {
  projectId: number;
  employeeId: number;
  role: string;
  allocationPercentage: number;
  hourlyRate: number;
  totalHours: number;
  startDate: string;
  endDate: string;
  status: string;
  notes?: string;
}

export interface UpdateStaffingRecordDto {
  projectId?: number;
  employeeId?: number;
  role?: string;
  allocationPercentage?: number;
  hourlyRate?: number;
  totalHours?: number;
  startDate?: string;
  endDate?: string;
  status?: StaffingStatus;
  notes?: string;
}

export enum StaffingStatus {
  Planned = 'Planned',
  Active = 'Active',
  Completed = 'Completed',
  Cancelled = 'Cancelled'
}

// Recruitment Types
export interface RecruitmentRecord {
  id: number;
  positionTitle: string;
  department: string;
  jobLevel: JobLevel;
  requiredSkills?: string;
  preferredSkills?: string;
  postingDate: string;
  applicationDeadline?: string;
  status: RecruitmentStatus;
  hiringManagerId: number;
  numberOfOpenings: number;
  salaryRangeMin?: number;
  salaryRangeMax?: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateRecruitmentRecordDto {
  positionTitle: string;
  department: string;
  jobLevel: JobLevel;
  requiredSkills?: string;
  preferredSkills?: string;
  postingDate: string;
  applicationDeadline?: string;
  hiringManagerId: number;
  numberOfOpenings: number;
  salaryRangeMin?: number;
  salaryRangeMax?: number;
  notes?: string;
}

export interface UpdateRecruitmentRecordDto {
  positionTitle?: string;
  department?: string;
  jobLevel?: JobLevel;
  requiredSkills?: string;
  preferredSkills?: string;
  postingDate?: string;
  applicationDeadline?: string;
  status?: RecruitmentStatus;
  hiringManagerId?: number;
  numberOfOpenings?: number;
  salaryRangeMin?: number;
  salaryRangeMax?: number;
  notes?: string;
}

export enum JobLevel {
  Junior = 'Junior',
  Mid = 'Mid',
  Senior = 'Senior',
  Lead = 'Lead',
  Manager = 'Manager'
}

export enum RecruitmentStatus {
  Draft = 'Draft',
  Posted = 'Posted',
  Active = 'Active',
  OnHold = 'OnHold',
  Filled = 'Filled',
  Cancelled = 'Cancelled'
}

// Billing Types
export interface BillingRecord {
  id: number;
  projectId: number;
  employeeId: number;
  billingPeriodStart: string;
  billingPeriodEnd: string;
  hoursWorked: number;
  hourlyRate: number;
  totalAmount: number;
  taxAmount: number;
  discountAmount?: number;
  finalAmount: number;
  billingType: BillingType;
  status: BillingStatus;
  isInvoiced: boolean;
  invoicedDate?: string;
  paymentDueDate?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBillingRecordDto {
  projectId: number;
  employeeId: number;
  billingPeriodStart: string;
  billingPeriodEnd: string;
  hoursWorked: number;
  hourlyRate: number;
  totalAmount: number;
  taxAmount: number;
  discountAmount?: number;
  finalAmount: number;
  billingType: BillingType;
  paymentDueDate?: string;
  notes?: string;
}

export interface UpdateBillingRecordDto {
  projectId?: number;
  employeeId?: number;
  billingPeriodStart?: string;
  billingPeriodEnd?: string;
  hoursWorked?: number;
  hourlyRate?: number;
  totalAmount?: number;
  taxAmount?: number;
  discountAmount?: number;
  finalAmount?: number;
  billingType?: BillingType;
  status?: BillingStatus;
  isInvoiced?: boolean;
  invoicedDate?: string;
  paymentDueDate?: string;
  notes?: string;
}

export enum BillingType {
  Regular = 'Regular',
  Overtime = 'Overtime',
  Holiday = 'Holiday',
  Bonus = 'Bonus'
}

export enum BillingStatus {
  Draft = 'Draft',
  Submitted = 'Submitted',
  Approved = 'Approved',
  Invoiced = 'Invoiced',
  Paid = 'Paid',
  Disputed = 'Disputed'
}

// Analytics Types
export interface ResourceAnalytics {
  totalDeliveries: number;
  completedDeliveries: number;
  onTimeDeliveries: number;
  averageEffort: number;
  totalStaffingRecords: number;
  activeStaffing: number;
  utilizationRate: number;
  totalBillingAmount: number;
  paidAmount: number;
  pendingAmount: number;
  activeRecruitments: number;
  filledPositions: number;
}

export interface DeliveryAnalytics {
  totalDeliveries: number;
  completedDeliveries: number;
  onTimeDeliveries: number;
  averageEffort: number;
  statusBreakdown: Record<DeliveryStatus, number>;
  priorityBreakdown: Record<DeliveryPriority, number>;
}

export interface StaffingAnalytics {
  totalStaffingRecords: number;
  activeStaffing: number;
  utilizationRate: number;
  averageAllocation: number;
  statusBreakdown: Record<StaffingStatus, number>;
}

export interface BillingAnalytics {
  totalBillingAmount: number;
  paidAmount: number;
  pendingAmount: number;
  averageHourlyRate: number;
  statusBreakdown: Record<BillingStatus, number>;
  typeBreakdown: Record<BillingType, number>;
}

export interface RecruitmentAnalytics {
  activeRecruitments: number;
  filledPositions: number;
  averageTimeToFill: number;
  statusBreakdown: Record<RecruitmentStatus, number>;
  levelBreakdown: Record<JobLevel, number>;
}