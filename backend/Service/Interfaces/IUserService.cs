using KiwiDrive.Dtos.UserDtos;
using KiwiDrive.Dtos.LeaderboardDtos;

namespace KiwiDrive.Services.Interfaces
{
    public interface IUserService
    {
        Task<AuthResponseDto> RegisterAsync(RegisterDto dto);
        Task<AuthResponseDto> LoginAsync(LoginDto dto);
        Task<UserProfileDto?> GetUserProfileAsync(int id);
        Task<UserProfileDto?> UpdateUserAsync(int id, UserUpdateDto dto);
        Task<bool> DeleteUserAsync(int id);

        // Leaderboard
        Task<List<LeaderboardEntryDto>> GetLeaderboardAsync();

    }
}
