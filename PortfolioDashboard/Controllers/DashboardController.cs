using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PortfolioDashboard.Models;
using PortfolioDashboard.Services;

namespace PortfolioDashboard.Controllers
{
   
    [ApiController]
    [Route("api/[controller]")]
    public class DashboardController : ControllerBase
    {
        private readonly IDashboardService _dashboardService;

        public DashboardController(IDashboardService dashboardService)
        {
            _dashboardService = dashboardService;
        }

        [HttpGet("stats")]
        public async Task<ActionResult<DashboardStats>> GetStats()
        {
            var stats = await _dashboardService.GetDashboardStats();
            return Ok(stats);
        }

        [HttpGet("projects")]
        public async Task<ActionResult<IEnumerable<Project>>> GetProjects()
        {
            var projects = await _dashboardService.GetRecentProjects();
            return Ok(projects);
        }

        [HttpGet("messages")]
        public async Task<ActionResult<IEnumerable<Message>>> GetMessages()
        {
            var messages = await _dashboardService.GetRecentMessages();
            return Ok(messages);
        }

        [HttpGet("skills")]
        public async Task<ActionResult<IEnumerable<Skill>>> GetSkills()
        {
            var skills = await _dashboardService.GetSkills();
            return Ok(skills);
        }
    }
}