using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using ResourceEngagementTrackingSystem.Application.DTOs;
using ResourceEngagementTrackingSystem.Application.Interfaces;
using ResourceEngagementTrackingSystem.Infrastructure;
using ResourceEngagementTrackingSystem.Infrastructure.Models;

namespace ResourceEngagementTrackingSystem.Infrastructure.Services
{
    public class BillingRateService : IBillingRateService
    {
        private readonly ApplicationDbContext _context;
        private const decimal DEFAULT_EXCHANGE_RATE = 83.0m; // USD to INR

        public BillingRateService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<BillingRateDto>> GetAllAsync()
        {
            var rates = await _context.BillingRates
                .OrderBy(r => r.Role)
                .ThenBy(r => r.Level)
                .ToListAsync();

            return rates.Select(MapToDto);
        }

        public async Task<BillingRateDto> GetByIdAsync(int id)
        {
            var rate = await _context.BillingRates.FindAsync(id);
            return rate == null ? null : MapToDto(rate);
        }

        public async Task<IEnumerable<BillingRateDto>> GetByRoleAsync(string role)
        {
            var rates = await _context.BillingRates
                .Where(r => r.Role.ToLower() == role.ToLower())
                .OrderBy(r => r.Level)
                .ToListAsync();

            return rates.Select(MapToDto);
        }

        public async Task<IEnumerable<BillingRateDto>> GetByLevelAsync(string level)
        {
            var rates = await _context.BillingRates
                .Where(r => r.Level.ToLower() == level.ToLower())
                .OrderBy(r => r.Role)
                .ToListAsync();

            return rates.Select(MapToDto);
        }

        public async Task<IEnumerable<BillingRateDto>> GetByCurrencyAsync(string currency)
        {
            var rates = await _context.BillingRates
                .Where(r => r.Currency.ToUpper() == currency.ToUpper())
                .OrderBy(r => r.Role)
                .ThenBy(r => r.Level)
                .ToListAsync();

            return rates.Select(MapToDto);
        }

        public async Task<BillingRateDto> CreateAsync(CreateBillingRateDto dto)
        {
            var rate = new BillingRate
            {
                Role = dto.Role,
                Level = dto.Level,
                UsdRate = dto.UsdRate,
                InrRate = dto.InrRate,
                Currency = dto.Currency,
                EffectiveDate = dto.EffectiveDate,
                Description = dto.Description,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            _context.BillingRates.Add(rate);
            await _context.SaveChangesAsync();

            return MapToDto(rate);
        }

        public async Task<BillingRateDto> UpdateAsync(int id, UpdateBillingRateDto dto)
        {
            var rate = await _context.BillingRates.FindAsync(id);
            if (rate == null) return null;

            rate.Role = dto.Role;
            rate.Level = dto.Level;
            rate.UsdRate = dto.UsdRate;
            rate.InrRate = dto.InrRate;
            rate.Currency = dto.Currency;
            rate.EffectiveDate = dto.EffectiveDate;
            rate.Description = dto.Description;
            rate.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();
            return MapToDto(rate);
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var rate = await _context.BillingRates.FindAsync(id);
            if (rate == null) return false;

            _context.BillingRates.Remove(rate);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<RevenueCalculationDto> CalculateRevenueAsync(int id, decimal hours)
        {
            var rate = await _context.BillingRates.FindAsync(id);
            if (rate == null)
                throw new ArgumentException($"Billing rate with ID {id} not found");

            return new RevenueCalculationDto
            {
                BillingRateId = rate.Id,
                Role = rate.Role,
                Level = rate.Level,
                Hours = hours,
                UsdRevenue = rate.UsdRate * hours,
                InrRevenue = rate.InrRate * hours,
                PrimaryCurrency = rate.Currency,
                UsdRate = rate.UsdRate,
                InrRate = rate.InrRate
            };
        }

        public async Task<RevenueSummaryDto> GetRevenueSummaryAsync(decimal hours)
        {
            var rates = await _context.BillingRates.ToListAsync();
            var breakdown = new List<RevenueCalculationDto>();
            decimal totalUsdRevenue = 0;
            decimal totalInrRevenue = 0;

            foreach (var rate in rates)
            {
                var calculation = new RevenueCalculationDto
                {
                    BillingRateId = rate.Id,
                    Role = rate.Role,
                    Level = rate.Level,
                    Hours = hours,
                    UsdRevenue = rate.UsdRate * hours,
                    InrRevenue = rate.InrRate * hours,
                    PrimaryCurrency = rate.Currency,
                    UsdRate = rate.UsdRate,
                    InrRate = rate.InrRate
                };

                breakdown.Add(calculation);
                totalUsdRevenue += calculation.UsdRevenue;
                totalInrRevenue += calculation.InrRevenue;
            }

            return new RevenueSummaryDto
            {
                TotalUsdRevenue = totalUsdRevenue,
                TotalInrRevenue = totalInrRevenue,
                Hours = hours,
                CurrentExchangeRate = await GetCurrentExchangeRateAsync(),
                TotalRates = rates.Count,
                RateBreakdown = breakdown,
                CalculatedAt = DateTime.UtcNow
            };
        }

        public async Task<int> UpdateExchangeRateAsync(decimal exchangeRate)
        {
            // This is a simplified implementation
            // In a real scenario, you might want to store exchange rates in a separate table
            // For now, we'll update all rates proportionally
            var rates = await _context.BillingRates.ToListAsync();
            int updatedCount = 0;

            foreach (var rate in rates)
            {
                if (rate.Currency == "USD")
                {
                    rate.InrRate = rate.UsdRate * exchangeRate;
                }
                else if (rate.Currency == "INR")
                {
                    rate.UsdRate = rate.InrRate / exchangeRate;
                }
                rate.UpdatedAt = DateTime.UtcNow;
                updatedCount++;
            }

            await _context.SaveChangesAsync();
            return updatedCount;
        }

        public Task<decimal> GetCurrentExchangeRateAsync()
        {
            // In a real implementation, you might store this in a settings table
            // or fetch from an external API
            return Task.FromResult(DEFAULT_EXCHANGE_RATE);
        }

        private static BillingRateDto MapToDto(BillingRate rate)
        {
            return new BillingRateDto
            {
                Id = rate.Id,
                Role = rate.Role,
                Level = rate.Level,
                UsdRate = rate.UsdRate,
                InrRate = rate.InrRate,
                Currency = rate.Currency,
                EffectiveDate = rate.EffectiveDate,
                Description = rate.Description,
                CreatedAt = rate.CreatedAt,
                UpdatedAt = rate.UpdatedAt
            };
        }
    }
}
