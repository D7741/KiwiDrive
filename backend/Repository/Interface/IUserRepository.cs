using KiwiDrive.Models;

namespace KiwiDrive.Repository.Interface
{
    public interface IUserRepository
    {
        Task<User> CreateUserAsync(User user);

        Task<User?> GetUserByIdAsync(int id);

        Task<User?> GetUserByEmailAsync(string email);

        Task<List<User>> GetLeaderboardAsync();

        Task<List<User>> GetAllUserAsync();

        Task<User> UpdateUserAsync(User user);

        Task UpdateUserXPAsync(int id, int xp);

        Task UpdateStreakAsync(int id, int streak);

        Task<bool> DeleteUserAsync(int id);

    }
}