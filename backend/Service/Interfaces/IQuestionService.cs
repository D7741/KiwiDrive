using KiwiDrive.Dtos.QuestionDtos;

namespace KiwiDrive.Services.Interfaces
{
    public interface IQuestionService
    {
        Task<QuestionDto?> GetRandomQuestionAsync();
        Task<List<QuestionDto>> GetQuestionsByCategoryAsync(int categoryId);
        Task<List<QuestionDto>> GetAllQuestionsAsync();
        Task<AnswerResultDto> SubmitAnswerAsync(int userId, AnswerSubmitDto dto);
    }
}