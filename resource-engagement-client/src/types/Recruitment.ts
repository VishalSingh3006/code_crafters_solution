export enum RecruitmentStatus {
  Open = "Open",
  InProgress = "InProgress",
  Closed = "Closed",
  Cancelled = "Cancelled"
}

export enum JobLevel {
  Junior = "Junior",
  Mid = "Mid",
  Senior = "Senior",
  Lead = "Lead"
}

export interface RecruitmentRecord {
  id: number;
  positionTitle: string;
  jobLevel: JobLevel;
  department: string;
  requestedBy: string;
  hiringManagerId: number;
  numberOfOpenings: number;
  openDate: string;
  postingDate: string;
  closeDate?: string;
  status: RecruitmentStatus;
  notes?: string;
}

export interface CreateRecruitmentRecordDto {
  positionTitle: string;
  jobLevel: JobLevel;
  department: string;
  requestedBy: string;
  hiringManagerId: number;
  numberOfOpenings: number;
  openDate: string;
  postingDate: string;
  closeDate?: string;
  status: RecruitmentStatus;
  notes?: string;
}

export interface UpdateRecruitmentRecordDto extends CreateRecruitmentRecordDto {}