using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using ResourceEngagementTrackingSystem.Application.DTOs;
using ResourceEngagementTrackingSystem.Application.Interfaces;
using ResourceEngagementTrackingSystem.Infrastructure.Models;

namespace ResourceEngagementTrackingSystem.Infrastructure.Services
{
    public class SkillService : ISkillService
    {
        private readonly ApplicationDbContext _context;

        public SkillService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<SkillDto>> GetAllAsync()
        {
            return await _context
                .Skills.Select(s => new SkillDto { Id = s.Id, Name = s.Name })
                .ToListAsync();
        }

        public async Task<SkillDto> GetByIdAsync(int id)
        {
            var s = await _context.Skills.FindAsync(id);
            if (s == null)
                return null;
            return new SkillDto { Id = s.Id, Name = s.Name };
        }

        public async Task<SkillDto> CreateAsync(CreateSkillDto dto)
        {
            var s = new Skill { Name = dto.Name };
            _context.Skills.Add(s);
            await _context.SaveChangesAsync();
            return new SkillDto { Id = s.Id, Name = s.Name };
        }

        public async Task<SkillDto> UpdateAsync(int id, UpdateSkillDto dto)
        {
            var s = await _context.Skills.FindAsync(id);
            if (s == null)
                return null;
            s.Name = dto.Name;
            await _context.SaveChangesAsync();
            return new SkillDto { Id = s.Id, Name = s.Name };
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var s = await _context.Skills.FindAsync(id);
            if (s == null)
                return false;
            _context.Skills.Remove(s);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
