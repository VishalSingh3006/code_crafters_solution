using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ResourceEngagementTrackingSystem.Infrastructure.Models
{
    public class ProjectClientEngagement : BaseEntity
    {
        [Key]
        public new int Id { get; set; }

        [ForeignKey("Project")]
        public int? ProjectId { get; set; }
        public Project? Project { get; set; }

        [ForeignKey("Client")]
        public int? ClientId { get; set; }
        public Client? Client { get; set; }

        [Required]
        public DateTime StartDate { get; set; }
        
        public DateTime? EndDate { get; set; }

        [Required]
        public ProjectClientEngagementStatus OutcomeStatus { get; set; }
        
        // Ensure either ProjectId or ClientId is set, but not both
        public bool IsProjectEngagement => ProjectId.HasValue && !ClientId.HasValue;
        public bool IsClientEngagement => ClientId.HasValue && !ProjectId.HasValue;
    }

    public enum ProjectClientEngagementStatus
    {
        Success = 0,
        Delayed = 1,
        Cancelled = 2
    }
}