using System.Collections.Generic;
using System.Threading.Tasks;
using ResourceEngagementTrackingSystem.Infrastructure.Models.ResourceTracking;

namespace ResourceEngagementTrackingSystem.Infrastructure.Repositories.ResourceTracking
{
    public interface IRecruitmentRecordRepository
    {
        Task<IEnumerable<RecruitmentRecord>> GetAllAsync();
        Task<RecruitmentRecord?> GetByIdAsync(int id);
        Task<RecruitmentRecord> AddAsync(RecruitmentRecord recruitmentRecord);
        Task<bool> UpdateAsync(RecruitmentRecord recruitmentRecord);
        Task<bool> DeleteAsync(int id);
        Task<IEnumerable<RecruitmentRecord>> GetByPositionAsync(string position);
        Task<IEnumerable<RecruitmentRecord>> GetByStatusAsync(string status);
        Task<IEnumerable<RecruitmentRecord>> GetActiveRecordsAsync();
    }
}
