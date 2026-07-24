using KiwiDrive.Models;

namespace KiwiDrive.Repository.Interfaces
{
    public interface IUserProgressRepository
    {
        Task<List<UserProgress>> GetByUserAsync(int userId);

        Task RecordAnswerAsync(int userId, int categoryId, bool isCorrect);
    }
}
