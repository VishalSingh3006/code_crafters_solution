using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ResourceEngagementTrackingSystem.Application.DTOs;
using ResourceEngagementTrackingSystem.Application.Interfaces;

namespace ResourceEngagementTrackingSystem.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class BillingRatesController : ControllerBase
    {
        private readonly IBillingRateService _service;

        public BillingRatesController(IBillingRateService service)
        {
            _service = service;
        }

        /// <summary>
        /// Get all billing rates
        /// </summary>
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var rates = await _service.GetAllAsync();
            return Ok(rates);
        }

        /// <summary>
        /// Get billing rate by ID
        /// </summary>
        [HttpGet("{id}")]
        public async Task<IActionResult> Get(int id)
        {
            var result = await _service.GetByIdAsync(id);
            if (result == null)
                return NotFound(new { message = "Billing rate not found" });
            return Ok(result);
        }

        /// <summary>
        /// Get billing rates by role
        /// </summary>
        [HttpGet("by-role/{role}")]
        public async Task<IActionResult> GetByRole(string role)
        {
            var rates = await _service.GetByRoleAsync(role);
            return Ok(rates);
        }

        /// <summary>
        /// Get billing rates by level
        /// </summary>
        [HttpGet("by-level/{level}")]
        public async Task<IActionResult> GetByLevel(string level)
        {
            var rates = await _service.GetByLevelAsync(level);
            return Ok(rates);
        }

        /// <summary>
        /// Get billing rates by currency
        /// </summary>
        [HttpGet("by-currency/{currency}")]
        public async Task<IActionResult> GetByCurrency(string currency)
        {
            if (currency.ToUpper() != "USD" && currency.ToUpper() != "INR")
                return BadRequest(new { message = "Currency must be USD or INR" });

            var rates = await _service.GetByCurrencyAsync(currency.ToUpper());
            return Ok(rates);
        }

        /// <summary>
        /// Create a new billing rate
        /// </summary>
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateBillingRateDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var created = await _service.CreateAsync(dto);
            return CreatedAtAction(nameof(Get), new { id = created.Id }, created);
        }

        /// <summary>
        /// Update an existing billing rate
        /// </summary>
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] UpdateBillingRateDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var updated = await _service.UpdateAsync(id, dto);
            if (updated == null)
                return NotFound(new { message = "Billing rate not found" });
            return Ok(updated);
        }

        /// <summary>
        /// Delete a billing rate
        /// </summary>
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var deleted = await _service.DeleteAsync(id);
            if (!deleted)
                return NotFound(new { message = "Billing rate not found" });
            return NoContent();
        }

        /// <summary>
        /// Calculate revenue for a billing rate
        /// </summary>
        [HttpPost("{id}/calculate-revenue")]
        public async Task<IActionResult> CalculateRevenue(int id, [FromBody] CalculateRevenueDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var rate = await _service.GetByIdAsync(id);
            if (rate == null)
                return NotFound(new { message = "Billing rate not found" });

            var revenue = await _service.CalculateRevenueAsync(id, dto.Hours);
            return Ok(revenue);
        }

        /// <summary>
        /// Get revenue summary for all billing rates
        /// </summary>
        [HttpGet("revenue-summary")]
        public async Task<IActionResult> GetRevenueSummary([FromQuery] int hours = 40)
        {
            var summary = await _service.GetRevenueSummaryAsync(hours);
            return Ok(summary);
        }

        /// <summary>
        /// Bulk update exchange rate for currency conversion
        /// </summary>
        [HttpPut("update-exchange-rate")]
        public async Task<IActionResult> UpdateExchangeRate([FromBody] UpdateExchangeRateDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var result = await _service.UpdateExchangeRateAsync(dto.ExchangeRate);
            return Ok(new { message = "Exchange rate updated successfully", affectedRates = result });
        }

        /// <summary>
        /// Get current exchange rate
        /// </summary>
        [HttpGet("exchange-rate")]
        public async Task<IActionResult> GetExchangeRate()
        {
            var exchangeRate = await _service.GetCurrentExchangeRateAsync();
            return Ok(new { exchangeRate });
        }
    }
}
