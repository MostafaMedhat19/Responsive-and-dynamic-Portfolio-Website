using PortfolioDashboard.Models;

namespace PortfolioDashboard.Services
{
    public interface IDashboardService
    {
        Task<DashboardStats> GetDashboardStats();
        Task<IEnumerable<Project>> GetRecentProjects();
        Task<IEnumerable<Message>> GetRecentMessages();
        Task<IEnumerable<Skill>> GetSkills();
    }
}
