namespace ResourceEngagementTrackingSystem.Application.DTOs
{
    public class DesignationDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
    }

    public class CreateDesignationDto
    {
        public string Name { get; set; }
    }

    public class UpdateDesignationDto
    {
        public string Name { get; set; }
    }
}
