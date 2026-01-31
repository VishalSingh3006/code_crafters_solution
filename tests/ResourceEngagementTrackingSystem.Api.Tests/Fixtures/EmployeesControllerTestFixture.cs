using System;
using System.Collections.Generic;
using ResourceEngagementTrackingSystem.Application.DTOs;

namespace ResourceEngagementTrackingSystem.Api.Tests.Controllers
{
    public class EmployeesControllerTestFixture
    {
        public IEnumerable<EmployeeDto> SampleEmployees { get; }
        public EmployeeDto SampleEmployee { get; }
        public EmployeeDto SampleUpdatedEmployee { get; }
        public CreateEmployeeDto SampleCreateEmployeeDto { get; }
        public UpdateEmployeeDto SampleUpdateEmployeeDto { get; }

        public EmployeesControllerTestFixture()
        {
            SampleEmployee = new EmployeeDto
            {
                Id = 1,
                EmployeeCode = "EMP001",
                FirstName = "John",
                LastName = "Doe",
                Email = "john.doe@company.com",
                Phone = "555-1234",
                Department = "Engineering",
                Designation = "Senior Software Engineer",
                EmploymentType = "Full-time",
                ManagerId = 5,
                Skills = new List<EmployeeSkillDto>
                {
                    new EmployeeSkillDto { SkillId = 1, SkillName = "C#", ProficiencyLevel = "Expert" },
                    new EmployeeSkillDto { SkillId = 2, SkillName = ".NET Core", ProficiencyLevel = "Advanced" },
                    new EmployeeSkillDto { SkillId = 3, SkillName = "SQL Server", ProficiencyLevel = "Intermediate" }
                }
            };

            SampleUpdatedEmployee = new EmployeeDto
            {
                Id = 1,
                EmployeeCode = "EMP001",
                FirstName = "John",
                LastName = "Smith", // Changed last name
                Email = "john.smith@company.com", // Changed email
                Phone = "555-1234",
                Department = "Engineering",
                Designation = "Lead Software Engineer", // Promoted
                EmploymentType = "Full-time",
                ManagerId = 5,
                Skills = new List<EmployeeSkillDto>
                {
                    new EmployeeSkillDto { SkillId = 1, SkillName = "C#", ProficiencyLevel = "Expert" },
                    new EmployeeSkillDto { SkillId = 2, SkillName = ".NET Core", ProficiencyLevel = "Expert" }, // Improved proficiency
                    new EmployeeSkillDto { SkillId = 3, SkillName = "SQL Server", ProficiencyLevel = "Advanced" }, // Improved proficiency
                    new EmployeeSkillDto { SkillId = 4, SkillName = "Angular", ProficiencyLevel = "Intermediate" } // New skill
                }
            };

            var employee2 = new EmployeeDto
            {
                Id = 2,
                EmployeeCode = "EMP002",
                FirstName = "Sarah",
                LastName = "Johnson",
                Email = "sarah.johnson@company.com",
                Phone = "555-5678",
                Department = "Marketing",
                Designation = "Marketing Manager",
                EmploymentType = "Full-time",
                ManagerId = 3,
                Skills = new List<EmployeeSkillDto>
                {
                    new EmployeeSkillDto { SkillId = 5, SkillName = "Digital Marketing", ProficiencyLevel = "Expert" },
                    new EmployeeSkillDto { SkillId = 6, SkillName = "Analytics", ProficiencyLevel = "Advanced" }
                }
            };

            var employee3 = new EmployeeDto
            {
                Id = 3,
                EmployeeCode = "EMP003",
                FirstName = "Michael",
                LastName = "Brown",
                Email = "michael.brown@company.com",
                Phone = "555-9999",
                Department = "Engineering",
                Designation = "Junior Developer",
                EmploymentType = "Part-time",
                ManagerId = 1,
                Skills = new List<EmployeeSkillDto>
                {
                    new EmployeeSkillDto { SkillId = 1, SkillName = "C#", ProficiencyLevel = "Beginner" },
                    new EmployeeSkillDto { SkillId = 7, SkillName = "JavaScript", ProficiencyLevel = "Intermediate" }
                }
            };

            SampleEmployees = new List<EmployeeDto> { SampleEmployee, employee2, employee3 };

            SampleCreateEmployeeDto = new CreateEmployeeDto
            {
                EmployeeCode = "EMP004",
                FirstName = "Emily",
                LastName = "Davis",
                Email = "emily.davis@company.com",
                Phone = "555-4321",
                DepartmentId = 1,
                DesignationId = 2,
                EmploymentType = "Full-time",
                ManagerId = 1,
                Skills = new List<EmployeeSkillInputDto>
                {
                    new EmployeeSkillInputDto { SkillId = 1, ProficiencyLevel = "Intermediate" },
                    new EmployeeSkillInputDto { SkillId = 8, ProficiencyLevel = "Advanced" }
                }
            };

            SampleUpdateEmployeeDto = new UpdateEmployeeDto
            {
                EmployeeCode = "EMP001",
                FirstName = "John",
                LastName = "Smith",
                Email = "john.smith@company.com",
                Phone = "555-1234",
                DepartmentId = 1,
                DesignationId = 3, // Promoted to Lead
                EmploymentType = "Full-time",
                ManagerId = 5,
                Skills = new List<EmployeeSkillInputDto>
                {
                    new EmployeeSkillInputDto { SkillId = 1, ProficiencyLevel = "Expert" },
                    new EmployeeSkillInputDto { SkillId = 2, ProficiencyLevel = "Expert" },
                    new EmployeeSkillInputDto { SkillId = 3, ProficiencyLevel = "Advanced" }
                }
            };
        }
    }
}