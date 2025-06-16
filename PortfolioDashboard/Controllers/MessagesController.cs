// Controllers/MessagesController.cs
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PortfolioDashboard.Data;
using PortfolioDashboard.Dto.MessageDto;
using PortfolioDashboard.Models;

namespace PortfolioDashboard.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MessagesController : ControllerBase
    {
        private readonly AppDbContext _context;

        public MessagesController(AppDbContext context)
        {
            _context = context;
        }

     
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Message>>> GetMessages()
        {
            return await _context.Messages
                .OrderByDescending(m => m.SentDate)
                .ToListAsync();
        }

        [HttpPost]
        public async Task<ActionResult<Message>> PostMessage(MessageDto messageDto)
        {
            var message = new Message
            {
                SenderName = messageDto.SenderName,
                SenderEmail = messageDto.SenderEmail,
                Content = messageDto.Content,
                SentDate = DateTime.UtcNow
            };

            _context.Messages.Add(message);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetMessages", new { id = message.Id }, message);
        }

        
    }
}