using Microsoft.EntityFrameworkCore;

using System.Threading.Tasks;
using System.Collections.Generic;
using System.Linq;
using ResourceEngagementTrackingSystem.Application.DTOs;
using ResourceEngagementTrackingSystem.Application.Interfaces;
using ResourceEngagementTrackingSystem.Infrastructure.Models;

namespace ResourceEngagementTrackingSystem.Infrastructure.Services
{
    public class ClientService : IClientService
    {
        private readonly ApplicationDbContext _context;
        public ClientService(ApplicationDbContext context)
        {
            _context = context;
        }
        public async Task<IEnumerable<ClientDto>> GetAllAsync()
        {
            return await _context.Clients.Select(c => new ClientDto
            {
                Id = c.Id,
                Name = c.Name,
                Email = c.Email
            }).ToListAsync();
        }
        public async Task<ClientDto> GetByIdAsync(int id)
        {
            var c = await _context.Clients.FindAsync(id);
            if (c == null) return null;
            return new ClientDto { Id = c.Id, Name = c.Name, Email = c.Email };
        }
        public async Task<ClientDto> CreateAsync(CreateClientDto dto)
        {
            var c = new Client { Name = dto.Name, Email = dto.Email };
            _context.Clients.Add(c);
            await _context.SaveChangesAsync();
            return new ClientDto { Id = c.Id, Name = c.Name, Email = c.Email };
        }
        public async Task<ClientDto> UpdateAsync(int id, UpdateClientDto dto)
        {
            var c = await _context.Clients.FindAsync(id);
            if (c == null) return null;
            c.Name = dto.Name;
            c.Email = dto.Email;
            await _context.SaveChangesAsync();
            return new ClientDto { Id = c.Id, Name = c.Name, Email = c.Email };
        }
        public async Task<bool> DeleteAsync(int id)
        {
            var c = await _context.Clients.FindAsync(id);
            if (c == null) return false;
            _context.Clients.Remove(c);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}