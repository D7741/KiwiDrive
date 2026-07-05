using Microsoft.EntityFrameworkCore;
using KiwiDrive.Models;
using KiwiDrive.Data.Seeders;

namespace KiwiDrive.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options)
            : base(options) { }

        public DbSet<User> Users => Set<User>();
        public DbSet<Question> Questions => Set<Question>();
        public DbSet<Category> Categories => Set<Category>();
        public DbSet<Achievement> Achievements => Set<Achievement>();
        public DbSet<UserAchievement> UserAchievements => Set<UserAchievement>();
        public DbSet<UserProgress> UserProgresses => Set<UserProgress>();

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // User unique indexes
            modelBuilder.Entity<User>()
                .HasIndex(u => u.Email)
                .IsUnique();
            modelBuilder.Entity<User>()
                .HasIndex(u => u.Username)
                .IsUnique();

            // Question → Category
            modelBuilder.Entity<Question>()
                .HasOne(q => q.Category)
                .WithMany(c => c.Questions)
                .HasForeignKey(q => q.CategoryId);

            // UserProgress → User & Category
            modelBuilder.Entity<UserProgress>()
                .HasOne(up => up.User)
                .WithMany(u => u.UserProgresses)
                .HasForeignKey(up => up.UserId);
            modelBuilder.Entity<UserProgress>()
                .HasOne(up => up.Category)
                .WithMany()
                .HasForeignKey(up => up.CategoryId);

            // UserAchievement → User & Achievement
            modelBuilder.Entity<UserAchievement>()
                .HasOne(ua => ua.User)
                .WithMany(u => u.UserAchievements)
                .HasForeignKey(ua => ua.UserId);
            modelBuilder.Entity<UserAchievement>()
                .HasOne(ua => ua.Achievement)
                .WithMany(a => a.UserAchievements)
                .HasForeignKey(ua => ua.AchievementId);

            // Seeders
            CategorySeeder.Seed(modelBuilder);
            AchievementSeeder.Seed(modelBuilder);
        }
    }
}