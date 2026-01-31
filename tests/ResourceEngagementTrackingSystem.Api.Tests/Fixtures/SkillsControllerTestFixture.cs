using System;
using System.Collections.Generic;
using ResourceEngagementTrackingSystem.Application.DTOs;

namespace ResourceEngagementTrackingSystem.Api.Tests.Controllers
{
    public class SkillsControllerTestFixture
    {
        public IEnumerable<SkillDto> SampleSkills { get; }
        public SkillDto SampleSkill { get; }
        public SkillDto SampleUpdatedSkill { get; }
        public CreateSkillDto SampleCreateSkillDto { get; }
        public UpdateSkillDto SampleUpdateSkillDto { get; }

        public SkillsControllerTestFixture()
        {
            SampleSkill = new SkillDto { Id = 1, Name = "C# Programming" };

            SampleUpdatedSkill = new SkillDto
            {
                Id = 1,
                Name = "Advanced C# Programming", // Updated name
            };

            var skill2 = new SkillDto { Id = 2, Name = "JavaScript Development" };

            var skill3 = new SkillDto { Id = 3, Name = "SQL Server Database" };

            SampleSkills = new List<SkillDto> { SampleSkill, skill2, skill3 };

            SampleCreateSkillDto = new CreateSkillDto { Name = "React Development" };

            SampleUpdateSkillDto = new UpdateSkillDto { Name = "Advanced C# Programming" };
        }
    }
}
