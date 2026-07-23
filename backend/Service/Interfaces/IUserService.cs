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
        Task<bool> ChangePasswordAsync(int userId, ChangePasswordDto dto);

        // Temp: test purpose
        Task<List<UserProfileDto>> GetAllUsersAsync();

        // Leaderboard
        Task<List<LeaderboardEntryDto>> GetLeaderboardAsync();

    }
}
