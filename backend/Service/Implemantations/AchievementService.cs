using KiwiDrive.Repository.Interfaces;
using KiwiDrive.Services.Interfaces;
using KiwiDrive.Dtos.AchievementDtos;



namespace KiwiDrive.Services.Implementations
{
    public class AchievementService : IAchievementService
    {
        private readonly IAchievementRepository _achievementRepository;

        public AchievementService(IAchievementRepository achievementRepository)
        {
            _achievementRepository = achievementRepository;
        }

        public async Task<List<AchievementDto>> GetAllAchievementsAsync()
        {
            var achievements = await _achievementRepository.GetAllAchievementsAsync();
            
            if (!achievements.Any()) return [];

            return achievements.Select(a => new AchievementDto
            {
                Id = a.Id,
                Name = a.Name,
                Description = a.Description,
                Icon = a.Icon,
                IsUnlocked = false
            }).ToList();
        }

        public async Task<List<AchievementDto>> GetUserAchievementsAsync(int userId)
        {
            var allAchievements = await _achievementRepository.GetAllAchievementsAsync();
            var unlockedAchievements = await _achievementRepository.GetUserAchievementsAsync(userId);
            var unlockedIds = unlockedAchievements.Select(a => a.Id).ToHashSet();

            return allAchievements.Select(a => new AchievementDto
            {
                Id = a.Id,
                Name = a.Name,
                Description = a.Description,
                Icon = a.Icon,
                IsUnlocked = unlockedIds.Contains(a.Id)
            }).ToList();
        }
    }
}