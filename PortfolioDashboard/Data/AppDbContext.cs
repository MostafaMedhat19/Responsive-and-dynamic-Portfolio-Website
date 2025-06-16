using Microsoft.EntityFrameworkCore;
using PortfolioDashboard.Models;

namespace PortfolioDashboard.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        public DbSet<Project> Projects { get; set; }
        public DbSet<Message> Messages { get; set; }
        public DbSet<Skill> Skills { get; set; }
        public DbSet<User> Users { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
           
            modelBuilder.Entity<Skill>().HasData(
                new Skill { Id = 1, Name = "HTML/CSS", Percentage = 90 },
                new Skill { Id = 2, Name = "JavaScript", Percentage = 80 },
                new Skill { Id = 3, Name = "UI/UX Design", Percentage = 85 },
                new Skill { Id = 4, Name = "React", Percentage = 75 },
                new Skill { Id = 5, Name = "Node.js", Percentage = 70 }
            );

            modelBuilder.Entity<Project>().HasData(
                new Project
                {
                    Id = 1,
                    Name = "E-commerce Website",
                    StartDate = new DateTime(2023, 1, 1),
                    Status = "Active",
                    Completion = 75
                },
                new Project
                {
                    Id = 2,
                    Name = "Portfolio Redesign",
                    StartDate = new DateTime(2023, 2, 15),
                    Status = "Planning",
                    Completion = 25
                }
            );

            
        }
    }
}