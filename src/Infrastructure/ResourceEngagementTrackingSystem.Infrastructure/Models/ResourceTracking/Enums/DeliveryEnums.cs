namespace ResourceEngagementTrackingSystem.Infrastructure.Models.ResourceTracking.Enums
{
    public enum DeliveryStatus
    {
        Planned = 1,
        InProgress = 2,
        Delivered = 3,
        Delayed = 4,
        Cancelled = 5
    }

    public enum Priority
    {
        Low = 1,
        Medium = 2,
        High = 3,
        Critical = 4
    }
}