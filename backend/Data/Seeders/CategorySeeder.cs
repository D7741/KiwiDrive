using KiwiDrive.Models;
using Microsoft.EntityFrameworkCore;

namespace KiwiDrive.Data.Seeders;

public static class CategorySeeder
{
    public static void Seed(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Category>().HasData(
            new Category { Id = 1, Name = "Road Signs", Icon = "🚦" },
            new Category { Id = 2, Name = "Speed Limits", Icon = "⚡" },
            new Category { Id = 3, Name = "Give Way Rules", Icon = "⛔" },
            new Category { Id = 4, Name = "Parking", Icon = "🅿️" },
            new Category { Id = 5, Name = "Alcohol & Drugs", Icon = "🍺" },
            new Category { Id = 6, Name = "Night Driving", Icon = "🌙" }
        );
    }
}