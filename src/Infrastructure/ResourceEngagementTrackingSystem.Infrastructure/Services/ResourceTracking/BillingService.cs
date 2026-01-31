using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using ResourceEngagementTrackingSystem.Application.DTOs.ResourceTracking.Billing;
using ResourceEngagementTrackingSystem.Application.Interfaces.ResourceTracking;
using ResourceEngagementTrackingSystem.Infrastructure;
using ResourceEngagementTrackingSystem.Infrastructure.Models.ResourceTracking;
using ResourceEngagementTrackingSystem.Infrastructure.Models.ResourceTracking.Enums;

namespace ResourceEngagementTrackingSystem.Infrastructure.Services.ResourceTracking
{
    public class BillingService : IBillingService
    {
        private readonly ApplicationDbContext _context;

        public BillingService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<BillingRecordDto>> GetAllBillingRecordsAsync()
        {
            var billingRecords = await _context
                .BillingRecords.Include(b => b.Project)
                .Include(b => b.Employee)
                .ToListAsync();

            return billingRecords.Select(MapToDto);
        }

        public async Task<BillingRecordDto?> GetBillingRecordByIdAsync(int id)
        {
            var billingRecord = await _context
                .BillingRecords.Include(b => b.Project)
                .Include(b => b.Employee)
                .FirstOrDefaultAsync(b => b.Id == id);

            return billingRecord != null ? MapToDto(billingRecord) : null;
        }

        public async Task<BillingRecordDto> CreateBillingRecordAsync(
            CreateBillingRecordDto createBillingRecordDto
        )
        {
            var billingRecord = new BillingRecord
            {
                ProjectId = createBillingRecordDto.ProjectId,
                EmployeeId = createBillingRecordDto.EmployeeId,
                BillingDate = createBillingRecordDto.BillingDate,
                HoursWorked = createBillingRecordDto.HoursWorked,
                HourlyRate = createBillingRecordDto.HourlyRate,
                TotalAmount =
                    createBillingRecordDto.HoursWorked * createBillingRecordDto.HourlyRate,
                Description = createBillingRecordDto.Description,
                BillingType = Enum.Parse<BillingType>(createBillingRecordDto.BillingType),
                Status = BillingStatus.Draft,
            };

            _context.BillingRecords.Add(billingRecord);
            await _context.SaveChangesAsync();

            return await GetBillingRecordByIdAsync(billingRecord.Id)
                ?? throw new InvalidOperationException("Failed to create billing record");
        }

        public async Task<bool> UpdateBillingRecordAsync(
            int id,
            UpdateBillingRecordDto updateBillingRecordDto
        )
        {
            var billingRecord = await _context.BillingRecords.FindAsync(id);
            if (billingRecord == null)
                return false;

            if (updateBillingRecordDto.HoursWorked.HasValue)
                billingRecord.HoursWorked = updateBillingRecordDto.HoursWorked.Value;
            if (updateBillingRecordDto.HourlyRate.HasValue)
                billingRecord.HourlyRate = updateBillingRecordDto.HourlyRate.Value;
            if (
                updateBillingRecordDto.HoursWorked.HasValue
                && updateBillingRecordDto.HourlyRate.HasValue
            )
                billingRecord.TotalAmount =
                    updateBillingRecordDto.HoursWorked.Value
                    * updateBillingRecordDto.HourlyRate.Value;
            billingRecord.Description = updateBillingRecordDto.Description;
            if (!string.IsNullOrEmpty(updateBillingRecordDto.BillingType))
                billingRecord.BillingType = Enum.Parse<BillingType>(
                    updateBillingRecordDto.BillingType
                );
            if (!string.IsNullOrEmpty(updateBillingRecordDto.Status))
                billingRecord.Status = Enum.Parse<BillingStatus>(updateBillingRecordDto.Status);

            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteBillingRecordAsync(int id)
        {
            var billingRecord = await _context.BillingRecords.FindAsync(id);
            if (billingRecord == null)
                return false;

            _context.BillingRecords.Remove(billingRecord);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<IEnumerable<BillingRecordDto>> GetBillingRecordsByProjectIdAsync(
            int projectId
        )
        {
            var billingRecords = await _context
                .BillingRecords.Include(b => b.Project)
                .Include(b => b.Employee)
                .Where(b => b.ProjectId == projectId)
                .ToListAsync();

            return billingRecords.Select(MapToDto);
        }

        public async Task<IEnumerable<BillingRecordDto>> GetBillingRecordsByEmployeeIdAsync(
            int employeeId
        )
        {
            var billingRecords = await _context
                .BillingRecords.Include(b => b.Project)
                .Include(b => b.Employee)
                .Where(b => b.EmployeeId == employeeId)
                .ToListAsync();

            return billingRecords.Select(MapToDto);
        }

        public async Task<object> GetMonthlyBillingReportAsync(int month, int year)
        {
            var startDate = new DateTime(year, month, 1);
            var endDate = startDate.AddMonths(1).AddDays(-1);

            var billingRecords = await _context
                .BillingRecords.Include(b => b.Project)
                .Include(b => b.Employee)
                .Where(b => b.BillingDate >= startDate && b.BillingDate <= endDate)
                .ToListAsync();

            var totalAmount = billingRecords.Sum(b => b.TotalAmount);
            var totalHours = billingRecords.Sum(b => b.HoursWorked);
            var recordCount = billingRecords.Count;

            var statusBreakdown = billingRecords
                .GroupBy(b => b.Status)
                .ToDictionary(g => g.Key.ToString(), g => g.Sum(b => b.TotalAmount));

            var employeeBreakdown = billingRecords
                .GroupBy(b => new
                {
                    b.EmployeeId,
                    EmployeeName = b.Employee.FirstName + " " + b.Employee.LastName,
                })
                .Select(g => new
                {
                    EmployeeId = g.Key.EmployeeId,
                    EmployeeName = g.Key.EmployeeName,
                    TotalHours = g.Sum(b => b.HoursWorked),
                    TotalAmount = g.Sum(b => b.TotalAmount),
                    RecordCount = g.Count(),
                })
                .ToList();

            var projectBreakdown = billingRecords
                .GroupBy(b => new { b.ProjectId, ProjectName = b.Project.Name })
                .Select(g => new
                {
                    ProjectId = g.Key.ProjectId,
                    ProjectName = g.Key.ProjectName,
                    TotalHours = g.Sum(b => b.HoursWorked),
                    TotalAmount = g.Sum(b => b.TotalAmount),
                    RecordCount = g.Count(),
                })
                .ToList();

            return new
            {
                Month = month,
                Year = year,
                TotalAmount = totalAmount,
                TotalHours = totalHours,
                RecordCount = recordCount,
                StatusBreakdown = statusBreakdown,
                EmployeeBreakdown = employeeBreakdown,
                ProjectBreakdown = projectBreakdown,
            };
        }

        public async Task<IEnumerable<BillingRecordDto>> GetUninvoicedBillingRecordsAsync()
        {
            var billingRecords = await _context
                .BillingRecords.Include(b => b.Project)
                .Include(b => b.Employee)
                .Where(b => b.Status == BillingStatus.Approved)
                .ToListAsync();

            return billingRecords.Select(MapToDto);
        }

        public async Task<bool> MarkAsInvoicedAsync(int id, string invoiceNumber)
        {
            var billingRecord = await _context.BillingRecords.FindAsync(id);
            if (billingRecord == null)
                return false;

            billingRecord.Status = BillingStatus.Invoiced;
            billingRecord.InvoiceNumber = invoiceNumber;

            await _context.SaveChangesAsync();
            return true;
        }

        private static BillingRecordDto MapToDto(BillingRecord billingRecord)
        {
            return new BillingRecordDto
            {
                Id = billingRecord.Id,
                ProjectId = billingRecord.ProjectId,
                ProjectName = billingRecord.Project?.Name ?? string.Empty,
                EmployeeId = billingRecord.EmployeeId,
                EmployeeName =
                    billingRecord.Employee != null
                        ? $"{billingRecord.Employee.FirstName} {billingRecord.Employee.LastName}"
                        : string.Empty,
                BillingDate = billingRecord.BillingDate,
                HoursWorked = billingRecord.HoursWorked,
                HourlyRate = billingRecord.HourlyRate,
                TotalAmount = billingRecord.TotalAmount,
                Description = billingRecord.Description,
                BillingType = billingRecord.BillingType.ToString(),
                Status = billingRecord.Status.ToString(),
                InvoiceNumber = billingRecord.InvoiceNumber,
            };
        }
    }
}
