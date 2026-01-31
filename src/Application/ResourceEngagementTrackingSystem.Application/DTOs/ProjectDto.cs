namespace ResourceEngagementTrackingSystem.Application.DTOs
{
    public class ProjectDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public int ClientId { get; set; }
    }

    public class CreateProjectDto
    {
        public string Name { get; set; }
        public string Description { get; set; }
        public int ClientId { get; set; }
    }

    public class UpdateProjectDto
    {
        public string Name { get; set; }
        public string Description { get; set; }
        public int ClientId { get; set; }
    }
}
