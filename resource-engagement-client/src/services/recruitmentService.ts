import axios from "axios";
import {
  RecruitmentRecord,
  CreateRecruitmentRecordDto,
  UpdateRecruitmentRecordDto
} from "../types/Recruitment";

const API_URL = "/api/resource-tracking/recruitment";

const recruitmentService = {
  async getAllRecruitmentRecords(): Promise<RecruitmentRecord[]> {
    const res = await axios.get(API_URL);
    return res.data;
  },
  async getRecruitmentRecord(id: number): Promise<RecruitmentRecord> {
    const res = await axios.get(`${API_URL}/${id}`);
    return res.data;
  },
  async createRecruitmentRecord(dto: CreateRecruitmentRecordDto): Promise<RecruitmentRecord> {
    const res = await axios.post(API_URL, dto);
    return res.data;
  },
  async updateRecruitmentRecord(id: number, dto: UpdateRecruitmentRecordDto): Promise<void> {
    await axios.put(`${API_URL}/${id}`, dto);
  },
  async deleteRecruitmentRecord(id: number): Promise<void> {
    await axios.delete(`${API_URL}/${id}`);
  }
};

export default recruitmentService;