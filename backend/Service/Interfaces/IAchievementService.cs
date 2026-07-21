using KiwiDrive.Dtos.AchievementDtos;

namespace KiwiDrive.Services.Interfaces
{
    public interface IAchievementService
    {
        Task<List<AchievementDto>> GetAllAchievementsAsync();
        Task<List<AchievementDto>> GetUserAchievementsAsync(int userId);
    }
}