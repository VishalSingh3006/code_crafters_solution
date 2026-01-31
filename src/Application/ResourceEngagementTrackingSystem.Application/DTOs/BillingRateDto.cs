using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace ResourceEngagementTrackingSystem.Application.DTOs
{
    public class BillingRateDto
    {
        public int Id { get; set; }
        public string Role { get; set; } = string.Empty;
        public string Level { get; set; } = string.Empty;
        public decimal UsdRate { get; set; }
        public decimal InrRate { get; set; }
        public string Currency { get; set; } = string.Empty;
        public DateTime EffectiveDate { get; set; }
        public string Description { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }

    public class CreateBillingRateDto
    {
        [Required(ErrorMessage = "Role is required")]
        [StringLength(100, ErrorMessage = "Role cannot exceed 100 characters")]
        public string Role { get; set; } = string.Empty;

        [Required(ErrorMessage = "Level is required")]
        [StringLength(50, ErrorMessage = "Level cannot exceed 50 characters")]
        public string Level { get; set; } = string.Empty;

        [Required(ErrorMessage = "USD rate is required")]
        [Range(0.01, 10000, ErrorMessage = "USD rate must be between 0.01 and 10000")]
        public decimal UsdRate { get; set; }

        [Required(ErrorMessage = "INR rate is required")]
        [Range(0.01, 1000000, ErrorMessage = "INR rate must be between 0.01 and 1000000")]
        public decimal InrRate { get; set; }

        [Required(ErrorMessage = "Currency is required")]
        [RegularExpression("^(USD|INR)$", ErrorMessage = "Currency must be either USD or INR")]
        public string Currency { get; set; } = string.Empty;

        [Required(ErrorMessage = "Effective date is required")]
        public DateTime EffectiveDate { get; set; }

        [StringLength(500, ErrorMessage = "Description cannot exceed 500 characters")]
        public string Description { get; set; } = string.Empty;
    }

    public class UpdateBillingRateDto
    {
        [Required(ErrorMessage = "Role is required")]
        [StringLength(100, ErrorMessage = "Role cannot exceed 100 characters")]
        public string Role { get; set; } = string.Empty;

        [Required(ErrorMessage = "Level is required")]
        [StringLength(50, ErrorMessage = "Level cannot exceed 50 characters")]
        public string Level { get; set; } = string.Empty;

        [Required(ErrorMessage = "USD rate is required")]
        [Range(0.01, 10000, ErrorMessage = "USD rate must be between 0.01 and 10000")]
        public decimal UsdRate { get; set; }

        [Required(ErrorMessage = "INR rate is required")]
        [Range(0.01, 1000000, ErrorMessage = "INR rate must be between 0.01 and 1000000")]
        public decimal InrRate { get; set; }

        [Required(ErrorMessage = "Currency is required")]
        [RegularExpression("^(USD|INR)$", ErrorMessage = "Currency must be either USD or INR")]
        public string Currency { get; set; } = string.Empty;

        [Required(ErrorMessage = "Effective date is required")]
        public DateTime EffectiveDate { get; set; }

        [StringLength(500, ErrorMessage = "Description cannot exceed 500 characters")]
        public string Description { get; set; } = string.Empty;
    }

    public class CalculateRevenueDto
    {
        [Required(ErrorMessage = "Hours is required")]
        [Range(0.1, 744, ErrorMessage = "Hours must be between 0.1 and 744 (31 days * 24 hours)")]
        public decimal Hours { get; set; }
    }

    public class UpdateExchangeRateDto
    {
        [Required(ErrorMessage = "Exchange rate is required")]
        [Range(0.01, 1000, ErrorMessage = "Exchange rate must be between 0.01 and 1000")]
        public decimal ExchangeRate { get; set; }
    }

    public class RevenueCalculationDto
    {
        public int BillingRateId { get; set; }
        public string Role { get; set; } = string.Empty;
        public string Level { get; set; } = string.Empty;
        public decimal Hours { get; set; }
        public decimal UsdRevenue { get; set; }
        public decimal InrRevenue { get; set; }
        public string PrimaryCurrency { get; set; } = string.Empty;
        public decimal UsdRate { get; set; }
        public decimal InrRate { get; set; }
    }

    public class RevenueSummaryDto
    {
        public decimal TotalUsdRevenue { get; set; }
        public decimal TotalInrRevenue { get; set; }
        public decimal Hours { get; set; }
        public decimal CurrentExchangeRate { get; set; }
        public int TotalRates { get; set; }
        public List<RevenueCalculationDto> RateBreakdown { get; set; } = new();
        public DateTime CalculatedAt { get; set; }
    }
}
