
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using ResourceEngagementTrackingSystem.Application.DTOs;
using ResourceEngagementTrackingSystem.Application.Interfaces;
using ResourceEngagementTrackingSystem.Infrastructure.Models;

namespace ResourceEngagementTrackingSystem.Infrastructure.Services
{
    public class EmployeeService : IEmployeeService
    {
        private readonly ApplicationDbContext _context;
        public EmployeeService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<EmployeeDto>> GetAllAsync()
        {
            return await _context.Employees.Select(e => new EmployeeDto
            {
                Id = e.Id,
                FirstName = e.FirstName,
                LastName = e.LastName,
                Email = e.Email,
                Position = e.Position
            }).ToListAsync();
        }

        public async Task<EmployeeDto> GetByIdAsync(int id)
        {
            var e = await _context.Employees.FindAsync(id);
            if (e == null) return null;
            return new EmployeeDto
            {
                Id = e.Id,
                FirstName = e.FirstName,
                LastName = e.LastName,
                Email = e.Email,
                Position = e.Position
            };
        }

        public async Task<EmployeeDto> CreateAsync(CreateEmployeeDto dto)
        {
            var e = new Employee
            {
                FirstName = dto.FirstName,
                LastName = dto.LastName,
                Email = dto.Email,
                Position = dto.Position
            };
            _context.Employees.Add(e);
            await _context.SaveChangesAsync();
            return new EmployeeDto
            {
                Id = e.Id,
                FirstName = e.FirstName,
                LastName = e.LastName,
                Email = e.Email,
                Position = e.Position
            };
        }

        public async Task<EmployeeDto> UpdateAsync(int id, UpdateEmployeeDto dto)
        {
            var e = await _context.Employees.FindAsync(id);
            if (e == null) return null;
            e.FirstName = dto.FirstName;
            e.LastName = dto.LastName;
            e.Email = dto.Email;
            e.Position = dto.Position;
            await _context.SaveChangesAsync();
            return new EmployeeDto
            {
                Id = e.Id,
                FirstName = e.FirstName,
                LastName = e.LastName,
                Email = e.Email,
                Position = e.Position
            };
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var e = await _context.Employees.FindAsync(id);
            if (e == null) return false;
            _context.Employees.Remove(e);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}