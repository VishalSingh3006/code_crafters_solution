using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ResourceEngagementTrackingSystem.Application.DTOs.ResourceTracking.Delivery;
using ResourceEngagementTrackingSystem.Application.Interfaces.ResourceTracking;

namespace ResourceEngagementTrackingSystem.Api.Controllers.ResourceTracking.Delivery
{
    [ApiController]
    [Route("api/resource-tracking/[controller]")]
    [Authorize]
    public class DeliveryController : ControllerBase
    {
        private readonly IDeliveryService _deliveryService;

        public DeliveryController(IDeliveryService deliveryService)
        {
            _deliveryService = deliveryService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllDeliveries()
        {
            var deliveries = await _deliveryService.GetAllDeliveriesAsync();
            return Ok(deliveries);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetDelivery(int id)
        {
            var delivery = await _deliveryService.GetDeliveryByIdAsync(id);
            if (delivery == null)
                return NotFound();
            return Ok(delivery);
        }

        [HttpPost]
        public async Task<IActionResult> CreateDelivery([FromBody] CreateDeliveryDto createDeliveryDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            try
            {
                var delivery = await _deliveryService.CreateDeliveryAsync(createDeliveryDto);
                return CreatedAtAction(nameof(GetDelivery), new { id = delivery.Id }, delivery);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateDelivery(int id, [FromBody] UpdateDeliveryDto updateDeliveryDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var success = await _deliveryService.UpdateDeliveryAsync(id, updateDeliveryDto);
            if (!success)
                return NotFound();

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteDelivery(int id)
        {
            var success = await _deliveryService.DeleteDeliveryAsync(id);
            if (!success)
                return NotFound();

            return NoContent();
        }
    }
}