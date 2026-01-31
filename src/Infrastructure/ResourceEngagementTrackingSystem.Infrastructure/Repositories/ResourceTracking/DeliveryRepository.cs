using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using ResourceEngagementTrackingSystem.Infrastructure.Models.ResourceTracking;
using ResourceEngagementTrackingSystem.Infrastructure.Models.ResourceTracking.Enums;

namespace ResourceEngagementTrackingSystem.Infrastructure.Repositories.ResourceTracking
{
    public class DeliveryRepository : IDeliveryRepository
    {
        private readonly ApplicationDbContext _context;

        public DeliveryRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Delivery>> GetAllAsync()
        {
            return await _context
                .Deliveries.Include(d => d.Project)
                .Include(d => d.Employee)
                .ToListAsync();
        }

        public async Task<Delivery?> GetByIdAsync(int id)
        {
            return await _context
                .Deliveries.Include(d => d.Project)
                .Include(d => d.Employee)
                .FirstOrDefaultAsync(d => d.Id == id);
        }

        public async Task<Delivery> AddAsync(Delivery delivery)
        {
            _context.Deliveries.Add(delivery);
            await _context.SaveChangesAsync();
            return delivery;
        }

        public async Task<bool> UpdateAsync(Delivery delivery)
        {
            _context.Deliveries.Update(delivery);
            var result = await _context.SaveChangesAsync();
            return result > 0;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var delivery = await _context.Deliveries.FindAsync(id);
            if (delivery == null)
                return false;

            _context.Deliveries.Remove(delivery);
            var result = await _context.SaveChangesAsync();
            return result > 0;
        }

        public async Task<IEnumerable<Delivery>> GetByProjectIdAsync(int projectId)
        {
            return await _context
                .Deliveries.Include(d => d.Project)
                .Include(d => d.Employee)
                .Where(d => d.ProjectId == projectId)
                .ToListAsync();
        }

        public async Task<IEnumerable<Delivery>> GetByEmployeeIdAsync(int employeeId)
        {
            return await _context
                .Deliveries.Include(d => d.Project)
                .Include(d => d.Employee)
                .Where(d => d.EmployeeId == employeeId)
                .ToListAsync();
        }

        public async Task<IEnumerable<Delivery>> GetOverdueDeliveriesAsync()
        {
            return await _context
                .Deliveries.Include(d => d.Project)
                .Include(d => d.Employee)
                .Where(d =>
                    d.PlannedDeliveryDate < DateTime.Now
                    && d.Status != DeliveryStatus.Delivered
                    && d.Status != DeliveryStatus.Cancelled
                )
                .ToListAsync();
        }
    }
}
