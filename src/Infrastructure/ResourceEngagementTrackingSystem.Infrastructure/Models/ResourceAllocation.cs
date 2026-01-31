using System;

namespace ResourceEngagementTrackingSystem.Infrastructure.Models
{
    public class ResourceAllocation : BaseEntity
    {
        public int EngagementPositionId { get; set; }
        public EngagementPosition EngagementPosition { get; set; }
        public int EmployeeId { get; set; }
        public Employee Employee { get; set; }
        public DateTime AllocationStart { get; set; }
        public DateTime? AllocationEnd { get; set; }
        public decimal AllocationPercentage { get; set; }
    }
}
