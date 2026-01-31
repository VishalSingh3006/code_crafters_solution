using Microsoft.AspNetCore.Mvc;
using Moq;
using ResourceEngagementTrackingSystem.Api.Controllers;
using ResourceEngagementTrackingSystem.Api.Tests.Fixtures;
using ResourceEngagementTrackingSystem.Application.DTOs;
using ResourceEngagementTrackingSystem.Application.Interfaces;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Xunit;
using FluentAssertions;

namespace ResourceEngagementTrackingSystem.Api.Tests.Controllers
{
    public class DesignationsControllerTests : IClassFixture<DesignationsControllerTestFixture>
    {
        private readonly DesignationsControllerTestFixture _fixture;
        private readonly Mock<IDesignationService> _mockDesignationService;
        private readonly DesignationsController _controller;

        public DesignationsControllerTests(DesignationsControllerTestFixture fixture)
        {
            _fixture = fixture;
            _mockDesignationService = new Mock<IDesignationService>();
            _controller = new DesignationsController(_mockDesignationService.Object);
        }

        #region GetAll Tests

        [Fact]
        public async Task GetAll_ReturnsOkWithDesignations()
        {
            // Arrange
            _mockDesignationService.Setup(x => x.GetAllAsync())
                .ReturnsAsync(_fixture.SampleDesignations);

            // Act
            var result = await _controller.GetAll();

            // Assert
            result.Should().BeOfType<OkObjectResult>();
            var okResult = result as OkObjectResult;
            okResult!.Value.Should().BeEquivalentTo(_fixture.SampleDesignations);
        }

        [Fact]
        public async Task GetAll_WhenServiceThrows_ShouldThrow()
        {
            // Arrange
            _mockDesignationService.Setup(x => x.GetAllAsync())
                .ThrowsAsync(new Exception("Database error"));

            // Act & Assert
            await Assert.ThrowsAsync<Exception>(() => _controller.GetAll());
        }

        #endregion

        #region Get Tests

        [Fact]
        public async Task Get_WhenDesignationExists_ReturnsOkWithDesignation()
        {
            // Arrange
            var designationId = 1;
            var expectedDesignation = _fixture.SampleDesignations[0];
            _mockDesignationService.Setup(x => x.GetByIdAsync(designationId))
                .ReturnsAsync(expectedDesignation);

            // Act
            var result = await _controller.Get(designationId);

            // Assert
            result.Should().BeOfType<OkObjectResult>();
            var okResult = result as OkObjectResult;
            okResult!.Value.Should().BeEquivalentTo(expectedDesignation);
        }

        [Fact]
        public async Task Get_WhenDesignationNotFound_ReturnsNotFound()
        {
            // Arrange
            var designationId = 999;
            _mockDesignationService.Setup(x => x.GetByIdAsync(designationId))
                .ReturnsAsync((DesignationDto)null!);

            // Act
            var result = await _controller.Get(designationId);

            // Assert
            result.Should().BeOfType<NotFoundResult>();
        }

        [Fact]
        public async Task Get_WhenServiceThrows_ShouldThrow()
        {
            // Arrange
            var designationId = 1;
            _mockDesignationService.Setup(x => x.GetByIdAsync(designationId))
                .ThrowsAsync(new Exception("Database error"));

            // Act & Assert
            await Assert.ThrowsAsync<Exception>(() => _controller.Get(designationId));
        }

        #endregion

        #region Create Tests

        [Fact]
        public async Task Create_WithValidData_ReturnsCreatedAtAction()
        {
            // Arrange
            var createDto = _fixture.SampleCreateDesignationDto;
            var createdDesignation = new DesignationDto 
            { 
                Id = 4, 
                Name = createDto.Name
            };
            
            _mockDesignationService.Setup(x => x.CreateAsync(createDto))
                .ReturnsAsync(createdDesignation);

            // Act
            var result = await _controller.Create(createDto);

            // Assert
            result.Should().BeOfType<CreatedAtActionResult>();
            var createdResult = result as CreatedAtActionResult;
            createdResult!.ActionName.Should().Be(nameof(_controller.Get));
            createdResult.RouteValues!["id"].Should().Be(createdDesignation.Id);
            createdResult.Value.Should().BeEquivalentTo(createdDesignation);
        }

        [Fact]
        public async Task Create_WhenServiceThrows_ShouldThrow()
        {
            // Arrange
            var createDto = _fixture.SampleCreateDesignationDto;
            _mockDesignationService.Setup(x => x.CreateAsync(createDto))
                .ThrowsAsync(new Exception("Database error"));

            // Act & Assert
            await Assert.ThrowsAsync<Exception>(() => _controller.Create(createDto));
        }

        #endregion

        #region Update Tests

        [Fact]
        public async Task Update_WhenDesignationExists_ReturnsOkWithUpdatedDesignation()
        {
            // Arrange
            var designationId = 1;
            var updateDto = _fixture.SampleUpdateDesignationDto;
            var updatedDesignation = new DesignationDto 
            { 
                Id = designationId, 
                Name = updateDto.Name
            };
            
            _mockDesignationService.Setup(x => x.UpdateAsync(designationId, updateDto))
                .ReturnsAsync(updatedDesignation);

            // Act
            var result = await _controller.Update(designationId, updateDto);

            // Assert
            result.Should().BeOfType<OkObjectResult>();
            var okResult = result as OkObjectResult;
            okResult!.Value.Should().BeEquivalentTo(updatedDesignation);
        }

        [Fact]
        public async Task Update_WhenDesignationNotFound_ReturnsNotFound()
        {
            // Arrange
            var designationId = 999;
            var updateDto = _fixture.SampleUpdateDesignationDto;
            _mockDesignationService.Setup(x => x.UpdateAsync(designationId, updateDto))
                .ReturnsAsync((DesignationDto)null!);

            // Act
            var result = await _controller.Update(designationId, updateDto);

            // Assert
            result.Should().BeOfType<NotFoundResult>();
        }

        [Fact]
        public async Task Update_WhenServiceThrows_ShouldThrow()
        {
            // Arrange
            var designationId = 1;
            var updateDto = _fixture.SampleUpdateDesignationDto;
            _mockDesignationService.Setup(x => x.UpdateAsync(designationId, updateDto))
                .ThrowsAsync(new Exception("Database error"));

            // Act & Assert
            await Assert.ThrowsAsync<Exception>(() => _controller.Update(designationId, updateDto));
        }

        #endregion

        #region Delete Tests

        [Fact]
        public async Task Delete_WhenDesignationExists_ReturnsNoContent()
        {
            // Arrange
            var designationId = 1;
            _mockDesignationService.Setup(x => x.DeleteAsync(designationId))
                .ReturnsAsync(true);

            // Act
            var result = await _controller.Delete(designationId);

            // Assert
            result.Should().BeOfType<NoContentResult>();
        }

        [Fact]
        public async Task Delete_WhenDesignationNotFound_ReturnsNotFound()
        {
            // Arrange
            var designationId = 999;
            _mockDesignationService.Setup(x => x.DeleteAsync(designationId))
                .ReturnsAsync(false);

            // Act
            var result = await _controller.Delete(designationId);

            // Assert
            result.Should().BeOfType<NotFoundResult>();
        }

        [Fact]
        public async Task Delete_WhenServiceThrows_ShouldThrow()
        {
            // Arrange
            var designationId = 1;
            _mockDesignationService.Setup(x => x.DeleteAsync(designationId))
                .ThrowsAsync(new Exception("Database error"));

            // Act & Assert
            await Assert.ThrowsAsync<Exception>(() => _controller.Delete(designationId));
        }

        #endregion
    }
}