export interface EmployeeSkill {
  skillId: number;
  skillName: string;
  proficiencyLevel: string;
}

export interface Employee {
  id: number;
  employeeCode: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  department: string;
  designation: string;
  employmentType: string;
  managerId?: number | null;
  skills: EmployeeSkill[];
}

export interface EmployeeSkillInput {
  skillId: number;
  proficiencyLevel: string;
}

export interface CreateEmployeeRequest {
  employeeCode: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  departmentId: number;
  designationId: number;
  employmentType: string;
  managerId?: number | null;
  skills: EmployeeSkillInput[];
}

export interface UpdateEmployeeRequest extends CreateEmployeeRequest {}
