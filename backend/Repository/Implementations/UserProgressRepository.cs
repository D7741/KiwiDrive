using KiwiDrive.Data;
using KiwiDrive.Models;
using KiwiDrive.Repository.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace KiwiDrive.Repository.Implementations
{
    public class UserProgressRepository : IUserProgressRepository
    {
        private readonly AppDbContext _context;

        public UserProgressRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<List<UserProgress>> GetByUserAsync(int userId)
        {
            if (userId <= 0)
                throw new ArgumentException($"User ID '{userId}' is invalid.", nameof(userId));

            return await _context.UserProgresses
                .Where(up => up.UserId == userId)
                .ToListAsync();
        }

        public async Task RecordAnswerAsync(int userId, int categoryId, bool isCorrect)
        {
            var progress = await _context.UserProgresses
                .FirstOrDefaultAsync(up => up.UserId == userId && up.CategoryId == categoryId);

            if (progress == null)
            {
                progress = new UserProgress
                {
                    UserId = userId,
                    CategoryId = categoryId
                };
                await _context.UserProgresses.AddAsync(progress);
            }

            progress.TotalAnswered += 1;
            if (isCorrect) progress.TotalCorrect += 1;

            await _context.SaveChangesAsync();
        }
    }
}
