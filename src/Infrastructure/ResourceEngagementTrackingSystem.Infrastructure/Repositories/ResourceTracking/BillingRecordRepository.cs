using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using ResourceEngagementTrackingSystem.Infrastructure.Models.ResourceTracking;

namespace ResourceEngagementTrackingSystem.Infrastructure.Repositories.ResourceTracking
{
    public class BillingRecordRepository : IBillingRecordRepository
    {
        private readonly ApplicationDbContext _context;

        public BillingRecordRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<BillingRecord>> GetAllAsync()
        {
            return await _context
                .BillingRecords.Include(b => b.Project)
                .Include(b => b.Employee)
                .ToListAsync();
        }

        public async Task<BillingRecord?> GetByIdAsync(int id)
        {
            return await _context
                .BillingRecords.Include(b => b.Project)
                .Include(b => b.Employee)
                .FirstOrDefaultAsync(b => b.Id == id);
        }

        public async Task<BillingRecord> AddAsync(BillingRecord billingRecord)
        {
            _context.BillingRecords.Add(billingRecord);
            await _context.SaveChangesAsync();
            return billingRecord;
        }

        public async Task<bool> UpdateAsync(BillingRecord billingRecord)
        {
            try
            {
                _context.Entry(billingRecord).State = EntityState.Modified;
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
                var billingRecord = await _context.BillingRecords.FindAsync(id);
                if (billingRecord == null)
                    return false;

                _context.BillingRecords.Remove(billingRecord);
                await _context.SaveChangesAsync();
                return true;
            }
            catch
            {
                return false;
            }
        }

        public async Task<IEnumerable<BillingRecord>> GetByProjectIdAsync(int projectId)
        {
            return await _context
                .BillingRecords.Include(b => b.Project)
                .Include(b => b.Employee)
                .Where(b => b.ProjectId == projectId)
                .ToListAsync();
        }

        public async Task<IEnumerable<BillingRecord>> GetByEmployeeIdAsync(int employeeId)
        {
            return await _context
                .BillingRecords.Include(b => b.Project)
                .Include(b => b.Employee)
                .Where(b => b.EmployeeId == employeeId)
                .ToListAsync();
        }

        public async Task<IEnumerable<BillingRecord>> GetMonthlyBillingRecordsAsync(
            int month,
            int year
        )
        {
            return await _context
                .BillingRecords.Include(b => b.Project)
                .Include(b => b.Employee)
                .Where(b => b.BillingDate.Month == month && b.BillingDate.Year == year)
                .ToListAsync();
        }

        public async Task<IEnumerable<BillingRecord>> GetUninvoicedRecordsAsync()
        {
            return await _context
                .BillingRecords.Include(b => b.Project)
                .Include(b => b.Employee)
                .Where(b => string.IsNullOrEmpty(b.InvoiceNumber))
                .ToListAsync();
        }

        public async Task<bool> MarkAsInvoicedAsync(int id, string invoiceNumber)
        {
            try
            {
                var billingRecord = await _context.BillingRecords.FindAsync(id);
                if (billingRecord == null)
                    return false;

                billingRecord.InvoiceNumber = invoiceNumber;
                await _context.SaveChangesAsync();
                return true;
            }
            catch
            {
                return false;
            }
        }
    }
}
