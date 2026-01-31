using System;
using System.ComponentModel.DataAnnotations;

namespace ResourceEngagementTrackingSystem.Application.DTOs.ResourceTracking.Recruitment
{
    public class UpdateRecruitmentRecordDto
    {
        [MaxLength(200)]
        public string? Position { get; set; }

        [MaxLength(100)]
        public string? Department { get; set; }

        public DateTime? PostedDate { get; set; }

        public DateTime? ClosedDate { get; set; }

        [MaxLength(100)]
        public string? RecruitmentType { get; set; }

        [MaxLength(1000)]
        public string? JobDescription { get; set; }

        [MaxLength(500)]
        public string? Requirements { get; set; }

        [Range(1, int.MaxValue)]
        public int? NumberOfOpenings { get; set; }

        public string? Status { get; set; }

        [Range(0, double.MaxValue)]
        public decimal? Budget { get; set; }
    }
}