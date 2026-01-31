using System.Collections.Generic;

namespace ResourceEngagementTrackingSystem.Application.DTOs
{
    public class EngagementPositionDto
    {
        public int Id { get; set; }
        public int EngagementId { get; set; }
        public string Title { get; set; }
        public string RequiredSkill { get; set; }
        public string RequiredProficiency { get; set; }
        public List<ResourceAllocationDto> ResourceAllocations { get; set; }
    }
}
