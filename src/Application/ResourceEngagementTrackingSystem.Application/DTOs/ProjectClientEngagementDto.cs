using System;
using System.ComponentModel.DataAnnotations;

namespace ResourceEngagementTrackingSystem.Application.DTOs
{
    public class ProjectClientEngagementDto
    {
        public int Id { get; set; }
        public int? ProjectId { get; set; }
        public string? ProjectName { get; set; }
        public int? ClientId { get; set; }
        public string? ClientName { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public string OutcomeStatus { get; set; }
        public bool IsProjectEngagement { get; set; }
        public bool IsClientEngagement { get; set; }
    }

    public class CreateProjectClientEngagementDto
    {
        public int? ProjectId { get; set; }
        
        public int? ClientId { get; set; }
        
        [Required]
        public DateTime StartDate { get; set; }
        
        public DateTime? EndDate { get; set; }
        
        [Required]
        public string OutcomeStatus { get; set; } = "Success";
    }

    public class UpdateProjectClientEngagementDto
    {
        public int? ProjectId { get; set; }
        
        public int? ClientId { get; set; }
        
        [Required]
        public DateTime StartDate { get; set; }
        
        public DateTime? EndDate { get; set; }
        
        [Required]
        public string OutcomeStatus { get; set; } = "Success";
    }
}