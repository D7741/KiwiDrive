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
        private readonly IUserProgressRepository _userProgressRepository;

        public QuestionService(
            IQuestionRepository questionRepository,
            IAchievementRepository achievementRepository,
            IUserRepository userRepository,
            IUserProgressRepository userProgressRepository)
        {
            _questionRepository = questionRepository;
            _achievementRepository = achievementRepository;
            _userRepository = userRepository;
            _userProgressRepository = userProgressRepository;

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

            await _userProgressRepository.RecordAnswerAsync(userId, question.CategoryId, isCorrect);

            int xpEarned = 0;
            if (isCorrect)
            {
                xpEarned = 10;
                var user = await _userRepository.GetUserByIdAsync(userId);
                if (user != null)
                {
                    var newXP = user.XP + xpEarned;
                    await _userRepository.UpdateUserXPAsync(userId, newXP);

                    var newStreak = await UpdateStreakOnCorrectAnswerAsync(user);

                    await CheckAndUnlockAchievementsAsync(userId, newXP, newStreak);
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

        public async Task<QuestionDto> CreateQuestionAsync(CreateQuestionDto dto)
        {
            var question = new Question
            {
                Text = dto.Text,
                OptionA = dto.OptionA,
                OptionB = dto.OptionB,
                OptionC = dto.OptionC,
                OptionD = dto.OptionD,
                CorrectAnswer = dto.CorrectAnswer,
                Explanation = dto.Explanation,
                CategoryId = dto.CategoryId
            };

            var created = await _questionRepository.CreateQuestionAsync(question);

            return new QuestionDto
            {
                Id = created.Id,
                Text = created.Text,
                OptionA = created.OptionA,
                OptionB = created.OptionB,
                OptionC = created.OptionC,
                OptionD = created.OptionD,
                CategoryName = created.Category?.Name ?? string.Empty
            };
        }

        public async Task<QuestionDto?> UpdateQuestionAsync(int id, CreateQuestionDto dto)
        {
            var existingQuestion = await _questionRepository.GetQuestionByIdAsync(id);
            if (existingQuestion == null) return null;

            existingQuestion.Text = dto.Text;
            existingQuestion.OptionA = dto.OptionA;
            existingQuestion.OptionB = dto.OptionB;
            existingQuestion.OptionC = dto.OptionC;
            existingQuestion.OptionD = dto.OptionD;
            existingQuestion.CorrectAnswer = dto.CorrectAnswer;
            existingQuestion.Explanation = dto.Explanation;
            existingQuestion.CategoryId = dto.CategoryId;

            var updated = await _questionRepository.UpdateQuestionAsync(existingQuestion);
            if (updated == null) return null;

            return new QuestionDto
            {
                Id = updated.Id,
                Text = updated.Text,
                OptionA = updated.OptionA,
                OptionB = updated.OptionB,
                OptionC = updated.OptionC,
                OptionD = updated.OptionD,
                CategoryName = updated.Category?.Name ?? string.Empty
            };
        }

        public async Task<bool> DeleteQuestionAsync(int id)
        {
            return await _questionRepository.DeleteQuestionAsync(id);
        }


        // private helper
        private const string SevenDayStreakAchievementName = "7 Day Streak";

        private async Task<int> UpdateStreakOnCorrectAnswerAsync(User user)
        {
            var today = DateTime.UtcNow.Date;
            var lastStreakDate = user.LastStreakDate?.Date;

            if (lastStreakDate == today)
            {
                // Already checked in today, no change.
                return user.Streak;
            }

            var newStreak = lastStreakDate == today.AddDays(-1)
                ? user.Streak + 1
                : 1;

            await _userRepository.UpdateStreakAsync(user.Id, newStreak);
            return newStreak;
        }

        private async Task CheckAndUnlockAchievementsAsync(int userId, int currentXP, int currentStreak)
        {
            var allAchievements = await _achievementRepository.GetAllAchievementsAsync();

            foreach (var achievement in allAchievements)
            {
                // "7 Day Streak" is not XP-based, so it needs its own check instead of
                // the XPRequired threshold below.
                if (achievement.Name == SevenDayStreakAchievementName)
                {
                    if (currentStreak < 7) continue;

                    var streakAlreadyUnlocked = await _achievementRepository
                        .HasUserAchievementAsync(userId, achievement.Id);

                    if (!streakAlreadyUnlocked)
                        await _achievementRepository.UnlockAchievementAsync(userId, achievement.Id);

                    continue;
                }

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