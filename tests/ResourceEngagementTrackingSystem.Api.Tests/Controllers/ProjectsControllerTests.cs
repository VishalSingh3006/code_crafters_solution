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
    public class ProjectsControllerTests : IClassFixture<ProjectsControllerTestFixture>
    {
        private readonly Mock<IProjectService> _mockProjectService;
        private readonly ProjectsController _controller;
        private readonly ProjectsControllerTestFixture _fixture;

        public ProjectsControllerTests(ProjectsControllerTestFixture fixture)
        {
            _fixture = fixture;
            _mockProjectService = new Mock<IProjectService>();
            _controller = new ProjectsController(_mockProjectService.Object);
        }

        #region GetAll Tests

        [Fact]
        public async Task GetAll_WhenProjectsExist_ReturnsOkWithProjects()
        {
            // Arrange
            _mockProjectService.Setup(x => x.GetAllAsync())
                .ReturnsAsync(_fixture.SampleProjects);

            // Act
            var result = await _controller.GetAll();

            // Assert
            result.Should().BeOfType<OkObjectResult>();
            var okResult = result as OkObjectResult;
            okResult!.Value.Should().BeEquivalentTo(_fixture.SampleProjects);
            _mockProjectService.Verify(x => x.GetAllAsync(), Times.Once);
        }

        [Fact]
        public async Task GetAll_WhenNoProjects_ReturnsOkWithEmptyList()
        {
            // Arrange
            _mockProjectService.Setup(x => x.GetAllAsync())
                .ReturnsAsync(new List<ProjectDto>());

            // Act
            var result = await _controller.GetAll();

            // Assert
            result.Should().BeOfType<OkObjectResult>();
            var okResult = result as OkObjectResult;
            okResult!.Value.Should().BeEquivalentTo(new List<ProjectDto>());
        }

        [Fact]
        public async Task GetAll_WhenServiceThrows_ShouldThrow()
        {
            // Arrange
            _mockProjectService.Setup(x => x.GetAllAsync())
                .ThrowsAsync(new Exception("Database error"));

            // Act & Assert
            await Assert.ThrowsAsync<Exception>(() => _controller.GetAll());
        }

        #endregion

        #region Get Tests

        [Fact]
        public async Task Get_WhenProjectExists_ReturnsOkWithProject()
        {
            // Arrange
            var projectId = 1;
            _mockProjectService.Setup(x => x.GetByIdAsync(projectId))
                .ReturnsAsync(_fixture.SampleProject);

            // Act
            var result = await _controller.Get(projectId);

            // Assert
            result.Should().BeOfType<OkObjectResult>();
            var okResult = result as OkObjectResult;
            okResult!.Value.Should().BeEquivalentTo(_fixture.SampleProject);
            _mockProjectService.Verify(x => x.GetByIdAsync(projectId), Times.Once);
        }

        [Fact]
        public async Task Get_WhenProjectNotFound_ReturnsNotFound()
        {
            // Arrange
            var projectId = 999;
            _mockProjectService.Setup(x => x.GetByIdAsync(projectId))
                .ReturnsAsync((ProjectDto)null);

            // Act
            var result = await _controller.Get(projectId);

            // Assert
            result.Should().BeOfType<NotFoundResult>();
        }

        [Fact]
        public async Task Get_WhenServiceThrows_ShouldThrow()
        {
            // Arrange
            var projectId = 1;
            _mockProjectService.Setup(x => x.GetByIdAsync(projectId))
                .ThrowsAsync(new Exception("Database error"));

            // Act & Assert
            await Assert.ThrowsAsync<Exception>(() => _controller.Get(projectId));
        }

        #endregion

        #region Create Tests

        [Fact]
        public async Task Create_WithValidData_ReturnsCreatedAtAction()
        {
            // Arrange
            var createDto = _fixture.SampleCreateProjectDto;
            var createdProject = new ProjectDto { Id = 4, Name = createDto.Name, Description = createDto.Description, ClientId = createDto.ClientId };
            _mockProjectService.Setup(x => x.CreateAsync(createDto))
                .ReturnsAsync(createdProject);

            // Act
            var result = await _controller.Create(createDto);

            // Assert
            result.Should().BeOfType<CreatedAtActionResult>();
            var createdResult = result as CreatedAtActionResult;
            createdResult!.ActionName.Should().Be(nameof(_controller.Get));
            createdResult.RouteValues!["id"].Should().Be(createdProject.Id);
            createdResult.Value.Should().BeEquivalentTo(createdProject);
            _mockProjectService.Verify(x => x.CreateAsync(createDto), Times.Once);
        }

        [Fact]
        public async Task Create_WhenServiceThrows_ShouldThrow()
        {
            // Arrange
            var createDto = _fixture.SampleCreateProjectDto;
            _mockProjectService.Setup(x => x.CreateAsync(createDto))
                .ThrowsAsync(new Exception("Database error"));

            // Act & Assert
            await Assert.ThrowsAsync<Exception>(() => _controller.Create(createDto));
        }

        #endregion

        #region Update Tests

        [Fact]
        public async Task Update_WhenProjectExists_ReturnsOkWithUpdatedProject()
        {
            // Arrange
            var projectId = 1;
            var updateDto = _fixture.SampleUpdateProjectDto;
            _mockProjectService.Setup(x => x.UpdateAsync(projectId, updateDto))
                .ReturnsAsync(_fixture.SampleUpdatedProject);

            // Act
            var result = await _controller.Update(projectId, updateDto);

            // Assert
            result.Should().BeOfType<OkObjectResult>();
            var okResult = result as OkObjectResult;
            okResult!.Value.Should().BeEquivalentTo(_fixture.SampleUpdatedProject);
            _mockProjectService.Verify(x => x.UpdateAsync(projectId, updateDto), Times.Once);
        }

        [Fact]
        public async Task Update_WhenProjectNotFound_ReturnsNotFound()
        {
            // Arrange
            var projectId = 999;
            var updateDto = _fixture.SampleUpdateProjectDto;
            _mockProjectService.Setup(x => x.UpdateAsync(projectId, updateDto))
                .ReturnsAsync((ProjectDto)null);

            // Act
            var result = await _controller.Update(projectId, updateDto);

            // Assert
            result.Should().BeOfType<NotFoundResult>();
        }

        [Fact]
        public async Task Update_WhenServiceThrows_ShouldThrow()
        {
            // Arrange
            var projectId = 1;
            var updateDto = _fixture.SampleUpdateProjectDto;
            _mockProjectService.Setup(x => x.UpdateAsync(projectId, updateDto))
                .ThrowsAsync(new Exception("Database error"));

            // Act & Assert
            await Assert.ThrowsAsync<Exception>(() => _controller.Update(projectId, updateDto));
        }

        #endregion

        #region Delete Tests

        [Fact]
        public async Task Delete_WhenProjectExists_ReturnsNoContent()
        {
            // Arrange
            var projectId = 1;
            _mockProjectService.Setup(x => x.DeleteAsync(projectId))
                .ReturnsAsync(true);

            // Act
            var result = await _controller.Delete(projectId);

            // Assert
            result.Should().BeOfType<NoContentResult>();
            _mockProjectService.Verify(x => x.DeleteAsync(projectId), Times.Once);
        }

        [Fact]
        public async Task Delete_WhenProjectNotFound_ReturnsNotFound()
        {
            // Arrange
            var projectId = 999;
            _mockProjectService.Setup(x => x.DeleteAsync(projectId))
                .ReturnsAsync(false);

            // Act
            var result = await _controller.Delete(projectId);

            // Assert
            result.Should().BeOfType<NotFoundResult>();
        }

        [Fact]
        public async Task Delete_WhenServiceThrows_ShouldThrow()
        {
            // Arrange
            var projectId = 1;
            _mockProjectService.Setup(x => x.DeleteAsync(projectId))
                .ThrowsAsync(new Exception("Database error"));

            // Act & Assert
            await Assert.ThrowsAsync<Exception>(() => _controller.Delete(projectId));
        }

        #endregion
    }
}