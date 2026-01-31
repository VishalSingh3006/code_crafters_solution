using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ResourceEngagementTrackingSystem.Application.DTOs.ResourceTracking.Staffing;
using ResourceEngagementTrackingSystem.Application.Interfaces.ResourceTracking;

namespace ResourceEngagementTrackingSystem.Api.Controllers.ResourceTracking
{
    [ApiController]
    [Route("api/resource-tracking/[controller]")]
    [Authorize]
    public class StaffingController : ControllerBase
    {
        private readonly IStaffingService _staffingService;

        public StaffingController(IStaffingService staffingService)
        {
            _staffingService = staffingService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllStaffingRecords()
        {
            var staffingRecords = await _staffingService.GetAllStaffingRecordsAsync();
            return Ok(staffingRecords);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetStaffingRecord(int id)
        {
            var staffingRecord = await _staffingService.GetStaffingRecordByIdAsync(id);
            if (staffingRecord == null)
                return NotFound();
            return Ok(staffingRecord);
        }

        [HttpPost]
        public async Task<IActionResult> CreateStaffingRecord(
            [FromBody] CreateStaffingRecordDto createStaffingRecordDto
        )
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var staffingRecord = await _staffingService.CreateStaffingRecordAsync(
                createStaffingRecordDto
            );
            return CreatedAtAction(
                nameof(GetStaffingRecord),
                new { id = staffingRecord.Id },
                staffingRecord
            );
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateStaffingRecord(
            int id,
            [FromBody] UpdateStaffingRecordDto updateStaffingRecordDto
        )
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var success = await _staffingService.UpdateStaffingRecordAsync(
                id,
                updateStaffingRecordDto
            );
            if (!success)
                return NotFound();

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteStaffingRecord(int id)
        {
            var success = await _staffingService.DeleteStaffingRecordAsync(id);
            if (!success)
                return NotFound();

            return NoContent();
        }
    }
}
