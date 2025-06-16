using Microsoft.AspNetCore.Mvc;
using PortfolioDashboard.Models;
using PortfolioDashboard.Services;

namespace PortfolioDashboard.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;

        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginModel model)
        {
            var user = await _authService.Authenticate(model.Username, model.Password);

            if (user == null)
                return BadRequest(new { message = "Username or password is incorrect" });

            var token = _authService.GenerateJwtToken(user);

            return Ok(new
            {
                user.Id,
                user.Username,
                user.Email,
                user.FullName,
                Token = token
            });
        }
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] Signup userdto)
        {
            var user = new User
            {
                Username = userdto.Username,
                Password = userdto.Password,
                Email = userdto.Email,
                FullName = userdto.FullName
            };
            var newUser = await _authService.Register(user);
            if (newUser == null)
                return BadRequest("Username or email already exists.");

            var token = _authService.GenerateJwtToken(newUser);
            return Ok(new { token });
        }

    }

    public class Signup
    {
        public string Username { get; set; }
        public string Password { get; set; }
        public string Email { get; set; }
        public string FullName { get; set; }
    }

    public class LoginModel
    {
        public string Username { get; set; }
        public string Password { get; set; }
    }
}