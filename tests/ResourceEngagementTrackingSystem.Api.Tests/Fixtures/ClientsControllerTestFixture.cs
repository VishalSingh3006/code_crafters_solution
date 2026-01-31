using System;
using System.Collections.Generic;
using ResourceEngagementTrackingSystem.Application.DTOs;

namespace ResourceEngagementTrackingSystem.Api.Tests.Controllers
{
    public class ClientsControllerTestFixture
    {
        public IEnumerable<ClientDto> SampleClients { get; }
        public ClientDto SampleClient { get; }
        public ClientDto SampleUpdatedClient { get; }
        public CreateClientDto SampleCreateClientDto { get; }
        public UpdateClientDto SampleUpdateClientDto { get; }

        public ClientsControllerTestFixture()
        {
            SampleClient = new ClientDto
            {
                Id = 1,
                Name = "ABC Corporation",
                Email = "contact@abc-corp.com",
                ContactName = "John Smith",
                ContactPhone = "555-1234"
            };

            SampleUpdatedClient = new ClientDto
            {
                Id = 1,
                Name = "ABC Corporation Ltd", // Updated name
                Email = "info@abc-corp.com", // Updated email
                ContactName = "John Smith",
                ContactPhone = "555-1234"
            };

            var client2 = new ClientDto
            {
                Id = 2,
                Name = "XYZ Solutions",
                Email = "hello@xyz-solutions.com",
                ContactName = "Sarah Johnson",
                ContactPhone = "555-5678"
            };

            var client3 = new ClientDto
            {
                Id = 3,
                Name = "Tech Innovations Inc",
                Email = "contact@techinnovations.com",
                ContactName = "Michael Brown",
                ContactPhone = "555-9999"
            };

            SampleClients = new List<ClientDto> { SampleClient, client2, client3 };

            SampleCreateClientDto = new CreateClientDto
            {
                Name = "New Client LLC",
                Email = "contact@newclient.com",
                ContactName = "Emily Davis",
                ContactPhone = "555-4321"
            };

            SampleUpdateClientDto = new UpdateClientDto
            {
                Name = "ABC Corporation Ltd",
                Email = "info@abc-corp.com",
                ContactName = "John Smith",
                ContactPhone = "555-1234"
            };
        }
    }
}