using System;
using System.ComponentModel.DataAnnotations;

namespace ResourceEngagementTrackingSystem.Application.DTOs.ResourceTracking.Recruitment
{
    public class CreateRecruitmentRecordDto
    {
        [Required]
        [MaxLength(200)]
        public string Position { get; set; } = string.Empty;

        [Required]
        [MaxLength(100)]
        public string Department { get; set; } = string.Empty;

        [Required]
        public DateTime PostedDate { get; set; }

        public DateTime? ClosedDate { get; set; }

        [Required]
        [MaxLength(100)]
        public string RecruitmentType { get; set; } = "Internal"; // Internal, External, Contract

        [MaxLength(1000)]
        public string? JobDescription { get; set; }

        [MaxLength(500)]
        public string? Requirements { get; set; }

        [Required]
        [Range(1, int.MaxValue)]
        public int NumberOfOpenings { get; set; }

        [Required]
        public string Status { get; set; } = "Open"; // Open, InProgress, Closed, OnHold

        [Range(0, double.MaxValue)]
        public decimal? Budget { get; set; }
    }
}