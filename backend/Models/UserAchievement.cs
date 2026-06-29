using System.ComponentModel.DataAnnotations;

namespace KiwiDrive.Models;

public class UserAchievement
{
    [Key]
    public int Id { get; set; }
    public int UserId { get; set; }
    public int AchievementId { get; set; }
    public DateTime EarnedAt { get; set; } = DateTime.UtcNow;
    
    // Navigation properties
    public User User { get; set; } = null!;
    public Achievement Achievement { get; set; } = null!;
}