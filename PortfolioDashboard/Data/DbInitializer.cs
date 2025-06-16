using PortfolioDashboard.Models;

namespace PortfolioDashboard.Data
{
    public static class DbInitializer
    {
        public static void Initialize(AppDbContext context)
        {
            context.Database.EnsureCreated();

            if (context.Projects.Any() || context.Messages.Any() || context.Skills.Any() || context.Users.Any())
            {
                return; 
            }

            
            var messages = new Message[]
            {
                new Message
                {
                    SenderName = "John Doe",
                    SenderEmail = "john@example.com",
                    Content = "Hi, I saw your portfolio and I'm interested in working with you on a new project...",
                    SentDate = DateTime.Now.AddHours(-2),
                    IsRead = false
                },
                new Message
                {
                    SenderName = "Jane Smith",
                    SenderEmail = "jane@example.com",
                    Content = "Your design skills are impressive! Can you share more about your process?",
                    SentDate = DateTime.Now.AddDays(-1),
                    IsRead = true
                }
            };

            context.Messages.AddRange(messages);
            context.SaveChanges();
        }
    }
}