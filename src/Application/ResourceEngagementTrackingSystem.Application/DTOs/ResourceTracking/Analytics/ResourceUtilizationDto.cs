using System;
using System.Collections.Generic;

namespace ResourceEngagementTrackingSystem.Application.DTOs.ResourceTracking.Analytics
{
    public class ResourceUtilizationDto
    {
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public List<EmployeeUtilizationDto> EmployeeUtilizations { get; set; } = new();
        public decimal AverageUtilization { get; set; }
        public List<DepartmentUtilizationDto> DepartmentUtilizations { get; set; } = new();
    }

    public class EmployeeUtilizationDto
    {
        public int EmployeeId { get; set; }
        public string EmployeeName { get; set; } = string.Empty;
        public string Department { get; set; } = string.Empty;
        public decimal TotalAllocatedHours { get; set; }
        public decimal TotalWorkedHours { get; set; }
        public decimal UtilizationPercentage { get; set; }
        public List<ProjectAllocationDto> ProjectAllocations { get; set; } = new();
    }

    public class DepartmentUtilizationDto
    {
        public string Department { get; set; } = string.Empty;
        public int EmployeeCount { get; set; }
        public decimal AverageUtilization { get; set; }
        public decimal TotalHours { get; set; }
    }

    public class ProjectAllocationDto
    {
        public int ProjectId { get; set; }
        public string ProjectName { get; set; } = string.Empty;
        public decimal AllocationPercentage { get; set; }
        public decimal HoursWorked { get; set; }
    }
}
