using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ResourceEngagementTrackingSystem.Application.DTOs.ResourceTracking.Billing;
using ResourceEngagementTrackingSystem.Application.Interfaces.ResourceTracking;

namespace ResourceEngagementTrackingSystem.Api.Controllers.ResourceTracking.Billing
{
    [ApiController]
    [Route("api/resource-tracking/[controller]")]
    [Authorize]
    public class BillingController : ControllerBase
    {
        private readonly IBillingService _billingService;

        public BillingController(IBillingService billingService)
        {
            _billingService = billingService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllBillingRecords()
        {
            var billingRecords = await _billingService.GetAllBillingRecordsAsync();
            return Ok(billingRecords);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetBillingRecord(int id)
        {
            var billingRecord = await _billingService.GetBillingRecordByIdAsync(id);
            if (billingRecord == null)
                return NotFound();
            return Ok(billingRecord);
        }

        [HttpPost]
        public async Task<IActionResult> CreateBillingRecord(
            [FromBody] CreateBillingRecordDto createBillingRecordDto
        )
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var billingRecord = await _billingService.CreateBillingRecordAsync(
                createBillingRecordDto
            );
            return CreatedAtAction(
                nameof(GetBillingRecord),
                new { id = billingRecord.Id },
                billingRecord
            );
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateBillingRecord(
            int id,
            [FromBody] UpdateBillingRecordDto updateBillingRecordDto
        )
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var success = await _billingService.UpdateBillingRecordAsync(
                id,
                updateBillingRecordDto
            );
            if (!success)
                return NotFound();

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteBillingRecord(int id)
        {
            var success = await _billingService.DeleteBillingRecordAsync(id);
            if (!success)
                return NotFound();

            return NoContent();
        }

        [HttpGet("report/{month}/{year}")]
        public async Task<IActionResult> GetMonthlyBillingReport(int month, int year)
        {
            var report = await _billingService.GetMonthlyBillingReportAsync(month, year);
            return Ok(report);
        }
    }
}
