using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using ResourceEngagementTrackingSystem.Application.DTOs.ResourceTracking.Staffing;
using ResourceEngagementTrackingSystem.Application.Interfaces.ResourceTracking;
using ResourceEngagementTrackingSystem.Infrastructure;
using ResourceEngagementTrackingSystem.Infrastructure.Models.ResourceTracking;
using ResourceEngagementTrackingSystem.Infrastructure.Models.ResourceTracking.Enums;

namespace ResourceEngagementTrackingSystem.Infrastructure.Services.ResourceTracking
{
    public class StaffingService : IStaffingService
    {
        private readonly ApplicationDbContext _context;

        public StaffingService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<StaffingRecordDto>> GetAllStaffingRecordsAsync()
        {
            var staffingRecords = await _context
                .StaffingRecords.Include(s => s.Employee)
                .Include(s => s.Project)
                .ToListAsync();

            return staffingRecords.Select(MapToDto);
        }

        public async Task<StaffingRecordDto?> GetStaffingRecordByIdAsync(int id)
        {
            var staffingRecord = await _context
                .StaffingRecords.Include(s => s.Employee)
                .Include(s => s.Project)
                .FirstOrDefaultAsync(s => s.Id == id);

            return staffingRecord != null ? MapToDto(staffingRecord) : null;
        }

        public async Task<StaffingRecordDto> CreateStaffingRecordAsync(
            CreateStaffingRecordDto createStaffingRecordDto
        )
        {
            var staffingRecord = new StaffingRecord
            {
                EmployeeId = createStaffingRecordDto.EmployeeId,
                ProjectId = createStaffingRecordDto.ProjectId,
                StartDate = createStaffingRecordDto.StartDate,
                EndDate = createStaffingRecordDto.EndDate,
                AllocationPercentage = createStaffingRecordDto.AllocationPercentage,
                Role = createStaffingRecordDto.Role,
                HourlyRate = createStaffingRecordDto.HourlyRate,
                TotalHours = createStaffingRecordDto.TotalHours,
                Notes = createStaffingRecordDto.Notes,
                Status = StaffingStatus.Active,
            };

            _context.StaffingRecords.Add(staffingRecord);
            await _context.SaveChangesAsync();

            return await GetStaffingRecordByIdAsync(staffingRecord.Id)
                ?? throw new InvalidOperationException("Failed to create staffing record");
        }

        public async Task<bool> UpdateStaffingRecordAsync(
            int id,
            UpdateStaffingRecordDto updateStaffingRecordDto
        )
        {
            var staffingRecord = await _context.StaffingRecords.FindAsync(id);
            if (staffingRecord == null)
                return false;

            if (updateStaffingRecordDto.StartDate.HasValue)
                staffingRecord.StartDate = updateStaffingRecordDto.StartDate.Value;
            staffingRecord.EndDate = updateStaffingRecordDto.EndDate;
            if (updateStaffingRecordDto.AllocationPercentage.HasValue)
                staffingRecord.AllocationPercentage = updateStaffingRecordDto
                    .AllocationPercentage
                    .Value;
            if (!string.IsNullOrEmpty(updateStaffingRecordDto.Role))
                staffingRecord.Role = updateStaffingRecordDto.Role;
            if (updateStaffingRecordDto.HourlyRate.HasValue)
                staffingRecord.HourlyRate = updateStaffingRecordDto.HourlyRate;
            if (updateStaffingRecordDto.TotalHours.HasValue)
                staffingRecord.TotalHours = updateStaffingRecordDto.TotalHours;
            staffingRecord.Notes = updateStaffingRecordDto.Notes;
            if (!string.IsNullOrEmpty(updateStaffingRecordDto.Status))
                staffingRecord.Status = Enum.Parse<StaffingStatus>(updateStaffingRecordDto.Status);

            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteStaffingRecordAsync(int id)
        {
            var staffingRecord = await _context.StaffingRecords.FindAsync(id);
            if (staffingRecord == null)
                return false;

            _context.StaffingRecords.Remove(staffingRecord);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<IEnumerable<StaffingRecordDto>> GetStaffingRecordsByEmployeeIdAsync(
            int employeeId
        )
        {
            var staffingRecords = await _context
                .StaffingRecords.Include(s => s.Employee)
                .Include(s => s.Project)
                .Where(s => s.EmployeeId == employeeId)
                .ToListAsync();

            return staffingRecords.Select(MapToDto);
        }

        public async Task<IEnumerable<StaffingRecordDto>> GetStaffingRecordsByProjectIdAsync(
            int projectId
        )
        {
            var staffingRecords = await _context
                .StaffingRecords.Include(s => s.Employee)
                .Include(s => s.Project)
                .Where(s => s.ProjectId == projectId)
                .ToListAsync();

            return staffingRecords.Select(MapToDto);
        }

        public async Task<IEnumerable<StaffingRecordDto>> GetActiveStaffingRecordsAsync()
        {
            var staffingRecords = await _context
                .StaffingRecords.Include(s => s.Employee)
                .Include(s => s.Project)
                .Where(s => s.Status == StaffingStatus.Active)
                .ToListAsync();

            return staffingRecords.Select(MapToDto);
        }

        public async Task<decimal> GetEmployeeUtilizationAsync(
            int employeeId,
            DateTime startDate,
            DateTime endDate
        )
        {
            var staffingRecords = await _context
                .StaffingRecords.Where(s =>
                    s.EmployeeId == employeeId
                    && s.StartDate <= endDate
                    && (s.EndDate == null || s.EndDate >= startDate)
                    && s.Status == StaffingStatus.Active
                )
                .ToListAsync();

            if (!staffingRecords.Any())
                return 0;

            // Calculate average allocation percentage across all active assignments
            var totalAllocation = staffingRecords.Sum(s => s.AllocationPercentage);
            return Math.Min(totalAllocation, 1.0m); // Cap at 100%
        }

        private static StaffingRecordDto MapToDto(StaffingRecord staffingRecord)
        {
            return new StaffingRecordDto
            {
                Id = staffingRecord.Id,
                EmployeeId = staffingRecord.EmployeeId,
                EmployeeName =
                    staffingRecord.Employee != null
                        ? $"{staffingRecord.Employee.FirstName} {staffingRecord.Employee.LastName}"
                        : string.Empty,
                ProjectId = staffingRecord.ProjectId,
                ProjectName = staffingRecord.Project?.Name ?? string.Empty,
                StartDate = staffingRecord.StartDate,
                EndDate = staffingRecord.EndDate,
                AllocationPercentage = staffingRecord.AllocationPercentage,
                Role = staffingRecord.Role,
                HourlyRate = staffingRecord.HourlyRate,
                TotalHours = staffingRecord.TotalHours,
                Notes = staffingRecord.Notes,
                Status = staffingRecord.Status.ToString(),
            };
        }
    }
}
