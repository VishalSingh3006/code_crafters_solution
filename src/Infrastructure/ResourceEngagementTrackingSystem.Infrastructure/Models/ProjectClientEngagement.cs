using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ResourceEngagementTrackingSystem.Infrastructure.Models
{
    public class ProjectClientEngagement : BaseEntity
    {
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
        
        // Navigation properties for related entities
        public ICollection<EngagementPosition>? Positions { get; set; }
        public ICollection<ResourceAllocation>? ResourceAllocations { get; set; }
        
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