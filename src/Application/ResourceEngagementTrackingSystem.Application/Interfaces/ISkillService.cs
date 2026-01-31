using System.Collections.Generic;
using System.Threading.Tasks;
using ResourceEngagementTrackingSystem.Application.DTOs;

namespace ResourceEngagementTrackingSystem.Application.Interfaces
{
    public interface ISkillService
    {
        Task<IEnumerable<SkillDto>> GetAllAsync();
        Task<SkillDto> GetByIdAsync(int id);
        Task<SkillDto> CreateAsync(CreateSkillDto dto);
        Task<SkillDto> UpdateAsync(int id, UpdateSkillDto dto);
        Task<bool> DeleteAsync(int id);
    }
}
