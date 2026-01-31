using System;

namespace ResourceEngagementTrackingSystem.Application.DTOs.ResourceTracking.Staffing
{
    public class StaffingRecordDto
    {
        public int Id { get; set; }
        public int EmployeeId { get; set; }
        public string EmployeeName { get; set; } = string.Empty;
        public string EmployeeEmail { get; set; } = string.Empty;
        public int ProjectId { get; set; }
        public string ProjectName { get; set; } = string.Empty;
        public DateTime StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public decimal AllocationPercentage { get; set; }
        public string Role { get; set; } = string.Empty;
        public decimal? HourlyRate { get; set; }
        public int? TotalHours { get; set; }
        public string? Notes { get; set; }
        public string Status { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
    }
}