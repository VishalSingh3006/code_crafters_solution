using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using ResourceEngagementTrackingSystem.Application.DTOs;
using ResourceEngagementTrackingSystem.Application.Interfaces;
using ResourceEngagementTrackingSystem.Infrastructure.Models;

namespace ResourceEngagementTrackingSystem.Infrastructure.Services
{
    public class DepartmentService : IDepartmentService
    {
        private readonly ApplicationDbContext _context;

        public DepartmentService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<DepartmentDto>> GetAllAsync()
        {
            return await _context
                .Departments.Select(d => new DepartmentDto { Id = d.Id, Name = d.Name })
                .ToListAsync();
        }

        public async Task<DepartmentDto> GetByIdAsync(int id)
        {
            var d = await _context.Departments.FindAsync(id);
            if (d == null)
                return null;
            return new DepartmentDto { Id = d.Id, Name = d.Name };
        }

        public async Task<DepartmentDto> CreateAsync(CreateDepartmentDto dto)
        {
            var d = new Department { Name = dto.Name };
            _context.Departments.Add(d);
            await _context.SaveChangesAsync();
            return new DepartmentDto { Id = d.Id, Name = d.Name };
        }

        public async Task<DepartmentDto> UpdateAsync(int id, UpdateDepartmentDto dto)
        {
            var d = await _context.Departments.FindAsync(id);
            if (d == null)
                return null;
            d.Name = dto.Name;
            await _context.SaveChangesAsync();
            return new DepartmentDto { Id = d.Id, Name = d.Name };
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var d = await _context.Departments.FindAsync(id);
            if (d == null)
                return false;
            _context.Departments.Remove(d);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
