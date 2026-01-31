using System;
using System.Threading.Tasks;
using FluentAssertions;
using Microsoft.AspNetCore.Mvc;
using Moq;
using ResourceEngagementTrackingSystem.Api.Controllers.ResourceTracking.Recruitment;
using ResourceEngagementTrackingSystem.Api.Tests.Fixtures.ResourceTracking;
using ResourceEngagementTrackingSystem.Application.DTOs.ResourceTracking.Recruitment;
using ResourceEngagementTrackingSystem.Application.Interfaces.ResourceTracking;
using Xunit;

namespace ResourceEngagementTrackingSystem.Api.Tests.Controllers.ResourceTracking
{
    public class RecruitmentControllerTests : IClassFixture<RecruitmentControllerTestFixture>
    {
        private readonly RecruitmentControllerTestFixture _fixture;
        private readonly Mock<IRecruitmentService> _mockRecruitmentService;
        private readonly RecruitmentController _controller;

        public RecruitmentControllerTests(RecruitmentControllerTestFixture fixture)
        {
            _fixture = fixture;
            _mockRecruitmentService = new Mock<IRecruitmentService>();
            _controller = new RecruitmentController(_mockRecruitmentService.Object);
        }

        #region GetAllRecruitmentRecords Tests

        [Fact]
        public async Task GetAllRecruitmentRecords_ReturnsOkWithRecords()
        {
            // Arrange
            _mockRecruitmentService
                .Setup(x => x.GetAllRecruitmentRecordsAsync())
                .ReturnsAsync(_fixture.SampleRecruitmentRecords);

            // Act
            var result = await _controller.GetAllRecruitmentRecords();

            // Assert
            result.Should().BeOfType<OkObjectResult>();
            var okResult = result as OkObjectResult;
            okResult!.Value.Should().BeEquivalentTo(_fixture.SampleRecruitmentRecords);
        }

        [Fact]
        public async Task GetAllRecruitmentRecords_WhenServiceThrows_ShouldThrow()
        {
            // Arrange
            _mockRecruitmentService
                .Setup(x => x.GetAllRecruitmentRecordsAsync())
                .ThrowsAsync(new Exception("Database error"));

            // Act & Assert
            await Assert.ThrowsAsync<Exception>(() => _controller.GetAllRecruitmentRecords());
        }

        #endregion

        #region GetRecruitmentRecord Tests

        [Fact]
        public async Task GetRecruitmentRecord_WhenRecordExists_ReturnsOkWithRecord()
        {
            // Arrange
            var recordId = 1;
            var expectedRecord = _fixture.SampleRecruitmentRecords[0];
            _mockRecruitmentService
                .Setup(x => x.GetRecruitmentRecordByIdAsync(recordId))
                .ReturnsAsync(expectedRecord);

            // Act
            var result = await _controller.GetRecruitmentRecord(recordId);

            // Assert
            result.Should().BeOfType<OkObjectResult>();
            var okResult = result as OkObjectResult;
            okResult!.Value.Should().BeEquivalentTo(expectedRecord);
        }

        [Fact]
        public async Task GetRecruitmentRecord_WhenRecordNotFound_ReturnsNotFound()
        {
            // Arrange
            var recordId = 999;
            _mockRecruitmentService
                .Setup(x => x.GetRecruitmentRecordByIdAsync(recordId))
                .ReturnsAsync((RecruitmentRecordDto)null!);

            // Act
            var result = await _controller.GetRecruitmentRecord(recordId);

            // Assert
            result.Should().BeOfType<NotFoundResult>();
        }

        [Fact]
        public async Task GetRecruitmentRecord_WhenServiceThrows_ShouldThrow()
        {
            // Arrange
            var recordId = 1;
            _mockRecruitmentService
                .Setup(x => x.GetRecruitmentRecordByIdAsync(recordId))
                .ThrowsAsync(new Exception("Database error"));

            // Act & Assert
            await Assert.ThrowsAsync<Exception>(() => _controller.GetRecruitmentRecord(recordId));
        }

        #endregion

        #region CreateRecruitmentRecord Tests

        [Fact]
        public async Task CreateRecruitmentRecord_WithValidData_ReturnsCreatedAtAction()
        {
            // Arrange
            var createDto = _fixture.SampleCreateRecruitmentRecordDto;
            var createdRecord = new RecruitmentRecordDto
            {
                Id = 3,
                Position = createDto.Position,
                Department = createDto.Department,
                PostedDate = createDto.PostedDate,
                ClosedDate = createDto.ClosedDate,
                RecruitmentType = createDto.RecruitmentType,
                JobDescription = createDto.JobDescription,
                Requirements = createDto.Requirements,
                NumberOfOpenings = createDto.NumberOfOpenings,
                Status = createDto.Status,
                Budget = createDto.Budget,
                CreatedAt = DateTime.Now,
                UpdatedAt = DateTime.Now,
            };

            _mockRecruitmentService
                .Setup(x => x.CreateRecruitmentRecordAsync(createDto))
                .ReturnsAsync(createdRecord);

            // Act
            var result = await _controller.CreateRecruitmentRecord(createDto);

            // Assert
            result.Should().BeOfType<CreatedAtActionResult>();
            var createdResult = result as CreatedAtActionResult;
            createdResult!.ActionName.Should().Be(nameof(_controller.GetRecruitmentRecord));
            createdResult.RouteValues!["id"].Should().Be(createdRecord.Id);
            createdResult.Value.Should().BeEquivalentTo(createdRecord);
            _mockRecruitmentService.Verify(
                x => x.CreateRecruitmentRecordAsync(createDto),
                Times.Once
            );
        }

        [Fact]
        public async Task CreateRecruitmentRecord_WithInvalidModelState_ReturnsBadRequest()
        {
            // Arrange
            _controller.ModelState.AddModelError("PositionTitle", "PositionTitle is required");
            var createDto = new CreateRecruitmentRecordDto();

            // Act
            var result = await _controller.CreateRecruitmentRecord(createDto);

            // Assert
            result.Should().BeOfType<BadRequestObjectResult>();
            var badRequestResult = result as BadRequestObjectResult;
            badRequestResult!.Value.Should().BeOfType<SerializableError>();

            _mockRecruitmentService.Verify(
                x => x.CreateRecruitmentRecordAsync(It.IsAny<CreateRecruitmentRecordDto>()),
                Times.Never
            );
        }

        [Fact]
        public async Task CreateRecruitmentRecord_WhenServiceThrows_ShouldThrow()
        {
            // Arrange
            var createDto = _fixture.SampleCreateRecruitmentRecordDto;
            _mockRecruitmentService
                .Setup(x => x.CreateRecruitmentRecordAsync(createDto))
                .ThrowsAsync(new Exception("Database error"));

            // Act & Assert
            await Assert.ThrowsAsync<Exception>(() =>
                _controller.CreateRecruitmentRecord(createDto)
            );
        }

        #endregion

        #region UpdateRecruitmentRecord Tests

        [Fact]
        public async Task UpdateRecruitmentRecord_WhenRecordExists_ReturnsNoContent()
        {
            // Arrange
            var recordId = 1;
            var updateDto = _fixture.SampleUpdateRecruitmentRecordDto;
            _mockRecruitmentService
                .Setup(x => x.UpdateRecruitmentRecordAsync(recordId, updateDto))
                .ReturnsAsync(true);

            // Act
            var result = await _controller.UpdateRecruitmentRecord(recordId, updateDto);

            // Assert
            result.Should().BeOfType<NoContentResult>();
            _mockRecruitmentService.Verify(
                x => x.UpdateRecruitmentRecordAsync(recordId, updateDto),
                Times.Once
            );
        }

        [Fact]
        public async Task UpdateRecruitmentRecord_WhenRecordNotFound_ReturnsNotFound()
        {
            // Arrange
            var recordId = 999;
            var updateDto = _fixture.SampleUpdateRecruitmentRecordDto;
            _mockRecruitmentService
                .Setup(x => x.UpdateRecruitmentRecordAsync(recordId, updateDto))
                .ReturnsAsync(false);

            // Act
            var result = await _controller.UpdateRecruitmentRecord(recordId, updateDto);

            // Assert
            result.Should().BeOfType<NotFoundResult>();
        }

        [Fact]
        public async Task UpdateRecruitmentRecord_WithInvalidModelState_ReturnsBadRequest()
        {
            // Arrange
            var recordId = 1;
            _controller.ModelState.AddModelError("PositionTitle", "PositionTitle is required");
            var updateDto = new UpdateRecruitmentRecordDto();

            // Act
            var result = await _controller.UpdateRecruitmentRecord(recordId, updateDto);

            // Assert
            result.Should().BeOfType<BadRequestObjectResult>();
            var badRequestResult = result as BadRequestObjectResult;
            badRequestResult!.Value.Should().BeOfType<SerializableError>();

            _mockRecruitmentService.Verify(
                x =>
                    x.UpdateRecruitmentRecordAsync(
                        It.IsAny<int>(),
                        It.IsAny<UpdateRecruitmentRecordDto>()
                    ),
                Times.Never
            );
        }

        [Fact]
        public async Task UpdateRecruitmentRecord_WhenServiceThrows_ShouldThrow()
        {
            // Arrange
            var recordId = 1;
            var updateDto = _fixture.SampleUpdateRecruitmentRecordDto;
            _mockRecruitmentService
                .Setup(x => x.UpdateRecruitmentRecordAsync(recordId, updateDto))
                .ThrowsAsync(new Exception("Database error"));

            // Act & Assert
            await Assert.ThrowsAsync<Exception>(() =>
                _controller.UpdateRecruitmentRecord(recordId, updateDto)
            );
        }

        #endregion

        #region DeleteRecruitmentRecord Tests

        [Fact]
        public async Task DeleteRecruitmentRecord_WhenRecordExists_ReturnsNoContent()
        {
            // Arrange
            var recordId = 1;
            _mockRecruitmentService
                .Setup(x => x.DeleteRecruitmentRecordAsync(recordId))
                .ReturnsAsync(true);

            // Act
            var result = await _controller.DeleteRecruitmentRecord(recordId);

            // Assert
            result.Should().BeOfType<NoContentResult>();
        }

        [Fact]
        public async Task DeleteRecruitmentRecord_WhenRecordNotFound_ReturnsNotFound()
        {
            // Arrange
            var recordId = 999;
            _mockRecruitmentService
                .Setup(x => x.DeleteRecruitmentRecordAsync(recordId))
                .ReturnsAsync(false);

            // Act
            var result = await _controller.DeleteRecruitmentRecord(recordId);

            // Assert
            result.Should().BeOfType<NotFoundResult>();
        }

        [Fact]
        public async Task DeleteRecruitmentRecord_WhenServiceThrows_ShouldThrow()
        {
            // Arrange
            var recordId = 1;
            _mockRecruitmentService
                .Setup(x => x.DeleteRecruitmentRecordAsync(recordId))
                .ThrowsAsync(new Exception("Database error"));

            // Act & Assert
            await Assert.ThrowsAsync<Exception>(() =>
                _controller.DeleteRecruitmentRecord(recordId)
            );
        }

        #endregion
    }
}
