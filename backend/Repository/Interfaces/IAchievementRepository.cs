using KiwiDrive.Models;

namespace KiwiDrive.Repository.Interfaces
{
    public interface IAchievementRepository
    {
        Task<Achievement> CreateAchievementAsync(Achievement achievement);

        Task<Achievement?> GetAchievementByIdAsync(int id);

        Task<Achievement?> GetAchievementByNameAsync(string name);

        Task<List<Achievement>> GetAllAchievementsAsync();

        Task<bool> HasUserAchievementAsync(int userId, int achievementId);

        Task UnlockAchievementAsync(int userId, int achievementId);

        Task<List<Achievement>> GetUserAchievementsAsync(int userId);

        Task<Achievement> UpdateAchievementAsync(Achievement achievement);

        Task<bool> DeleteAchievementAsync(int id);

    }
}
