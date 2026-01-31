using System.Collections.Generic;
using System.Threading.Tasks;
using ResourceEngagementTrackingSystem.Infrastructure.Models.ResourceTracking;

namespace ResourceEngagementTrackingSystem.Infrastructure.Repositories.ResourceTracking
{
    public interface IBillingRecordRepository
    {
        Task<IEnumerable<BillingRecord>> GetAllAsync();
        Task<BillingRecord?> GetByIdAsync(int id);
        Task<BillingRecord> AddAsync(BillingRecord billingRecord);
        Task<bool> UpdateAsync(BillingRecord billingRecord);
        Task<bool> DeleteAsync(int id);
        Task<IEnumerable<BillingRecord>> GetByProjectIdAsync(int projectId);
        Task<IEnumerable<BillingRecord>> GetByEmployeeIdAsync(int employeeId);
        Task<IEnumerable<BillingRecord>> GetMonthlyBillingRecordsAsync(int month, int year);
        Task<IEnumerable<BillingRecord>> GetUninvoicedRecordsAsync();
        Task<bool> MarkAsInvoicedAsync(int id, string invoiceNumber);
    }
}