using KiwiDrive.Dtos.DashboardDtos;
using KiwiDrive.Repository.Interfaces;
using KiwiDrive.Services.Interfaces;

namespace KiwiDrive.Services.Implementations
{
    public class DashboardService : IDashboardService
    {
        private readonly IQuestionRepository _questionRepository;
        private readonly IUserProgressRepository _userProgressRepository;

        public DashboardService(IQuestionRepository questionRepository, IUserProgressRepository userProgressRepository)
        {
            _questionRepository = questionRepository;
            _userProgressRepository = userProgressRepository;
        }

        public async Task<List<CategoryStatDto>> GetCategoryStatsAsync(int userId)
        {
            var allQuestions = await _questionRepository.GetAllQuestionsAsync();
            var userProgress = await _userProgressRepository.GetByUserAsync(userId);
            var progressByCategory = userProgress.ToDictionary(up => up.CategoryId);

            return allQuestions
                .GroupBy(q => new { q.CategoryId, CategoryName = q.Category?.Name ?? string.Empty })
                .Select(g =>
                {
                    var totalQuestions = g.Count();
                    progressByCategory.TryGetValue(g.Key.CategoryId, out var progress);

                    var answeredQuestions = progress?.TotalAnswered ?? 0;
                    var totalCorrect = progress?.TotalCorrect ?? 0;

                    // TotalAnswered counts every attempt, not distinct questions, so a
                    // user re-answering the same questions can push it past totalQuestions.
                    var progressPct = totalQuestions == 0
                        ? 0
                        : Math.Min(100, (int)Math.Round(answeredQuestions * 100.0 / totalQuestions));

                    var accuracyPct = answeredQuestions == 0
                        ? 0
                        : (int)Math.Round(totalCorrect * 100.0 / answeredQuestions);

                    return new CategoryStatDto
                    {
                        CategoryId = g.Key.CategoryId,
                        CategoryName = g.Key.CategoryName,
                        Progress = progressPct,
                        Accuracy = accuracyPct,
                        TotalQuestions = totalQuestions,
                        AnsweredQuestions = answeredQuestions
                    };
                })
                .OrderBy(c => c.CategoryId)
                .ToList();
        }
    }
}
