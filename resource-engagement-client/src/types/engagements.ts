export interface ProjectClientEngagement {
  id: number;
  projectId?: number;
  projectName?: string;
  clientId?: number;
  clientName?: string;
  startDate: string;
  endDate?: string;
  outcomeStatus: "Success" | "Delayed" | "Cancelled";
  isProjectEngagement: boolean;
  isClientEngagement: boolean;
}

export interface CreateProjectClientEngagementRequest {
  projectId?: number;
  clientId?: number;
  startDate: string;
  endDate?: string;
  outcomeStatus: "Success" | "Delayed" | "Cancelled";
}

export interface UpdateProjectClientEngagementRequest {
  projectId?: number;
  clientId?: number;
  startDate: string;
  endDate?: string;
  outcomeStatus: "Success" | "Delayed" | "Cancelled";
}

export type EngagementOutcomeStatus = "Success" | "Delayed" | "Cancelled";