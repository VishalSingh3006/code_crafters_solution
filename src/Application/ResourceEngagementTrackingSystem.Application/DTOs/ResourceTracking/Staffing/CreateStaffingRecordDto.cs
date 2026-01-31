using System;
using System.ComponentModel.DataAnnotations;

namespace ResourceEngagementTrackingSystem.Application.DTOs.ResourceTracking.Staffing
{
    public class CreateStaffingRecordDto
    {
        [Required]
        public int EmployeeId { get; set; }

        [Required]
        public int ProjectId { get; set; }

        [Required]
        public DateTime StartDate { get; set; }

        public DateTime? EndDate { get; set; }

        [Required]
        [Range(1, 100)]
        public decimal AllocationPercentage { get; set; }

        [Required]
        [MaxLength(100)]
        public string Role { get; set; } = string.Empty;

        public decimal? HourlyRate { get; set; }

        public int? TotalHours { get; set; }

        [MaxLength(500)]
        public string? Notes { get; set; }

        [Required]
        public string Status { get; set; } = "Active"; // Active, Inactive, Completed
    }
}