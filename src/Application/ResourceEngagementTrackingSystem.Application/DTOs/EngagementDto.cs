using System;
using System.Collections.Generic;

namespace ResourceEngagementTrackingSystem.Application.DTOs
{
    public class EngagementDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public string OutcomeStatus { get; set; }
        public List<EngagementPositionDto> Positions { get; set; }
    }
}
