namespace KiwiDrive.Dtos.DashboardDtos
{
    public class CategoryStatDto
    {
        public int CategoryId { get; set; }
        public string CategoryName { get; set; } = string.Empty;
        public int Progress { get; set; }
        public int Accuracy { get; set; }
        public int TotalQuestions { get; set; }
        public int AnsweredQuestions { get; set; }
    }
}
