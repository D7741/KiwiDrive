namespace KiwiDrive.Models;

public class Achievement
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Icon { get; set; } = string.Empty;
    public int XPRequired { get; set; } = 0;
    
    // Navigation property
    public ICollection<UserAchievement> UserAchievements { get; set; } = new List<UserAchievement>();
}