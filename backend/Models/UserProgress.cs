namespace KiwiDrive.Models;

public class UserProgress
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public int CategoryId { get; set; }
    public int TotalAnswered { get; set; } = 0;
    public int TotalCorrect { get; set; } = 0;
    
    // Navigation properties
    public User User { get; set; } = null!;
    public Category Category { get; set; } = null!;
}