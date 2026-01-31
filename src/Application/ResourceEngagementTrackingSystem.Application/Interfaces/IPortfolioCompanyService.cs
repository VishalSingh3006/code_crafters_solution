using ResourceEngagementTrackingSystem.Application.DTOs;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ResourceEngagementTrackingSystem.Application.Interfaces
{
    public interface IPortfolioCompanyService
    {
        Task<IEnumerable<PortfolioCompanyDto>> GetAllAsync();
        Task<PortfolioCompanyDto?> GetByIdAsync(int id);
        Task<PortfolioCompanyDto> CreateAsync(CreatePortfolioCompanyDto dto);
        Task<PortfolioCompanyDto?> UpdateAsync(int id, UpdatePortfolioCompanyDto dto);
        Task<bool> DeleteAsync(int id);
    }
}