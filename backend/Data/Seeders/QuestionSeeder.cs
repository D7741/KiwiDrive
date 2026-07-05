using System.Text.Json;
using KiwiDrive.Models;

namespace KiwiDrive.Data.Seeders;

public static class QuestionSeeder
{
    public static async Task SeedAsync(AppDbContext db)
    {
        // Skip if there is already having data
        if (db.Questions.Any()) return;

        var jsonPath = Path.Combine(AppContext.BaseDirectory, "Data", "Seeders", "questions.json");

        if (!File.Exists(jsonPath))
        {
            Console.WriteLine($"Questions.json not found at {jsonPath}");
            return;
        }

        var json = await File.ReadAllTextAsync(jsonPath);

        var options = new JsonSerializerOptions
        {
            PropertyNameCaseInsensitive = true
        };

        var questions = JsonSerializer.Deserialize<List<Question>>(json, options);

        if (questions == null || questions.Count == 0) return;

        await db.Questions.AddRangeAsync(questions);
        await db.SaveChangesAsync();

        Console.WriteLine($"Seeded {questions.Count} questions.");
    }
}