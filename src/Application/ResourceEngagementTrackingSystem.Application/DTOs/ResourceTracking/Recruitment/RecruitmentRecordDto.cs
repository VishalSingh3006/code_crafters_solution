using System;

namespace ResourceEngagementTrackingSystem.Application.DTOs.ResourceTracking.Recruitment
{
    public class RecruitmentRecordDto
    {
        public int Id { get; set; }
        public string Position { get; set; } = string.Empty;
        public string Department { get; set; } = string.Empty;
        public DateTime PostedDate { get; set; }
        public DateTime? ClosedDate { get; set; }
        public string RecruitmentType { get; set; } = string.Empty;
        public string? JobDescription { get; set; }
        public string? Requirements { get; set; }
        public int NumberOfOpenings { get; set; }
        public string Status { get; set; } = string.Empty;
        public decimal? Budget { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
    }
}