namespace PortfolioDashboard.Models
{
    public class DashboardStats
    {
        public int TotalViews { get; set; }
        public int MessagesCount { get; set; }
        public int ProjectsCount { get; set; }
        public string AvgTimeOnSite { get; set; }
        public int ViewsChangePercent { get; set; }
        public int MessagesChangePercent { get; set; }
        public int ProjectsChangePercent { get; set; }
        public int TimeChangePercent { get; set; }
    }
}
