using PortfolioDashboard.Models;

namespace PortfolioDashboard.Services
{
    public interface IAuthService
    {
        Task<User> Authenticate(string username, string password);
        string GenerateJwtToken(User user);
        Task<User?> Register(User user);
    }
}
