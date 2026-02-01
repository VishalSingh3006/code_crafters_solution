// EngagementPosition types
export interface EngagementPosition {
  id: number;
  engagementId: number;
  title: string;
  requiredSkill?: string;
  requiredProficiency?: string;
  engagementName?: string;
}

export interface CreateEngagementPositionRequest {
  engagementId: number;
  title: string;
  requiredSkill?: string;
  requiredProficiency?: string;
}

export interface UpdateEngagementPositionRequest {
  engagementId: number;
  title: string;
  requiredSkill?: string;
  requiredProficiency?: string;
}

// ResourceAllocation types
export interface ResourceAllocation {
  id: number;
  engagementId: number;
  employeeId: number;
  allocationPercentage: number;
  allocationStart: string;
  allocationEnd?: string;
  engagementName?: string;
  employeeName?: string;
}

export interface CreateResourceAllocationRequest {
  engagementId: number;
  employeeId: number;
  allocationPercentage: number;
  allocationStart: string;
  allocationEnd?: string;
}

export interface UpdateResourceAllocationRequest {
  engagementId: number;
  employeeId: number;
  allocationPercentage: number;
  allocationStart: string;
  allocationEnd?: string;
}

// Proficiency levels for engagement positions
export const PROFICIENCY_LEVELS = [
  { value: 1, label: "Beginner" },
  { value: 2, label: "Basic" },
  { value: 3, label: "Intermediate" },
  { value: 4, label: "Advanced" },
  { value: 5, label: "Expert" },
] as const;

export type ProficiencyLevel = typeof PROFICIENCY_LEVELS[number]["value"];

// Proficiency level constants
export const ProficiencyLevel = {
  BEGINNER: 1,
  BASIC: 2,
  INTERMEDIATE: 3,
  ADVANCED: 4,
  EXPERT: 5
} as const;