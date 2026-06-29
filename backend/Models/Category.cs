namespace KiwiDrive.Models;

public class Category
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Icon { get; set; } = string.Empty;
    
    // Navigation properties
    public ICollection<Question> Questions { get; set; } = new List<Question>();
}