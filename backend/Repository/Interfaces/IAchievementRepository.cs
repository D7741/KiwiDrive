using KiwiDrive.Models;

namespace KiwiDrive.Repository.Interfaces
{
    public interface IAchievementRepository
    {
        Task<Achievement> CreateAchievementAsync(Achievement achievement);

        Task<Achievement?> GetAchievementByIdAsync(int id);

        Task<Achievement?> GetAchievementByNameAsync(string name);

        Task<List<Achievement>> GetAllAchievementsAsync();

        Task<Achievement> UpdateAchievementAsync(Achievement achievement);

        Task<bool> DeleteAchievementAsync(int id);

    }
}