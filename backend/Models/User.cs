using System.ComponentModel.DataAnnotations;

namespace KiwiDrive.Models;

public class User
{
    [Key]
    public int Id { get; set; }
    public string Username { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;
    public int XP { get; set; } = 0;
    public int Level { get; set; } = 1;
    public int Streak { get; set; } = 0;
    public DateTime LastLoginDate { get; set; } = DateTime.UtcNow;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    
    // Navigation properties
    public ICollection<UserProgress> UserProgresses { get; set; } = new List<UserProgress>();
    public ICollection<UserAchievement> UserAchievements { get; set; } = new List<UserAchievement>();
}