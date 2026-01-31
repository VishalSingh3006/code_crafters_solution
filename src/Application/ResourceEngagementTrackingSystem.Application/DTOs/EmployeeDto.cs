using System;
using System.Collections.Generic;

namespace ResourceEngagementTrackingSystem.Application.DTOs
{
    public class EmployeeSkillDto
    {
        public int SkillId { get; set; }
        public string SkillName { get; set; }
        public string ProficiencyLevel { get; set; }
        public decimal? YearsOfExperience { get; set; }
        public DateTime? LastUsedDate { get; set; }
    }

    public class EmployeeDto
    {
        public int Id { get; set; }
        public string EmployeeCode { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public string Phone { get; set; }
        public string Department { get; set; }
        public string Designation { get; set; }
        public string EmploymentType { get; set; }
        public int? ManagerId { get; set; }
        public List<EmployeeSkillDto> Skills { get; set; }
    }

    public class CreateEmployeeDto
    {
        public string EmployeeCode { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public string Phone { get; set; }
        public int DepartmentId { get; set; }
        public int DesignationId { get; set; }
        public string EmploymentType { get; set; }
        public int? ManagerId { get; set; }
        public List<EmployeeSkillInputDto> Skills { get; set; }
    }

    public class UpdateEmployeeDto : CreateEmployeeDto { }

    public class EmployeeSkillInputDto
    {
        public int SkillId { get; set; }
        public string ProficiencyLevel { get; set; }
        public decimal? YearsOfExperience { get; set; }
        public DateTime? LastUsedDate { get; set; }
    }
}
