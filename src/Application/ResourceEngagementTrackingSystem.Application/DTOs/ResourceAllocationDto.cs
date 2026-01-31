using System;

namespace ResourceEngagementTrackingSystem.Application.DTOs
{
    public class ResourceAllocationDto
    {
        public int Id { get; set; }
        public int EngagementPositionId { get; set; }
        public int EmployeeId { get; set; }
        public DateTime AllocationStart { get; set; }
        public DateTime? AllocationEnd { get; set; }
        public decimal AllocationPercentage { get; set; }
    }
}
