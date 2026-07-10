using KiwiDrive.Data;
using KiwiDrive.Models;
using KiwiDrive.Repository.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace KiwiDrive.Repository.Implementations
{
    public class AchievementRepository: IAchievementRepository
    {
        private readonly AppDbContext _context;

        public AchievementRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<Achievement> CreateAchievementAsync(Achievement achievement)
        {
            if (achievement == null)
                throw new ArgumentNullException(nameof(achievement), "Achievement cannot be null.");
            

            var existingAchievement = await _context.Achievements.FirstOrDefaultAsync(a => a.Name == achievement.Name);

            if (existingAchievement != null)
                throw new InvalidOperationException($"A Achievement with the name '{achievement.Name}' already exists.");
            
            await _context.AddAsync(achievement);
            await _context.SaveChangesAsync();
            return achievement;
        }

        public async Task<Achievement?> GetAchievementByIdAsync(int id)
        {
            if (id <= 0)
                throw new ArgumentException($"Achievement ID '{id}' is invalid.", nameof(id));
            
            return await _context.Achievements.FindAsync(id);
        }

        public async Task<Achievement?> GetAchievementByNameAsync(string name)
        {
            if (string.IsNullOrEmpty(name))
                throw new ArgumentNullException(nameof(name), "Name cannot be null.");
            
            return await _context.Achievements
                .FirstOrDefaultAsync(a => a.Name == name);
        }

        public async Task<List<Achievement>> GetAllAchievementsAsync()
        {
            return await _context.Achievements.ToListAsync();
        }

        public async Task<bool> HasUserAchievementAsync(int userId, int achievementId)
        {
            if (userId <= 0)
                throw new ArgumentException($"User ID '{userId}' is invalid.", nameof(userId));
            
            if (achievementId <= 0)
                throw new ArgumentException($"Achievement ID '{achievementId}' is invalid.", nameof(achievementId));

            return await _context.UserAchievements
                .AnyAsync(ua => ua.UserId == userId && ua.AchievementId == achievementId);
        }

        public async Task UnlockAchievementAsync(int userId, int achievementId)
        {
            if (userId <= 0)
                throw new ArgumentException($"User ID '{userId}' is invalid.", nameof(userId));
            
            if (achievementId <= 0)
                throw new ArgumentException($"Achievement ID '{achievementId}' is invalid.", nameof(achievementId));
            
            var existingUnlock = await _context.UserAchievements
                .AnyAsync(ua => ua.UserId == userId && ua.AchievementId == achievementId);
            
            if (existingUnlock)
                throw new InvalidOperationException("Achievement already unlocked.");
            

            var userAchievement = new UserAchievement
            {
                UserId = userId,
                AchievementId = achievementId,
                EarnedAt = DateTime.UtcNow
            };

            await _context.UserAchievements.AddAsync(userAchievement);
            await _context.SaveChangesAsync();
        }

        public async Task<List<Achievement>> GetUserAchievementsAsync(int userId)
        {
            if (userId <= 0)
                throw new ArgumentException($"User ID '{userId}' is invalid.", nameof(userId));
            
            return await _context.UserAchievements
                .Where(ua => ua.UserId == userId)
                .Include(ua => ua.Achievement)
                .Select(ua => ua.Achievement)
                .ToListAsync();
        }

        public async Task<Achievement?> UpdateAchievementAsync(Achievement achievement)
        {
            if (achievement == null)
                throw new ArgumentNullException(nameof(achievement), "Achievement cannot be null.");
            
            var existingAchievement = await _context.Achievements
                .FindAsync(achievement.Id);

            if (existingAchievement == null)
                return null;

            existingAchievement.Name = achievement.Name;
            existingAchievement.Description = achievement.Description;
            existingAchievement.Icon = achievement.Icon;
            existingAchievement.XPRequired = achievement.XPRequired;

            await _context.SaveChangesAsync();
            return existingAchievement;

        }

        public async Task<bool> DeleteAchievementAsync(int id)
        {
            if (id <= 0) return false;

            var achievement = await _context.Achievements.FindAsync(id);

            if (achievement == null) return false;

            _context.Achievements.Remove(achievement);
            await _context.SaveChangesAsync();
            return true;

        }
        
    }
}