using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using ResourceEngagementTrackingSystem.Application.DTOs;
using ResourceEngagementTrackingSystem.Application.Interfaces;
using ResourceEngagementTrackingSystem.Infrastructure.Models;

namespace ResourceEngagementTrackingSystem.Infrastructure.Services
{
    public class PortfolioCompanyService : IPortfolioCompanyService
    {
        private readonly ApplicationDbContext _context;
        
        public PortfolioCompanyService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<PortfolioCompanyDto>> GetAllAsync()
        {
            return await _context.PortfolioCompanies
                .Select(pc => new PortfolioCompanyDto
                {
                    Id = pc.Id,
                    Name = pc.Name,
                    CurrencyCode = pc.CurrencyCode,
                    Status = pc.Status,
                    StartDate = pc.StartDate,
                    EndDate = pc.EndDate
                })
                .ToListAsync();
        }

        public async Task<PortfolioCompanyDto?> GetByIdAsync(int id)
        {
            var pc = await _context.PortfolioCompanies.FindAsync(id);
            if (pc == null) return null;
            
            return new PortfolioCompanyDto
            {
                Id = pc.Id,
                Name = pc.Name,
                CurrencyCode = pc.CurrencyCode,
                Status = pc.Status,
                StartDate = pc.StartDate,
                EndDate = pc.EndDate
            };
        }

        public async Task<PortfolioCompanyDto> CreateAsync(CreatePortfolioCompanyDto dto)
        {
            var pc = new PortfolioCompany
            {
                Name = dto.Name,
                CurrencyCode = dto.CurrencyCode,
                Status = dto.Status,
                StartDate = dto.StartDate,
                EndDate = dto.EndDate
            };
            
            _context.PortfolioCompanies.Add(pc);
            await _context.SaveChangesAsync();
            
            return new PortfolioCompanyDto
            {
                Id = pc.Id,
                Name = pc.Name,
                CurrencyCode = pc.CurrencyCode,
                Status = pc.Status,
                StartDate = pc.StartDate,
                EndDate = pc.EndDate
            };
        }

        public async Task<PortfolioCompanyDto?> UpdateAsync(int id, UpdatePortfolioCompanyDto dto)
        {
            var pc = await _context.PortfolioCompanies.FindAsync(id);
            if (pc == null) return null;
            
            pc.Name = dto.Name;
            pc.CurrencyCode = dto.CurrencyCode;
            pc.Status = dto.Status;
            pc.StartDate = dto.StartDate;
            pc.EndDate = dto.EndDate;
            
            await _context.SaveChangesAsync();
            
            return new PortfolioCompanyDto
            {
                Id = pc.Id,
                Name = pc.Name,
                CurrencyCode = pc.CurrencyCode,
                Status = pc.Status,
                StartDate = pc.StartDate,
                EndDate = pc.EndDate
            };
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var pc = await _context.PortfolioCompanies.FindAsync(id);
            if (pc == null) return false;
            
            _context.PortfolioCompanies.Remove(pc);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}