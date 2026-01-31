export interface Designation {
  id: number;
  name: string;
  description?: string;
  level?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateDesignationRequest {
  name: string;
  description?: string;
  level?: string;
}

export interface UpdateDesignationRequest {
  name?: string;
  description?: string;
  level?: string;
}