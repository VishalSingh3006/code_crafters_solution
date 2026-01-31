using System.Collections.Generic;
using System.Threading.Tasks;
using ResourceEngagementTrackingSystem.Application.DTOs;

namespace ResourceEngagementTrackingSystem.Application.Interfaces
{
    public interface IBillingRateService
    {
        Task<IEnumerable<BillingRateDto>> GetAllAsync();
        Task<BillingRateDto> GetByIdAsync(int id);
        Task<IEnumerable<BillingRateDto>> GetByRoleAsync(string role);
        Task<IEnumerable<BillingRateDto>> GetByLevelAsync(string level);
        Task<IEnumerable<BillingRateDto>> GetByCurrencyAsync(string currency);
        Task<BillingRateDto> CreateAsync(CreateBillingRateDto dto);
        Task<BillingRateDto> UpdateAsync(int id, UpdateBillingRateDto dto);
        Task<bool> DeleteAsync(int id);
        Task<RevenueCalculationDto> CalculateRevenueAsync(int id, decimal hours);
        Task<RevenueSummaryDto> GetRevenueSummaryAsync(decimal hours);
        Task<int> UpdateExchangeRateAsync(decimal exchangeRate);
        Task<decimal> GetCurrentExchangeRateAsync();
    }
}
