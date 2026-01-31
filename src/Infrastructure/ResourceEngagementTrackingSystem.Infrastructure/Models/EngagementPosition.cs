using System.Collections.Generic;

namespace ResourceEngagementTrackingSystem.Infrastructure.Models
{
    public class EngagementPosition : BaseEntity
    {
        public int EngagementId { get; set; }
        public Engagement Engagement { get; set; }
        public string Title { get; set; }
        public string RequiredSkill { get; set; } // Consider FK to Skill
        public string RequiredProficiency { get; set; } // Consider FK to ProficiencyLevel
        public ICollection<ResourceAllocation> ResourceAllocations { get; set; }
    }
}
