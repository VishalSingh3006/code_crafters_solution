using System;
using System.Collections.Generic;
using ResourceEngagementTrackingSystem.Application.DTOs;

namespace ResourceEngagementTrackingSystem.Api.Tests.Controllers
{
    public class DepartmentsControllerTestFixture
    {
        public IEnumerable<DepartmentDto> SampleDepartments { get; }
        public DepartmentDto SampleDepartment { get; }
        public DepartmentDto SampleUpdatedDepartment { get; }
        public CreateDepartmentDto SampleCreateDepartmentDto { get; }
        public UpdateDepartmentDto SampleUpdateDepartmentDto { get; }

        public DepartmentsControllerTestFixture()
        {
            SampleDepartment = new DepartmentDto
            {
                Id = 1,
                Name = "Software Development"
            };

            SampleUpdatedDepartment = new DepartmentDto
            {
                Id = 1,
                Name = "Engineering & Development" // Updated name
            };

            var department2 = new DepartmentDto
            {
                Id = 2,
                Name = "Human Resources"
            };

            var department3 = new DepartmentDto
            {
                Id = 3,
                Name = "Sales & Marketing"
            };

            SampleDepartments = new List<DepartmentDto> { SampleDepartment, department2, department3 };

            SampleCreateDepartmentDto = new CreateDepartmentDto
            {
                Name = "Quality Assurance"
            };

            SampleUpdateDepartmentDto = new UpdateDepartmentDto
            {
                Name = "Engineering & Development"
            };
        }
    }
}