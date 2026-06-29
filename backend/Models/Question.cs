using System.ComponentModel.DataAnnotations;

namespace KiwiDrive.Models;

public class Question
{
    [Key]
    public int Id { get; set; }
    public string Text { get; set; } = string.Empty;
    public string OptionA { get; set; } = string.Empty;
    public string OptionB { get; set; } = string.Empty;
    public string OptionC { get; set; } = string.Empty;
    public string OptionD { get; set; } = string.Empty;
    public string CorrectAnswer { get; set; } = string.Empty;
    public string Explanation { get; set; } = string.Empty;
    public int CategoryId { get; set; }
    
    // Navigation property
    public Category Category { get; set; } = null!;
}