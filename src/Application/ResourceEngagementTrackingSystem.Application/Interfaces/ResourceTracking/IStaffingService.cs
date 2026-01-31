using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using ResourceEngagementTrackingSystem.Application.DTOs.ResourceTracking.Staffing;

namespace ResourceEngagementTrackingSystem.Application.Interfaces.ResourceTracking
{
    public interface IStaffingService
    {
        Task<IEnumerable<StaffingRecordDto>> GetAllStaffingRecordsAsync();
        Task<StaffingRecordDto?> GetStaffingRecordByIdAsync(int id);
        Task<StaffingRecordDto> CreateStaffingRecordAsync(
            CreateStaffingRecordDto createStaffingRecordDto
        );
        Task<bool> UpdateStaffingRecordAsync(
            int id,
            UpdateStaffingRecordDto updateStaffingRecordDto
        );
        Task<bool> DeleteStaffingRecordAsync(int id);
        Task<IEnumerable<StaffingRecordDto>> GetStaffingRecordsByEmployeeIdAsync(int employeeId);
        Task<IEnumerable<StaffingRecordDto>> GetStaffingRecordsByProjectIdAsync(int projectId);
        Task<IEnumerable<StaffingRecordDto>> GetActiveStaffingRecordsAsync();
        Task<decimal> GetEmployeeUtilizationAsync(
            int employeeId,
            DateTime startDate,
            DateTime endDate
        );
    }
}
