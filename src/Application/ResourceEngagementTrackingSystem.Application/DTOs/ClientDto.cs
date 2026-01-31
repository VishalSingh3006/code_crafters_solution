namespace ResourceEngagementTrackingSystem.Application.DTOs
{
    public class ClientDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
    }

    public class CreateClientDto
    {
        public string Name { get; set; }
        public string Email { get; set; }
    }

    public class UpdateClientDto
    {
        public string Name { get; set; }
        public string Email { get; set; }
    }
}
