using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using ResourceEngagementTrackingSystem.Infrastructure.Models.ResourceTracking;

namespace ResourceEngagementTrackingSystem.Infrastructure.Repositories.ResourceTracking
{
    public class StaffingRecordRepository : IStaffingRecordRepository
    {
        private readonly ApplicationDbContext _context;

        public StaffingRecordRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<StaffingRecord>> GetAllAsync()
        {
            return await _context
                .StaffingRecords.Include(s => s.Employee)
                .Include(s => s.Project)
                .ToListAsync();
        }

        public async Task<StaffingRecord?> GetByIdAsync(int id)
        {
            return await _context
                .StaffingRecords.Include(s => s.Employee)
                .Include(s => s.Project)
                .FirstOrDefaultAsync(s => s.Id == id);
        }

        public async Task<StaffingRecord> AddAsync(StaffingRecord staffingRecord)
        {
            _context.StaffingRecords.Add(staffingRecord);
            await _context.SaveChangesAsync();
            return staffingRecord;
        }

        public async Task<bool> UpdateAsync(StaffingRecord staffingRecord)
        {
            try
            {
                _context.Entry(staffingRecord).State = EntityState.Modified;
                await _context.SaveChangesAsync();
                return true;
            }
            catch
            {
                return false;
            }
        }

        public async Task<bool> DeleteAsync(int id)
        {
            try
            {
                var staffingRecord = await _context.StaffingRecords.FindAsync(id);
                if (staffingRecord == null)
                    return false;

                _context.StaffingRecords.Remove(staffingRecord);
                await _context.SaveChangesAsync();
                return true;
            }
            catch
            {
                return false;
            }
        }

        public async Task<IEnumerable<StaffingRecord>> GetByEmployeeIdAsync(int employeeId)
        {
            return await _context
                .StaffingRecords.Include(s => s.Employee)
                .Include(s => s.Project)
                .Where(s => s.EmployeeId == employeeId)
                .ToListAsync();
        }

        public async Task<IEnumerable<StaffingRecord>> GetByProjectIdAsync(int projectId)
        {
            return await _context
                .StaffingRecords.Include(s => s.Employee)
                .Include(s => s.Project)
                .Where(s => s.ProjectId == projectId)
                .ToListAsync();
        }

        public async Task<IEnumerable<StaffingRecord>> GetActiveRecordsAsync()
        {
            return await _context
                .StaffingRecords.Include(s => s.Employee)
                .Include(s => s.Project)
                .Where(s => s.EndDate == null || s.EndDate > DateTime.Now)
                .ToListAsync();
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
                )
                .ToListAsync();

            if (!staffingRecords.Any())
                return 0;

            // Calculate utilization percentage based on allocation
            var totalAllocation = staffingRecords.Sum(s => s.AllocationPercentage);
            return Math.Min(totalAllocation, 100); // Cap at 100%
        }
    }
}
