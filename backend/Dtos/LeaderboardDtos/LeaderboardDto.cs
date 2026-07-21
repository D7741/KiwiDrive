namespace KiwiDrive.Dtos.LeaderboardDtos
{
    public class LeaderboardEntryDto
    {
        public int Id { get; set; }
        public int Rank { get; set; }
        public string Username { get; set; } = string.Empty;
        public int XP { get; set; }
        public int Level { get; set; }
        public int Streak { get; set; }
    }
}