namespace PortfolioDashboard.Models
{
    public class Project
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public DateTime StartDate { get; set; }
        public string Status { get; set; } 
        public int Completion { get; set; }
    }
}
