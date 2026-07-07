using KiwiDrive.Models;

namespace KiwiDrive.Repository.Interfaces
{
    public interface IQuestionRepository
    {
        Task<Question> CreateQuestionAsync(Question question);

        Task<Question?> GetQuestionByIdAsync(int id);

        Task<Question?> GetQuestionRandomAsync();

        Task<List<Question>> GetQuestionsByCategoryAsync(int categoryId);

        Task<List<Question>> GetAllQuestionsAsync();

        Task<Question> UpdateQuestionAsync(Question question);

        Task<bool> DeleteQuestionAsync(int id);

    }
}