using ResourceEngagementTrackingSystem.Application.DTOs.ResourceTracking.Recruitment;
using System;
using System.Collections.Generic;

namespace ResourceEngagementTrackingSystem.Api.Tests.Fixtures.ResourceTracking
{
    public class RecruitmentControllerTestFixture
    {
        public List<RecruitmentRecordDto> SampleRecruitmentRecords { get; }
        public CreateRecruitmentRecordDto SampleCreateRecruitmentRecordDto { get; }
        public UpdateRecruitmentRecordDto SampleUpdateRecruitmentRecordDto { get; }

        public RecruitmentControllerTestFixture()
        {
            SampleRecruitmentRecords = new List<RecruitmentRecordDto>
            {
                new RecruitmentRecordDto 
                { 
                    Id = 1,
                    Position = "Senior Software Engineer",
                    Department = "Engineering",
                    PostedDate = DateTime.Now.AddDays(-10),
                    ClosedDate = null,
                    RecruitmentType = "External",
                    JobDescription = "Develop and maintain web applications using .NET and React",
                    Requirements = "5+ years experience with C#, .NET, React, SQL",
                    NumberOfOpenings = 2,
                    Status = "Open",
                    Budget = 120000m,
                    CreatedAt = DateTime.Now.AddDays(-10),
                    UpdatedAt = DateTime.Now.AddDays(-2)
                },
                new RecruitmentRecordDto 
                { 
                    Id = 2,
                    Position = "DevOps Engineer",
                    Department = "Engineering",
                    PostedDate = DateTime.Now.AddDays(-20),
                    ClosedDate = DateTime.Now.AddDays(-5),
                    RecruitmentType = "External",
                    JobDescription = "Manage cloud infrastructure and deployment pipelines",
                    Requirements = "3+ years experience with AWS, Docker, Kubernetes, CI/CD",
                    NumberOfOpenings = 1,
                    Status = "Closed",
                    Budget = 100000m,
                    CreatedAt = DateTime.Now.AddDays(-20),
                    UpdatedAt = DateTime.Now.AddDays(-5)
                }
            };

            SampleCreateRecruitmentRecordDto = new CreateRecruitmentRecordDto
            {
                Position = "Frontend Developer",
                Department = "Engineering",
                PostedDate = DateTime.Now,
                RecruitmentType = "External",
                JobDescription = "Build responsive user interfaces for web applications",
                Requirements = "2+ years experience with React, TypeScript, CSS",
                NumberOfOpenings = 1,
                Status = "Open",
                Budget = 85000m
            };

            SampleUpdateRecruitmentRecordDto = new UpdateRecruitmentRecordDto
            {
                Position = "Senior Frontend Developer",
                Department = "Engineering",
                PostedDate = DateTime.Now.AddDays(-5),
                ClosedDate = null,
                RecruitmentType = "External",
                JobDescription = "Lead frontend development and mentor junior developers",
                Requirements = "4+ years experience with React, TypeScript, Next.js",
                NumberOfOpenings = 1,
                Status = "InProgress",
                Budget = 110000m
            };
        }
    }
}