using KiwiDrive.Repository.Interfaces;
using KiwiDrive.Services.Interfaces;
using KiwiDrive.Dtos.AchievementDtos;



namespace KiwiDrive.Services.Implementations
{
    public class AchievementService : IAchievementService
    {
        private readonly IAchievementRepository _achievementRepository;
        private readonly IUserRepository _userRepository;

        public AchievementService(IAchievementRepository achievementRepository, IUserRepository userRepository)
        {
            _achievementRepository = achievementRepository;
            _userRepository = userRepository;
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
            var achievements = await _achievementRepository.GetUserAchievementsAsync(userId);

            if (!achievements.Any()) return [];

            return achievements.Select(a => new AchievementDto
            {
                Id = a.Id,
                Name = a.Name,
                Description = a.Description,
                Icon = a.Icon,
                IsUnlocked = true
            }).ToList();
        }

        public async Task CheckAndUnlockAchievementsAsync(int userId)
        {
            var user = await _userRepository.GetUserByIdAsync(userId);
            if (user == null) return;

            var allAchievements = await _achievementRepository.GetAllAchievementsAsync();

            foreach (var achievement in allAchievements)
            {
                if (achievement.XPRequired == 0) continue;

                if (user.XP >= achievement.XPRequired)
                {
                    var alreadyUnlocked = await _achievementRepository
                        .HasUserAchievementAsync(userId, achievement.Id);

                    if (!alreadyUnlocked)
                        await _achievementRepository.UnlockAchievementAsync(userId, achievement.Id);
                }
            }
        }
    }
}