using System;
using System.ComponentModel.DataAnnotations;

namespace ResourceEngagementTrackingSystem.Application.DTOs.ResourceTracking.Staffing
{
    public class UpdateStaffingRecordDto
    {
        public DateTime? StartDate { get; set; }

        public DateTime? EndDate { get; set; }

        [Range(1, 100)]
        public decimal? AllocationPercentage { get; set; }

        [MaxLength(100)]
        public string? Role { get; set; }

        public decimal? HourlyRate { get; set; }

        public int? TotalHours { get; set; }

        [MaxLength(500)]
        public string? Notes { get; set; }

        public string? Status { get; set; }
    }
}