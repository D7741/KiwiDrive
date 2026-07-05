using KiwiDrive.Models;
using Microsoft.EntityFrameworkCore;

namespace KiwiDrive.Data.Seeders;

public static class AchievementSeeder
{
    public static void Seed(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Achievement>().HasData(
            new Achievement { Id = 1, Name = "First Steps", Description = "Answer your first question", Icon = "🐣", XPRequired = 10 },
            new Achievement { Id = 2, Name = "Road Rookie", Description = "Reach 100 XP", Icon = "🚗", XPRequired = 100 },
            new Achievement { Id = 3, Name = "Street Smart", Description = "Reach 500 XP", Icon = "🏆", XPRequired = 500 },
            new Achievement { Id = 4, Name = "Road Master", Description = "Reach 1000 XP", Icon = "👑", XPRequired = 1000 },
            new Achievement { Id = 5, Name = "7 Day Streak", Description = "Maintain a 7 day streak", Icon = "🔥", XPRequired = 0 },
            new Achievement { Id = 6, Name = "Night Owl", Description = "Complete a night driving quiz", Icon = "🌙", XPRequired = 0 }
        );
    }
}