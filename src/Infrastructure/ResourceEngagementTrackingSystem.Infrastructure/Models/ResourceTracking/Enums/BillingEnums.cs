namespace ResourceEngagementTrackingSystem.Infrastructure.Models.ResourceTracking.Enums
{
    public enum BillingStatus
    {
        Draft = 1,
        Submitted = 2,
        Approved = 3,
        Invoiced = 4,
        Rejected = 5
    }

    public enum BillingType
    {
        Regular = 1,
        Overtime = 2,
        Holiday = 3,
        Bonus = 4
    }
}