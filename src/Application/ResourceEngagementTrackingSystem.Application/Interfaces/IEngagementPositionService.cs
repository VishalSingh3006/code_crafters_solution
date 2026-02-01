using System.Collections.Generic;
using System.Threading.Tasks;
using ResourceEngagementTrackingSystem.Application.DTOs;

namespace ResourceEngagementTrackingSystem.Application.Interfaces
{
    public interface IEngagementPositionService
    {
        Task<IEnumerable<EngagementPositionDto>> GetAllAsync();
        Task<IEnumerable<EngagementPositionDto>> GetByEngagementIdAsync(int engagementId);
        Task<EngagementPositionDto?> GetByIdAsync(int id);
        Task<EngagementPositionDto> CreateAsync(CreateEngagementPositionDto dto);
        Task<EngagementPositionDto?> UpdateAsync(int id, UpdateEngagementPositionDto dto);
        Task<bool> DeleteAsync(int id);
    }
}