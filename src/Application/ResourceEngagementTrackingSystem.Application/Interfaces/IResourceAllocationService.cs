using System.Collections.Generic;
using System.Threading.Tasks;
using ResourceEngagementTrackingSystem.Application.DTOs;

namespace ResourceEngagementTrackingSystem.Application.Interfaces
{
    public interface IResourceAllocationService
    {
        Task<IEnumerable<ResourceAllocationDto>> GetAllAsync();
        Task<IEnumerable<ResourceAllocationDto>> GetByEngagementIdAsync(int engagementId);
        Task<IEnumerable<ResourceAllocationDto>> GetByEmployeeIdAsync(int employeeId);
        Task<ResourceAllocationDto?> GetByIdAsync(int id);
        Task<ResourceAllocationDto> CreateAsync(CreateResourceAllocationDto dto);
        Task<ResourceAllocationDto?> UpdateAsync(int id, UpdateResourceAllocationDto dto);
        Task<bool> DeleteAsync(int id);
    }
}