using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using ResourceEngagementTrackingSystem.Application.DTOs;
using ResourceEngagementTrackingSystem.Application.Interfaces;
using ResourceEngagementTrackingSystem.Infrastructure.Models;

namespace ResourceEngagementTrackingSystem.Infrastructure.Services
{
    public class ResourceAllocationService : IResourceAllocationService
    {
        private readonly ApplicationDbContext _context;

        public ResourceAllocationService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<ResourceAllocationDto>> GetAllAsync()
        {
            return await _context.ResourceAllocations
                .Include(ra => ra.Engagement)
                    .ThenInclude(e => e.Project)
                .Include(ra => ra.Engagement)
                    .ThenInclude(e => e.Client)
                .Include(ra => ra.Employee)
                .Select(ra => new ResourceAllocationDto
                {
                    Id = ra.Id,
                    EngagementId = ra.EngagementId,
                    EmployeeId = ra.EmployeeId,
                    AllocationPercentage = ra.AllocationPercentage,
                    EngagementName = ra.Engagement != null 
                        ? (ra.Engagement.Project != null 
                            ? $"Project: {ra.Engagement.Project.Name}"
                            : ra.Engagement.Client != null 
                                ? $"Client: {ra.Engagement.Client.Name}" 
                                : "Unknown Engagement")
                        : null,
                    EmployeeName = ra.Employee != null ? $"{ra.Employee.FirstName} {ra.Employee.LastName}" : null
                })
                .ToListAsync();
        }

        public async Task<IEnumerable<ResourceAllocationDto>> GetByEngagementIdAsync(int engagementId)
        {
            return await _context.ResourceAllocations
                .Include(ra => ra.Engagement)
                    .ThenInclude(e => e.Project)
                .Include(ra => ra.Engagement)
                    .ThenInclude(e => e.Client)
                .Include(ra => ra.Employee)
                .Where(ra => ra.EngagementId == engagementId)
                .Select(ra => new ResourceAllocationDto
                {
                    Id = ra.Id,
                    EngagementId = ra.EngagementId,
                    EmployeeId = ra.EmployeeId,
                    AllocationPercentage = ra.AllocationPercentage,
                    EngagementName = ra.Engagement != null 
                        ? (ra.Engagement.Project != null 
                            ? $"Project: {ra.Engagement.Project.Name}"
                            : ra.Engagement.Client != null 
                                ? $"Client: {ra.Engagement.Client.Name}" 
                                : "Unknown Engagement")
                        : null,
                    EmployeeName = ra.Employee != null ? $"{ra.Employee.FirstName} {ra.Employee.LastName}" : null
                })
                .ToListAsync();
        }

        public async Task<IEnumerable<ResourceAllocationDto>> GetByEmployeeIdAsync(int employeeId)
        {
            return await _context.ResourceAllocations
                .Include(ra => ra.Engagement)
                    .ThenInclude(e => e.Project)
                .Include(ra => ra.Engagement)
                    .ThenInclude(e => e.Client)
                .Include(ra => ra.Employee)
                .Where(ra => ra.EmployeeId == employeeId)
                .Select(ra => new ResourceAllocationDto
                {
                    Id = ra.Id,
                    EngagementId = ra.EngagementId,
                    EmployeeId = ra.EmployeeId,
                    AllocationPercentage = ra.AllocationPercentage,
                    EngagementName = ra.Engagement != null 
                        ? (ra.Engagement.Project != null 
                            ? $"Project: {ra.Engagement.Project.Name}"
                            : ra.Engagement.Client != null 
                                ? $"Client: {ra.Engagement.Client.Name}" 
                                : "Unknown Engagement")
                        : null,
                    EmployeeName = ra.Employee != null ? $"{ra.Employee.FirstName} {ra.Employee.LastName}" : null
                })
                .ToListAsync();
        }

        public async Task<ResourceAllocationDto?> GetByIdAsync(int id)
        {
            var ra = await _context.ResourceAllocations
                .Include(ra => ra.Engagement)
                    .ThenInclude(e => e.Project)
                .Include(ra => ra.Engagement)
                    .ThenInclude(e => e.Client)
                .Include(ra => ra.Employee)
                .FirstOrDefaultAsync(ra => ra.Id == id);

            if (ra == null)
                return null;

            return new ResourceAllocationDto
            {
                Id = ra.Id,
                EngagementId = ra.EngagementId,
                EmployeeId = ra.EmployeeId,
                AllocationPercentage = ra.AllocationPercentage,
                EngagementName = ra.Engagement != null 
                    ? (ra.Engagement.Project != null 
                        ? $"Project: {ra.Engagement.Project.Name}"
                        : ra.Engagement.Client != null 
                            ? $"Client: {ra.Engagement.Client.Name}" 
                            : "Unknown Engagement")
                    : null,
                EmployeeName = ra.Employee != null ? $"{ra.Employee.FirstName} {ra.Employee.LastName}" : null
            };
        }

        public async Task<ResourceAllocationDto> CreateAsync(CreateResourceAllocationDto dto)
        {
            // Validate engagement exists
            var engagementExists = await _context.ProjectClientEngagements
                .AnyAsync(e => e.Id == dto.EngagementId);
            
            if (!engagementExists)
                throw new ArgumentException("Engagement not found.");

            // Validate employee exists
            var employeeExists = await _context.Employees
                .AnyAsync(e => e.Id == dto.EmployeeId);
            
            if (!employeeExists)
                throw new ArgumentException("Employee not found.");

            var allocation = new ResourceAllocation
            {
                EngagementId = dto.EngagementId,
                EmployeeId = dto.EmployeeId,
                AllocationPercentage = dto.AllocationPercentage
            };

            _context.ResourceAllocations.Add(allocation);
            await _context.SaveChangesAsync();

            return await GetByIdAsync(allocation.Id) ?? throw new InvalidOperationException("Failed to retrieve created allocation.");
        }

        public async Task<ResourceAllocationDto?> UpdateAsync(int id, UpdateResourceAllocationDto dto)
        {
            var allocation = await _context.ResourceAllocations.FindAsync(id);
            if (allocation == null)
                return null;

            // Validate engagement exists
            var engagementExists = await _context.ProjectClientEngagements
                .AnyAsync(e => e.Id == dto.EngagementId);
            
            if (!engagementExists)
                throw new ArgumentException("Engagement not found.");

            // Validate employee exists
            var employeeExists = await _context.Employees
                .AnyAsync(e => e.Id == dto.EmployeeId);
            
            if (!employeeExists)
                throw new ArgumentException("Employee not found.");

            allocation.EngagementId = dto.EngagementId;
            allocation.EmployeeId = dto.EmployeeId;
            allocation.AllocationPercentage = dto.AllocationPercentage;

            await _context.SaveChangesAsync();
            return await GetByIdAsync(allocation.Id);
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var allocation = await _context.ResourceAllocations.FindAsync(id);
            if (allocation == null)
                return false;

            _context.ResourceAllocations.Remove(allocation);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}