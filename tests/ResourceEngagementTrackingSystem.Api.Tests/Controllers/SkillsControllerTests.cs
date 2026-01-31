using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using FluentAssertions;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using Moq;
using ResourceEngagementTrackingSystem.Api.Controllers;
using ResourceEngagementTrackingSystem.Application.DTOs;
using ResourceEngagementTrackingSystem.Application.Interfaces;
using Xunit;

namespace ResourceEngagementTrackingSystem.Api.Tests.Controllers
{
    public class SkillsControllerTests : IClassFixture<SkillsControllerTestFixture>
    {
        private readonly Mock<ISkillService> _mockSkillService;
        private readonly SkillsController _controller;
        private readonly SkillsControllerTestFixture _fixture;

        public SkillsControllerTests(SkillsControllerTestFixture fixture)
        {
            _fixture = fixture;
            _mockSkillService = new Mock<ISkillService>();
            _controller = new SkillsController(_mockSkillService.Object);
        }

        #region GetAll Tests

        [Fact]
        public async Task GetAll_WhenSkillsExist_ReturnsOkWithSkills()
        {
            // Arrange
            _mockSkillService.Setup(x => x.GetAllAsync()).ReturnsAsync(_fixture.SampleSkills);

            // Act
            var result = await _controller.GetAll();

            // Assert
            result.Should().BeOfType<OkObjectResult>();
            var okResult = result as OkObjectResult;
            okResult!.Value.Should().BeEquivalentTo(_fixture.SampleSkills);
            _mockSkillService.Verify(x => x.GetAllAsync(), Times.Once);
        }

        [Fact]
        public async Task GetAll_WhenNoSkills_ReturnsOkWithEmptyList()
        {
            // Arrange
            _mockSkillService.Setup(x => x.GetAllAsync()).ReturnsAsync(new List<SkillDto>());

            // Act
            var result = await _controller.GetAll();

            // Assert
            result.Should().BeOfType<OkObjectResult>();
            var okResult = result as OkObjectResult;
            okResult!.Value.Should().BeEquivalentTo(new List<SkillDto>());
        }

        [Fact]
        public async Task GetAll_WhenServiceThrows_ShouldThrow()
        {
            // Arrange
            _mockSkillService
                .Setup(x => x.GetAllAsync())
                .ThrowsAsync(new Exception("Database error"));

            // Act & Assert
            await Assert.ThrowsAsync<Exception>(() => _controller.GetAll());
        }

        #endregion

        #region Get Tests

        [Fact]
        public async Task Get_WhenSkillExists_ReturnsOkWithSkill()
        {
            // Arrange
            var skillId = 1;
            _mockSkillService
                .Setup(x => x.GetByIdAsync(skillId))
                .ReturnsAsync(_fixture.SampleSkill);

            // Act
            var result = await _controller.Get(skillId);

            // Assert
            result.Should().BeOfType<OkObjectResult>();
            var okResult = result as OkObjectResult;
            okResult!.Value.Should().BeEquivalentTo(_fixture.SampleSkill);
            _mockSkillService.Verify(x => x.GetByIdAsync(skillId), Times.Once);
        }

        [Fact]
        public async Task Get_WhenSkillNotFound_ReturnsNotFound()
        {
            // Arrange
            var skillId = 999;
            _mockSkillService.Setup(x => x.GetByIdAsync(skillId)).ReturnsAsync((SkillDto)null);

            // Act
            var result = await _controller.Get(skillId);

            // Assert
            result.Should().BeOfType<NotFoundResult>();
        }

        [Fact]
        public async Task Get_WhenServiceThrows_ShouldThrow()
        {
            // Arrange
            var skillId = 1;
            _mockSkillService
                .Setup(x => x.GetByIdAsync(skillId))
                .ThrowsAsync(new Exception("Database error"));

            // Act & Assert
            await Assert.ThrowsAsync<Exception>(() => _controller.Get(skillId));
        }

        #endregion

        #region Create Tests

        [Fact]
        public async Task Create_WithValidData_ReturnsCreatedAtAction()
        {
            // Arrange
            var createDto = _fixture.SampleCreateSkillDto;
            _mockSkillService
                .Setup(x => x.CreateAsync(createDto))
                .ReturnsAsync(_fixture.SampleSkill);

            // Act
            var result = await _controller.Create(createDto);

            // Assert
            result.Should().BeOfType<CreatedAtActionResult>();
            var createdResult = result as CreatedAtActionResult;
            createdResult!.ActionName.Should().Be(nameof(_controller.Get));
            createdResult.RouteValues!["id"].Should().Be(_fixture.SampleSkill.Id);
            createdResult.Value.Should().BeEquivalentTo(_fixture.SampleSkill);
            _mockSkillService.Verify(x => x.CreateAsync(createDto), Times.Once);
        }

        [Fact]
        public async Task Create_WhenServiceThrows_ShouldThrow()
        {
            // Arrange
            var createDto = _fixture.SampleCreateSkillDto;
            _mockSkillService
                .Setup(x => x.CreateAsync(createDto))
                .ThrowsAsync(new Exception("Database error"));

            // Act & Assert
            await Assert.ThrowsAsync<Exception>(() => _controller.Create(createDto));
        }

        #endregion

        #region Update Tests

        [Fact]
        public async Task Update_WhenSkillExists_ReturnsOkWithUpdatedSkill()
        {
            // Arrange
            var skillId = 1;
            var updateDto = _fixture.SampleUpdateSkillDto;
            _mockSkillService
                .Setup(x => x.UpdateAsync(skillId, updateDto))
                .ReturnsAsync(_fixture.SampleUpdatedSkill);

            // Act
            var result = await _controller.Update(skillId, updateDto);

            // Assert
            result.Should().BeOfType<OkObjectResult>();
            var okResult = result as OkObjectResult;
            okResult!.Value.Should().BeEquivalentTo(_fixture.SampleUpdatedSkill);
            _mockSkillService.Verify(x => x.UpdateAsync(skillId, updateDto), Times.Once);
        }

        [Fact]
        public async Task Update_WhenSkillNotFound_ReturnsNotFound()
        {
            // Arrange
            var skillId = 999;
            var updateDto = _fixture.SampleUpdateSkillDto;
            _mockSkillService
                .Setup(x => x.UpdateAsync(skillId, updateDto))
                .ReturnsAsync((SkillDto)null);

            // Act
            var result = await _controller.Update(skillId, updateDto);

            // Assert
            result.Should().BeOfType<NotFoundResult>();
        }

        [Fact]
        public async Task Update_WhenServiceThrows_ShouldThrow()
        {
            // Arrange
            var skillId = 1;
            var updateDto = _fixture.SampleUpdateSkillDto;
            _mockSkillService
                .Setup(x => x.UpdateAsync(skillId, updateDto))
                .ThrowsAsync(new Exception("Database error"));

            // Act & Assert
            await Assert.ThrowsAsync<Exception>(() => _controller.Update(skillId, updateDto));
        }

        #endregion

        #region Delete Tests

        [Fact]
        public async Task Delete_WhenSkillExists_ReturnsNoContent()
        {
            // Arrange
            var skillId = 1;
            _mockSkillService.Setup(x => x.DeleteAsync(skillId)).ReturnsAsync(true);

            // Act
            var result = await _controller.Delete(skillId);

            // Assert
            result.Should().BeOfType<NoContentResult>();
            _mockSkillService.Verify(x => x.DeleteAsync(skillId), Times.Once);
        }

        [Fact]
        public async Task Delete_WhenSkillNotFound_ReturnsNotFound()
        {
            // Arrange
            var skillId = 999;
            _mockSkillService.Setup(x => x.DeleteAsync(skillId)).ReturnsAsync(false);

            // Act
            var result = await _controller.Delete(skillId);

            // Assert
            result.Should().BeOfType<NotFoundResult>();
        }

        [Fact]
        public async Task Delete_WhenServiceThrows_ShouldThrow()
        {
            // Arrange
            var skillId = 1;
            _mockSkillService
                .Setup(x => x.DeleteAsync(skillId))
                .ThrowsAsync(new Exception("Database error"));

            // Act & Assert
            await Assert.ThrowsAsync<Exception>(() => _controller.Delete(skillId));
        }

        #endregion
    }
}
