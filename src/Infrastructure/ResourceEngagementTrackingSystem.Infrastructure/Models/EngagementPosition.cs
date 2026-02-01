using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ResourceEngagementTrackingSystem.Infrastructure.Models
{
    public class EngagementPosition : BaseEntity
    {
        [Required]
        public int EngagementId { get; set; }
        
        [Required]
        [MaxLength(200)]
        public string Title { get; set; } = string.Empty;
        
        [MaxLength(100)]
        public string? RequiredSkill { get; set; }
        
        [MaxLength(100)]
        public string? RequiredProficiency { get; set; }

        // Navigation properties
        [ForeignKey("EngagementId")]
        public virtual ProjectClientEngagement? Engagement { get; set; }
    }
}
