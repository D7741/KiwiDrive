using KiwiDrive.Data;
using KiwiDrive.Models;
using KiwiDrive.Repository.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace KiwiDrive.Repository.Implementations
{
    public class UserRepository : IUserRepository
    {
        private readonly AppDbContext _context;

        public UserRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<User?> CreateUserAsync(User user)
        {
            if (user == null)
                throw new ArgumentNullException(nameof(user), "User cannot be null.");

            var existingUser = await _context.Users
                .FirstOrDefaultAsync(u => u.Email == user.Email);

            if (existingUser != null)
                throw new InvalidOperationException($"User with email '{user.Email}' already exists.");

            await _context.Users.AddAsync(user);
            await _context.SaveChangesAsync();
            return user;
        }

        public async Task<User?> GetUserByIdAsync(int id)
        {
            if (id <= 0)
                throw new ArgumentException($"User ID '{id}' is invalid.", nameof(id));

            return await _context.Users.FindAsync(id);
        }

        public async Task<User?> GetUserByEmailAsync(string email)
        {
            if (string.IsNullOrEmpty(email))
                throw new ArgumentNullException(nameof(email), "Email cannot be null.");

            return await _context.Users
                .FirstOrDefaultAsync(u => u.Email == email);
        }

        public async Task<List<User>> GetLeaderboardAsync()
        {
            return await _context.Users
                .OrderByDescending(u => u.XP)
                .ThenBy(u => u.Username)
                .Take(100)
                .ToListAsync();
        }

        public async Task<List<User>> GetAllUsersAsync()
        {
            return await _context.Users.ToListAsync();
        }

        public async Task<User?> UpdateUserAsync(User user)
        {
            if (user == null)
                throw new ArgumentNullException(nameof(user), "User cannot be null.");

            var existingUser = await _context.Users.FindAsync(user.Id);

            if (existingUser == null) return null;

            existingUser.Username = user.Username;
            existingUser.Email = user.Email;
            existingUser.XP = user.XP;
            existingUser.Level = user.Level;
            existingUser.Streak = user.Streak;

            await _context.SaveChangesAsync();
            return existingUser;
        }

        public async Task UpdateUserXPAsync(int id, int xp)
        {
            if (id <= 0)
                throw new ArgumentException($"User ID '{id}' is invalid.", nameof(id));

            var user = await _context.Users.FindAsync(id);
            if (user == null) return;

            user.XP = xp;
            await _context.SaveChangesAsync();
        }

        public async Task UpdateStreakAsync(int id, int streak)
        {
            if (id <= 0)
                throw new ArgumentException($"User ID '{id}' is invalid.", nameof(id));

            var user = await _context.Users.FindAsync(id);
            if (user == null) return;

            user.Streak = streak;
            await _context.SaveChangesAsync();
        }

        public async Task<bool> DeleteUserAsync(int id)
        {
            if (id <= 0) return false;

            var user = await _context.Users.FindAsync(id);
            if (user == null) return false;

            _context.Users.Remove(user);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}