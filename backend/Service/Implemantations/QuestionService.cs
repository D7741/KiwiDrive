using KiwiDrive.Models;
using KiwiDrive.Dtos.QuestionDtos;
using KiwiDrive.Repository.Interfaces;
using KiwiDrive.Services.Interfaces;

namespace KiwiDrive.Services.Implementations
{
    public class QuestionService: IQuestionService
    {
        private readonly IQuestionRepository _questionRepository;
        private readonly IAchievementRepository _achievementRepository;
        private readonly IUserRepository _userRepository;

        public QuestionService(IQuestionRepository questionRepository, IAchievementRepository achievementRepository, IUserRepository userRepository)
        {
            _questionRepository = questionRepository;
            _achievementRepository = achievementRepository;
            _userRepository = userRepository;

        }

        public async Task<QuestionDto?> GetRandomQuestionAsync()
        {
            var question =  await _questionRepository.GetQuestionRandomAsync();
            if (question == null) return null;

            return new QuestionDto
            {
                Id = question.Id,
                Text = question.Text,
                OptionA = question.OptionA,
                OptionB = question.OptionB,
                OptionC = question.OptionC,
                OptionD = question.OptionD,
                CategoryName = question.Category?.Name ?? string.Empty
            };

        }

        public async Task<List<QuestionDto>> GetQuestionsByCategoryAsync(int categoryId)
        {
            var questions = await _questionRepository.GetQuestionsByCategoryAsync(categoryId);

            if (!questions.Any()) return [];

            return questions.Select(q => new QuestionDto
            {
                Id = q.Id,
                Text = q.Text,
                OptionA = q.OptionA,
                OptionB = q.OptionB,
                OptionC = q.OptionC,
                OptionD = q.OptionD,
                CategoryName = q.Category?.Name ?? string.Empty
            }).ToList();
        }

        public async Task<List<QuestionDto>> GetAllQuestionsAsync()
        {
            var questions = await _questionRepository.GetAllQuestionsAsync();

            if(!questions.Any()) return [];

            return questions.Select(q => new QuestionDto
            {
                Id = q.Id,
                Text = q.Text,
                OptionA = q.OptionA,
                OptionB = q.OptionB,
                OptionC = q.OptionC,
                OptionD = q.OptionD,
                CategoryName = q.Category?.Name ?? string.Empty
            }).ToList();        
        }

        public async Task<AnswerResultDto> SubmitAnswerAsync(int userId, AnswerSubmitDto dto)
        {
            var question = await _questionRepository.GetQuestionByIdAsync(dto.QuestionId);
            if (question == null)
                throw new KeyNotFoundException($"Question with ID '{dto.QuestionId}' not found.");

            var isCorrect = string.Equals(
                question.CorrectAnswer.Trim(),
                dto.Answer.Trim(),
                StringComparison.OrdinalIgnoreCase);

            int xpEarned = 0;
            if (isCorrect)
            {
                xpEarned = 10;
                var user = await _userRepository.GetUserByIdAsync(userId);
                if (user != null)
                {
                    var newXP = user.XP + xpEarned;
                    await _userRepository.UpdateUserXPAsync(userId, newXP);

                    await CheckAndUnlockAchievementsAsync(userId, newXP);
                }
            }

            return new AnswerResultDto
            {
                IsCorrect = isCorrect,
                CorrectAnswer = question.CorrectAnswer,
                Explanation = question.Explanation,
                XPEarned = xpEarned
            };
        }

        // private helper
        private async Task CheckAndUnlockAchievementsAsync(int userId, int currentXP)
        {
            var allAchievements = await _achievementRepository.GetAllAchievementsAsync();

            foreach (var achievement in allAchievements)
            {
                if (achievement.XPRequired == 0) continue;

                if (currentXP >= achievement.XPRequired)
                {
                    var alreadyUnlocked = await _achievementRepository
                        .HasUserAchievementAsync(userId, achievement.Id);

                    if (!alreadyUnlocked)
                        await _achievementRepository.UnlockAchievementAsync(userId, achievement.Id);
                }
            }
        }


    }
}