using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using ResourceEngagementTrackingSystem.Infrastructure.Models.ResourceTracking;
using ResourceEngagementTrackingSystem.Infrastructure.Models.ResourceTracking.Enums;

namespace ResourceEngagementTrackingSystem.Infrastructure.Repositories.ResourceTracking
{
    public class RecruitmentRecordRepository : IRecruitmentRecordRepository
    {
        private readonly ApplicationDbContext _context;

        public RecruitmentRecordRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<RecruitmentRecord>> GetAllAsync()
        {
            return await _context.RecruitmentRecords.ToListAsync();
        }

        public async Task<RecruitmentRecord?> GetByIdAsync(int id)
        {
            return await _context.RecruitmentRecords.FirstOrDefaultAsync(r => r.Id == id);
        }

        public async Task<RecruitmentRecord> AddAsync(RecruitmentRecord recruitmentRecord)
        {
            _context.RecruitmentRecords.Add(recruitmentRecord);
            await _context.SaveChangesAsync();
            return recruitmentRecord;
        }

        public async Task<bool> UpdateAsync(RecruitmentRecord recruitmentRecord)
        {
            try
            {
                _context.Entry(recruitmentRecord).State = EntityState.Modified;
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
                var recruitmentRecord = await _context.RecruitmentRecords.FindAsync(id);
                if (recruitmentRecord == null)
                    return false;

                _context.RecruitmentRecords.Remove(recruitmentRecord);
                await _context.SaveChangesAsync();
                return true;
            }
            catch
            {
                return false;
            }
        }

        public async Task<IEnumerable<RecruitmentRecord>> GetByPositionAsync(string position)
        {
            return await _context
                .RecruitmentRecords.Where(r => r.Position.Contains(position))
                .ToListAsync();
        }

        public async Task<IEnumerable<RecruitmentRecord>> GetByStatusAsync(string status)
        {
            if (Enum.TryParse<RecruitmentStatus>(status, true, out var statusEnum))
            {
                return await _context
                    .RecruitmentRecords.Where(r => r.Status == statusEnum)
                    .ToListAsync();
            }
            return await _context.RecruitmentRecords.Where(r => false).ToListAsync();
        }

        public async Task<IEnumerable<RecruitmentRecord>> GetActiveRecordsAsync()
        {
            return await _context
                .RecruitmentRecords.Where(r =>
                    r.Status == RecruitmentStatus.Open || r.Status == RecruitmentStatus.InProgress
                )
                .ToListAsync();
        }
    }
}
