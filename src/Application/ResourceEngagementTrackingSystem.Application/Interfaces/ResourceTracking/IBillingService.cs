using System.Collections.Generic;
using System.Threading.Tasks;
using ResourceEngagementTrackingSystem.Application.DTOs.ResourceTracking.Billing;

namespace ResourceEngagementTrackingSystem.Application.Interfaces.ResourceTracking
{
    public interface IBillingService
    {
        Task<IEnumerable<BillingRecordDto>> GetAllBillingRecordsAsync();
        Task<BillingRecordDto?> GetBillingRecordByIdAsync(int id);
        Task<BillingRecordDto> CreateBillingRecordAsync(
            CreateBillingRecordDto createBillingRecordDto
        );
        Task<bool> UpdateBillingRecordAsync(int id, UpdateBillingRecordDto updateBillingRecordDto);
        Task<bool> DeleteBillingRecordAsync(int id);
        Task<IEnumerable<BillingRecordDto>> GetBillingRecordsByProjectIdAsync(int projectId);
        Task<IEnumerable<BillingRecordDto>> GetBillingRecordsByEmployeeIdAsync(int employeeId);
        Task<object> GetMonthlyBillingReportAsync(int month, int year);
        Task<IEnumerable<BillingRecordDto>> GetUninvoicedBillingRecordsAsync();
        Task<bool> MarkAsInvoicedAsync(int id, string invoiceNumber);
    }
}
