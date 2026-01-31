using ResourceEngagementTrackingSystem.Application.DTOs;
using System.Collections.Generic;

namespace ResourceEngagementTrackingSystem.Api.Tests.Fixtures
{
    public class DesignationsControllerTestFixture
    {
        public List<DesignationDto> SampleDesignations { get; }
        public CreateDesignationDto SampleCreateDesignationDto { get; }
        public UpdateDesignationDto SampleUpdateDesignationDto { get; }

        public DesignationsControllerTestFixture()
        {
            SampleDesignations = new List<DesignationDto>
            {
                new DesignationDto 
                { 
                    Id = 1, 
                    Name = "Software Engineer"
                },
                new DesignationDto 
                { 
                    Id = 2, 
                    Name = "Senior Software Engineer"
                },
                new DesignationDto 
                { 
                    Id = 3, 
                    Name = "Project Manager"
                }
            };

            SampleCreateDesignationDto = new CreateDesignationDto
            {
                Name = "DevOps Engineer"
            };

            SampleUpdateDesignationDto = new UpdateDesignationDto
            {
                Name = "Senior DevOps Engineer"
            };
        }
    }
}