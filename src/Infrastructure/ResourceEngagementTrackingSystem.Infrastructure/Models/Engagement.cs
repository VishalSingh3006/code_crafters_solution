using System;
using System.Collections.Generic;

namespace ResourceEngagementTrackingSystem.Infrastructure.Models
{
    public class Engagement : BaseEntity
    {
        public string Name { get; set; }
        public string Description { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public OutcomeStatus OutcomeStatus { get; set; }
        public ICollection<EngagementPosition> Positions { get; set; }
    }

    public enum OutcomeStatus
    {
        NotStarted,
        InProgress,
        Completed,
        Cancelled
    }
}
