using KiwiDrive.Models;

namespace KiwiDrive.Repository.Interfaces
{
    public interface IUserRepository
    {
        Task<User> CreateUserAsync(User user);

        Task<User?> GetUserByIdAsync(int id);

        Task<User?> GetUserByEmailAsync(string email);

        Task<List<User>> GetLeaderboardAsync();

        Task<List<User>> GetAllUsersAsync();

        Task<User> UpdateUserAsync(User user);

        Task UpdateUserXPAsync(int id, int xp);

        Task UpdateStreakAsync(int id, int streak);

        Task<bool> DeleteUserAsync(int id);

    }
}