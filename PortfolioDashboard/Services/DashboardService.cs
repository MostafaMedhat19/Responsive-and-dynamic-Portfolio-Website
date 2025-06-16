using Microsoft.EntityFrameworkCore;
using PortfolioDashboard.Data;
using PortfolioDashboard.Models;

namespace PortfolioDashboard.Services
{
    public class DashboardService : IDashboardService
    {
        private readonly AppDbContext _context;

        public DashboardService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<DashboardStats> GetDashboardStats()
        {
            // In a real app, you would calculate these from your database
            return new DashboardStats
            {
                TotalViews = 12345,
                MessagesCount = _context.Messages.Count(),
                ProjectsCount = _context.Projects.Count(),
                AvgTimeOnSite = "2m 45s",
                ViewsChangePercent = 12,
                MessagesChangePercent = 5,
                ProjectsChangePercent = 2,
                TimeChangePercent = -10
            };
        }

        public async Task<IEnumerable<Project>> GetRecentProjects()
        {
            return await _context.Projects
                .OrderByDescending(p => p.StartDate)
                .Take(5)
                .ToListAsync();
        }

        public async Task<IEnumerable<Message>> GetRecentMessages()
        {
            return await _context.Messages
                .OrderByDescending(m => m.SentDate)
                .Take(5)
                .ToListAsync();
        }

        public async Task<IEnumerable<Skill>> GetSkills()
        {
            return await _context.Skills.ToListAsync();
        }
    }
}