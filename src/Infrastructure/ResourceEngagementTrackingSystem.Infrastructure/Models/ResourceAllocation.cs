using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ResourceEngagementTrackingSystem.Infrastructure.Models
{
    public class ResourceAllocation : BaseEntity
    {
        [Required]
        public int EngagementId { get; set; }
        
        [Required]
        public int EmployeeId { get; set; }
        
        [Required]
        [Range(0, 100)]
        public decimal AllocationPercentage { get; set; }

        // Navigation properties
        [ForeignKey("EngagementId")]
        public virtual ProjectClientEngagement? Engagement { get; set; }
        
        [ForeignKey("EmployeeId")]
        public virtual Employee? Employee { get; set; }
    }
}
