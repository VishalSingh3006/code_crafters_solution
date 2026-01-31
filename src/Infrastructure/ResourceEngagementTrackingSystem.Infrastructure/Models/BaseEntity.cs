using System;

namespace ResourceEngagementTrackingSystem.Infrastructure.Models
{
    public abstract class BaseEntity
    {

        public int CreatedBy { get; set; }
        public int UpdatedBy { get; set; }
        public DateTime CreatedOn { get; set; }
        public DateTime UpdatedOn { get; set; }
        public Status Status { get; set; }
    }
}
