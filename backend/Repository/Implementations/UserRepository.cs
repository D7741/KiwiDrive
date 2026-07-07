using KiwiDrive.Data;
using KiwiDrive.Models;
using KiwiDrive.Repository.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace KiwiDrive.Repository.Implementations
{
    public class UserRepository: IUserRepository
    {
        private readonly AppDbContext _context;

        public UserRepository(AppDbContext context)
        {
            _context = context;
        }
        
        public async Task<User?> CreateUserAsync(User user)
        {
            if (user == null)
            {
                throw new ArgumentNullException(nameof(user), "User cannot be null.");
            }
            // Check Email
            var existingUser = await _context.Users.FirstOrDefaultAsync(u => u.Email == user.Email);

            if (existingUser != null)
            {
                throw new InvalidOperationException($"User with email '{user.Email}' already exists.");
            }
            
            await _context.Users.AddAsync(user);
            await _context.SaveChangesAsync();
            return user;
        }

        public async Task<User?> GetUserByIdAsync(int id)
        {
            if (id == default)
            {
                throw new ArgumentException($"User ID '{id}' is invalid.", nameof(id));
            }

            var user = await _context.Users.FindAsync(id);

            if (user == null)
            {
                throw new KeyNotFoundException($"User with ID '{id}' does not exist.");
            }

            return user;
        }

        public async Task<User?> GetUserByEmailAsync(string email)
        {
            if (email == null)
            {
                throw new ArgumentNullException($"Email cannot be null");
            }
            
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == email);

            if (user == null)
            {
                throw new KeyNotFoundException($"User with Email '{email}' does not exist.");
            }

            return user;
        }

        public async Task<List<User>> GetLeaderboardAsync()
        {
            var leaderboard = await _context.Users
                .OrderByDescending(u => u.XP)
                .ThenBy(u => u.Username)
                .Take(100)
                .ToListAsync();

            return leaderboard;
        }

        public async Task<List<User>> GetAllUsersAsync()
        {
            var users = await _context.Users
                .ToListAsync();
            
            return users;
        }

        public async Task<User?> UpdateUserAsync(User user)
        {
            if (user == null)
            {
                throw new ArgumentNullException(nameof(user), "User cannot be null.");
            }
            
            var existingUser = await _context.Users.FirstOrDefaultAsync(u => u.Email == user.Email);

            if (existingUser == null)
            {
                throw new ArgumentNullException($"pls register first");
            }

            existingUser.Username = user.Username;
            existingUser.Email = user.Email;
            existingUser.XP = user.XP;
            existingUser.Level = user.Level;
            existingUser.Streak = user.Streak;

            await _context.SaveChangesAsync();
            return await GetUserByIdAsync(existingUser.Id);
            
        }

        public async Task UpdateUserXPAsync(int id, int xp)
        {
            if (id == default)
            {
                throw new ArgumentException($"User ID '{id}' is invalid.", nameof(id));
            }

            var user = await _context.Users.FindAsync(id);

            if (user == null)
            {
                throw new ArgumentNullException(nameof(user), "User cannot be null.");
            }

            user.XP = xp;
            await _context.SaveChangesAsync();
        }

        public async Task UpdateStreakAsync(int id, int streak)
        {
            if (id == default)
            {
                throw new ArgumentException($"User ID '{id}' is invalid.", nameof(id));
            }

            var user = await _context.Users.FindAsync(id);

            if (user == null)
            {
                throw new ArgumentNullException(nameof(user), "User cannot be null.");
            }

            user.Streak = streak;
            await _context.SaveChangesAsync();
        }

        public async Task<bool> DeleteUserAsync(int id)
        {
            if (id == default)
            {
                throw new ArgumentException($"User ID '{id}' is invalid.", nameof(id));
            }

            var user = await _context.Users.FindAsync(id);

            if (user == null)
            {
                throw new ArgumentNullException(nameof(user), "User cannot be null.");
            }

            _context.Users.Remove(user);

            await _context.SaveChangesAsync();
            return true;
        }


    }
}