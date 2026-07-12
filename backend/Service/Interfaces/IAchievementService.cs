using KiwiDrive.Dtos.AchievementDtos;

namespace KiwiDrive.Services.Interfaces
{
    public interface IAchievementService
    {
        Task<List<AchievementDto>> GetAllAchievementsAsync(int userId);
        Task<List<AchievementDto>> GetUserAchievementsAsync(int userId);
        Task CheckAndUnlockAchievementsAsync(int userId);
    }
}