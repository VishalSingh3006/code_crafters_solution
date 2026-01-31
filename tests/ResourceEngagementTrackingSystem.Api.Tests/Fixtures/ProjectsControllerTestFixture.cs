using System;
using System.Collections.Generic;
using ResourceEngagementTrackingSystem.Application.DTOs;

namespace ResourceEngagementTrackingSystem.Api.Tests.Controllers
{
    public class ProjectsControllerTestFixture
    {
        public IEnumerable<ProjectDto> SampleProjects { get; }
        public ProjectDto SampleProject { get; }
        public ProjectDto SampleUpdatedProject { get; }
        public CreateProjectDto SampleCreateProjectDto { get; }
        public UpdateProjectDto SampleUpdateProjectDto { get; }

        public ProjectsControllerTestFixture()
        {
            SampleProject = new ProjectDto
            {
                Id = 1,
                Name = "Website Redesign",
                Description = "Complete redesign of company website with modern UI/UX",
                ClientId = 1
            };

            SampleUpdatedProject = new ProjectDto
            {
                Id = 1,
                Name = "Website Redesign Phase 2", // Updated name
                Description = "Enhanced website redesign with mobile optimization", // Updated description
                ClientId = 1
            };

            var project2 = new ProjectDto
            {
                Id = 2,
                Name = "Mobile App Development",
                Description = "Cross-platform mobile application for customer engagement",
                ClientId = 2
            };

            var project3 = new ProjectDto
            {
                Id = 3,
                Name = "Data Analytics Platform",
                Description = "Business intelligence dashboard with real-time analytics",
                ClientId = 3
            };

            SampleProjects = new List<ProjectDto> { SampleProject, project2, project3 };

            SampleCreateProjectDto = new CreateProjectDto
            {
                Name = "E-commerce Platform",
                Description = "Custom e-commerce solution with payment integration",
                ClientId = 1
            };

            SampleUpdateProjectDto = new UpdateProjectDto
            {
                Name = "Website Redesign Phase 2",
                Description = "Enhanced website redesign with mobile optimization",
                ClientId = 1
            };
        }
    }
}