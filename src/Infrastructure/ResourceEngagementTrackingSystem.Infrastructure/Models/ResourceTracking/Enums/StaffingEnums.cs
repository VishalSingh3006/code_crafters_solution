namespace ResourceEngagementTrackingSystem.Infrastructure.Models.ResourceTracking.Enums
{
    public enum StaffingStatus
    {
        Active = 1,
        Inactive = 2,
        Completed = 3,
        OnHold = 4,
    }

    public enum RecruitmentStatus
    {
        Open = 1,
        InProgress = 2,
        Closed = 3,
        OnHold = 4,
        Cancelled = 5,
    }

    public enum RecruitmentType
    {
        Internal = 1,
        External = 2,
        Contract = 3,
    }
}
