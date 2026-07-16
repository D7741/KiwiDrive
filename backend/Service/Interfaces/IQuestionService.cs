using KiwiDrive.Dtos.QuestionDtos;

namespace KiwiDrive.Services.Interfaces
{
    public interface IQuestionService
    {
        Task<QuestionDto?> GetRandomQuestionAsync();
        Task<List<QuestionDto>> GetQuestionsByCategoryAsync(int categoryId);
        Task<List<QuestionDto>> GetAllQuestionsAsync();
        Task<AnswerResultDto> SubmitAnswerAsync(int userId, AnswerSubmitDto dto);

        Task<QuestionDto> CreateQuestionAsync(CreateQuestionDto dto);
        Task<QuestionDto?> UpdateQuestionAsync(int id, CreateQuestionDto dto);
        Task<bool> DeleteQuestionAsync(int id);
    }
}