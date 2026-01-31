using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using ResourceEngagementTrackingSystem.Infrastructure.Models.ResourceTracking;

namespace ResourceEngagementTrackingSystem.Infrastructure.Repositories.ResourceTracking
{
    public interface IStaffingRecordRepository
    {
        Task<IEnumerable<StaffingRecord>> GetAllAsync();
        Task<StaffingRecord?> GetByIdAsync(int id);
        Task<StaffingRecord> AddAsync(StaffingRecord staffingRecord);
        Task<bool> UpdateAsync(StaffingRecord staffingRecord);
        Task<bool> DeleteAsync(int id);
        Task<IEnumerable<StaffingRecord>> GetByEmployeeIdAsync(int employeeId);
        Task<IEnumerable<StaffingRecord>> GetByProjectIdAsync(int projectId);
        Task<IEnumerable<StaffingRecord>> GetActiveRecordsAsync();
        Task<decimal> GetEmployeeUtilizationAsync(
            int employeeId,
            DateTime startDate,
            DateTime endDate
        );
    }
}
