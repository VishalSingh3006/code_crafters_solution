namespace ResourceEngagementTrackingSystem.Application.DTOs.ResourceTracking.Analytics
{
    public class ResourceAnalyticsDto
    {
        public int TotalDeliveries { get; set; }
        public int CompletedDeliveries { get; set; }
        public int OnTimeDeliveries { get; set; }
        public decimal AverageEffort { get; set; }
        public int TotalStaffingRecords { get; set; }
        public int ActiveStaffing { get; set; }
        public decimal UtilizationRate { get; set; }
        public decimal TotalBillingAmount { get; set; }
        public decimal PaidAmount { get; set; }
        public decimal PendingAmount { get; set; }
        public int ActiveRecruitments { get; set; }
        public int FilledPositions { get; set; }
    }
}
