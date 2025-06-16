using System.ComponentModel.DataAnnotations;

namespace PortfolioDashboard.Dto.MessageDto
{
    public class MessageDto
    {
        [Required, MaxLength(100)]
        public string SenderName { get; set; }

        [Required, EmailAddress, MaxLength(100)]
        public string SenderEmail { get; set; }

        [Required, MaxLength(1000)]
        public string Content { get; set; }
    }
}
