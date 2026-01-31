using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ResourceEngagementTrackingSystem.Application.DTOs.ResourceTracking.Recruitment;
using ResourceEngagementTrackingSystem.Application.Interfaces.ResourceTracking;

namespace ResourceEngagementTrackingSystem.Api.Controllers.ResourceTracking.Recruitment
{
    [ApiController]
    [Route("api/resource-tracking/[controller]")]
    [Authorize]
    public class RecruitmentController : ControllerBase
    {
        private readonly IRecruitmentService _recruitmentService;

        public RecruitmentController(IRecruitmentService recruitmentService)
        {
            _recruitmentService = recruitmentService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllRecruitmentRecords()
        {
            var recruitmentRecords = await _recruitmentService.GetAllRecruitmentRecordsAsync();
            return Ok(recruitmentRecords);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetRecruitmentRecord(int id)
        {
            var recruitmentRecord = await _recruitmentService.GetRecruitmentRecordByIdAsync(id);
            if (recruitmentRecord == null)
                return NotFound();
            return Ok(recruitmentRecord);
        }

        [HttpPost]
        public async Task<IActionResult> CreateRecruitmentRecord(
            [FromBody] CreateRecruitmentRecordDto createRecruitmentRecordDto
        )
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var recruitmentRecord = await _recruitmentService.CreateRecruitmentRecordAsync(
                createRecruitmentRecordDto
            );
            return CreatedAtAction(
                nameof(GetRecruitmentRecord),
                new { id = recruitmentRecord.Id },
                recruitmentRecord
            );
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateRecruitmentRecord(
            int id,
            [FromBody] UpdateRecruitmentRecordDto updateRecruitmentRecordDto
        )
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var success = await _recruitmentService.UpdateRecruitmentRecordAsync(
                id,
                updateRecruitmentRecordDto
            );
            if (!success)
                return NotFound();

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteRecruitmentRecord(int id)
        {
            var success = await _recruitmentService.DeleteRecruitmentRecordAsync(id);
            if (!success)
                return NotFound();

            return NoContent();
        }
    }
}
