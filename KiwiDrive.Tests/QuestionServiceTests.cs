using KiwiDrive.Dtos.QuestionDtos;
using KiwiDrive.Models;
using KiwiDrive.Repository.Interfaces;
using KiwiDrive.Services.Implementations;
using Moq;

namespace KiwiDrive.Tests;

public class QuestionServiceTests
{
    private readonly Mock<IQuestionRepository> _questionRepo = new();
    private readonly Mock<IAchievementRepository> _achievementRepo = new();
    private readonly Mock<IUserRepository> _userRepo = new();
    private readonly Mock<IUserProgressRepository> _progressRepo = new();
    private readonly QuestionService _service;

    public QuestionServiceTests()
    {
        _service = new QuestionService(_questionRepo.Object, _achievementRepo.Object, _userRepo.Object, _progressRepo.Object);
    }

    private static User CreateTestUser(int id, int xp, int streak, DateTime? lastStreakDate) => new()
    {
        Id = id,
        Username = $"user{id}",
        Email = $"user{id}@example.com",
        PasswordHash = "hash",
        XP = xp,
        Streak = streak,
        LastStreakDate = lastStreakDate
    };

    private static Question CreateQuestion(int id, int categoryId, string correctAnswer, string explanation = "Explanation") => new()
    {
        Id = id,
        Text = $"Question {id}",
        OptionA = "A",
        OptionB = "B",
        OptionC = "C",
        OptionD = "D",
        CorrectAnswer = correctAnswer,
        Explanation = explanation,
        CategoryId = categoryId
    };

    private static Achievement CreateAchievement(int id, string name, int xpRequired) => new()
    {
        Id = id,
        Name = name,
        Description = "Description",
        Icon = "icon",
        XPRequired = xpRequired
    };

    // 1. Question not found.
    [Fact]
    public async Task SubmitAnswerAsync_QuestionNotFound_ThrowsKeyNotFoundException()
    {
        _questionRepo.Setup(r => r.GetQuestionByIdAsync(It.IsAny<int>())).ReturnsAsync((Question?)null);

        await Assert.ThrowsAsync<KeyNotFoundException>(
            () => _service.SubmitAnswerAsync(1, new AnswerSubmitDto { QuestionId = 99, Answer = "A" }));

        _progressRepo.Verify(r => r.RecordAnswerAsync(It.IsAny<int>(), It.IsAny<int>(), It.IsAny<bool>()), Times.Never);
        _userRepo.Verify(r => r.GetUserByIdAsync(It.IsAny<int>()), Times.Never);
    }

    // 2. Answer comparison is case- and whitespace-insensitive.
    [Theory]
    [InlineData("B", " b ", true)]
    [InlineData("B", "b", true)]
    [InlineData("B", "B", true)]
    [InlineData("B", " B ", true)]
    [InlineData("B", "C", false)]
    [InlineData("B", "", false)]
    public async Task SubmitAnswerAsync_AnswerComparison_IsCaseAndWhitespaceInsensitive(
        string correctAnswer, string submittedAnswer, bool expectedIsCorrect)
    {
        var question = CreateQuestion(1, categoryId: 1, correctAnswer: correctAnswer);
        _questionRepo.Setup(r => r.GetQuestionByIdAsync(1)).ReturnsAsync(question);

        var result = await _service.SubmitAnswerAsync(1, new AnswerSubmitDto { QuestionId = 1, Answer = submittedAnswer });

        Assert.Equal(expectedIsCorrect, result.IsCorrect);
    }

    // 3. Correct answer path: progress recorded, XP awarded, DTO reflects the question.
    [Fact]
    public async Task SubmitAnswerAsync_CorrectAnswer_RecordsProgressAwardsXPAndReturnsCorrectDto()
    {
        var question = CreateQuestion(id: 1, categoryId: 5, correctAnswer: "B", explanation: "Because reasons");
        var user = CreateTestUser(id: 7, xp: 40, streak: 0, lastStreakDate: null);

        _questionRepo.Setup(r => r.GetQuestionByIdAsync(1)).ReturnsAsync(question);
        _userRepo.Setup(r => r.GetUserByIdAsync(7)).ReturnsAsync(user);
        _achievementRepo.Setup(r => r.GetAllAchievementsAsync()).ReturnsAsync(new List<Achievement>());

        var result = await _service.SubmitAnswerAsync(7, new AnswerSubmitDto { QuestionId = 1, Answer = "b" });

        Assert.True(result.IsCorrect);
        Assert.Equal(10, result.XPEarned);
        Assert.Equal("B", result.CorrectAnswer);
        Assert.Equal("Because reasons", result.Explanation);

        _progressRepo.Verify(r => r.RecordAnswerAsync(7, 5, true), Times.Once);
        _userRepo.Verify(r => r.UpdateUserXPAsync(7, 50), Times.Once); // 40 + 10
    }

    // 4. Wrong answer path: the entire XP/streak/achievement branch must be skipped.
    [Fact]
    public async Task SubmitAnswerAsync_WrongAnswer_SkipsXPStreakAndAchievementLogic()
    {
        var question = CreateQuestion(id: 1, categoryId: 5, correctAnswer: "B");
        _questionRepo.Setup(r => r.GetQuestionByIdAsync(1)).ReturnsAsync(question);

        var result = await _service.SubmitAnswerAsync(7, new AnswerSubmitDto { QuestionId = 1, Answer = "C" });

        Assert.False(result.IsCorrect);
        Assert.Equal(0, result.XPEarned);

        _progressRepo.Verify(r => r.RecordAnswerAsync(7, 5, false), Times.Once);
        _userRepo.Verify(r => r.GetUserByIdAsync(It.IsAny<int>()), Times.Never);
        _userRepo.Verify(r => r.UpdateUserXPAsync(It.IsAny<int>(), It.IsAny<int>()), Times.Never);
        _userRepo.Verify(r => r.UpdateStreakAsync(It.IsAny<int>(), It.IsAny<int>()), Times.Never);
        _achievementRepo.Verify(r => r.GetAllAchievementsAsync(), Times.Never);
    }

    // 5. Correct answer, but the user record is gone (e.g. deleted).
    [Fact]
    public async Task SubmitAnswerAsync_CorrectAnswerButUserNotFound_StillReportsXPEarnedButSkipsPersistence()
    {
        var question = CreateQuestion(id: 1, categoryId: 5, correctAnswer: "B");
        _questionRepo.Setup(r => r.GetQuestionByIdAsync(1)).ReturnsAsync(question);
        _userRepo.Setup(r => r.GetUserByIdAsync(7)).ReturnsAsync((User?)null);

        var result = await _service.SubmitAnswerAsync(7, new AnswerSubmitDto { QuestionId = 1, Answer = "B" });

        Assert.True(result.IsCorrect);
        Assert.Equal(10, result.XPEarned); // xpEarned is assigned before the null check

        _userRepo.Verify(r => r.UpdateUserXPAsync(It.IsAny<int>(), It.IsAny<int>()), Times.Never);
        _userRepo.Verify(r => r.UpdateStreakAsync(It.IsAny<int>(), It.IsAny<int>()), Times.Never);
        _achievementRepo.Verify(r => r.GetAllAchievementsAsync(), Times.Never);
    }

    // 6a. Already checked in today -> streak unchanged, UpdateStreakAsync not called.
    [Fact]
    public async Task SubmitAnswerAsync_AlreadyCheckedInToday_StreakUnchangedAndUpdateStreakNotCalled()
    {
        var today = DateTime.UtcNow.Date;
        var user = CreateTestUser(id: 1, xp: 0, streak: 6, lastStreakDate: today);
        var question = CreateQuestion(1, categoryId: 1, correctAnswer: "A");
        var streakAchievement = CreateAchievement(id: 9, name: "7 Day Streak", xpRequired: 0);

        _questionRepo.Setup(r => r.GetQuestionByIdAsync(1)).ReturnsAsync(question);
        _userRepo.Setup(r => r.GetUserByIdAsync(1)).ReturnsAsync(user);
        _achievementRepo.Setup(r => r.GetAllAchievementsAsync()).ReturnsAsync(new List<Achievement> { streakAchievement });

        await _service.SubmitAnswerAsync(1, new AnswerSubmitDto { QuestionId = 1, Answer = "A" });

        _userRepo.Verify(r => r.UpdateStreakAsync(It.IsAny<int>(), It.IsAny<int>()), Times.Never);
        // Streak stayed at 6 (< 7), so the streak achievement must not unlock either.
        _achievementRepo.Verify(r => r.UnlockAchievementAsync(It.IsAny<int>(), 9), Times.Never);
    }

    // 6b. Checked in yesterday -> streak increments by one.
    [Fact]
    public async Task SubmitAnswerAsync_CheckedInYesterday_IncrementsStreakByOne()
    {
        var yesterday = DateTime.UtcNow.Date.AddDays(-1);
        var user = CreateTestUser(id: 1, xp: 0, streak: 3, lastStreakDate: yesterday);
        var question = CreateQuestion(1, categoryId: 1, correctAnswer: "A");

        _questionRepo.Setup(r => r.GetQuestionByIdAsync(1)).ReturnsAsync(question);
        _userRepo.Setup(r => r.GetUserByIdAsync(1)).ReturnsAsync(user);
        _achievementRepo.Setup(r => r.GetAllAchievementsAsync()).ReturnsAsync(new List<Achievement>());

        await _service.SubmitAnswerAsync(1, new AnswerSubmitDto { QuestionId = 1, Answer = "A" });

        _userRepo.Verify(r => r.UpdateStreakAsync(1, 4), Times.Once); // 3 + 1
    }

    // 6c. Never checked in before (brand-new user) -> streak resets to 1.
    [Fact]
    public async Task SubmitAnswerAsync_NeverCheckedInBefore_ResetsStreakToOne()
    {
        var user = CreateTestUser(id: 1, xp: 0, streak: 0, lastStreakDate: null);
        var question = CreateQuestion(1, categoryId: 1, correctAnswer: "A");

        _questionRepo.Setup(r => r.GetQuestionByIdAsync(1)).ReturnsAsync(question);
        _userRepo.Setup(r => r.GetUserByIdAsync(1)).ReturnsAsync(user);
        _achievementRepo.Setup(r => r.GetAllAchievementsAsync()).ReturnsAsync(new List<Achievement>());

        await _service.SubmitAnswerAsync(1, new AnswerSubmitDto { QuestionId = 1, Answer = "A" });

        _userRepo.Verify(r => r.UpdateStreakAsync(1, 1), Times.Once);
    }

    // 6d. Streak broken several days ago -> also resets to 1, not just the "never" case.
    [Fact]
    public async Task SubmitAnswerAsync_StreakBrokenSeveralDaysAgo_ResetsStreakToOne()
    {
        var threeDaysAgo = DateTime.UtcNow.Date.AddDays(-3);
        var user = CreateTestUser(id: 1, xp: 0, streak: 12, lastStreakDate: threeDaysAgo);
        var question = CreateQuestion(1, categoryId: 1, correctAnswer: "A");

        _questionRepo.Setup(r => r.GetQuestionByIdAsync(1)).ReturnsAsync(question);
        _userRepo.Setup(r => r.GetUserByIdAsync(1)).ReturnsAsync(user);
        _achievementRepo.Setup(r => r.GetAllAchievementsAsync()).ReturnsAsync(new List<Achievement>());

        await _service.SubmitAnswerAsync(1, new AnswerSubmitDto { QuestionId = 1, Answer = "A" });

        _userRepo.Verify(r => r.UpdateStreakAsync(1, 1), Times.Once);
    }

    // 7a. "7 Day Streak" special-case: below the threshold, skipped without affecting other achievements.
    [Fact]
    public async Task SubmitAnswerAsync_StreakBelowSeven_DoesNotUnlockStreakAchievementButStillChecksOthers()
    {
        var yesterday = DateTime.UtcNow.Date.AddDays(-1);
        var user = CreateTestUser(id: 1, xp: 90, streak: 5, lastStreakDate: yesterday); // newStreak = 6, still < 7
        var question = CreateQuestion(1, categoryId: 1, correctAnswer: "A");
        var streakAchievement = CreateAchievement(id: 9, name: "7 Day Streak", xpRequired: 0);
        var xpAchievement = CreateAchievement(id: 2, name: "Road Rookie", xpRequired: 100); // 90+10=100 -> qualifies

        _questionRepo.Setup(r => r.GetQuestionByIdAsync(1)).ReturnsAsync(question);
        _userRepo.Setup(r => r.GetUserByIdAsync(1)).ReturnsAsync(user);
        _achievementRepo.Setup(r => r.GetAllAchievementsAsync()).ReturnsAsync(new List<Achievement> { streakAchievement, xpAchievement });
        _achievementRepo.Setup(r => r.HasUserAchievementAsync(1, It.IsAny<int>())).ReturnsAsync(false);

        await _service.SubmitAnswerAsync(1, new AnswerSubmitDto { QuestionId = 1, Answer = "A" });

        _achievementRepo.Verify(r => r.UnlockAchievementAsync(1, 9), Times.Never); // streak achievement skipped
        _achievementRepo.Verify(r => r.UnlockAchievementAsync(1, 2), Times.Once);  // XP achievement still unlocked
    }

    // 7b. Streak reaches 7 and isn't unlocked yet -> unlocks.
    [Fact]
    public async Task SubmitAnswerAsync_StreakReachesSevenAndNotYetUnlocked_UnlocksStreakAchievement()
    {
        var yesterday = DateTime.UtcNow.Date.AddDays(-1);
        var user = CreateTestUser(id: 1, xp: 0, streak: 6, lastStreakDate: yesterday); // newStreak = 7
        var question = CreateQuestion(1, categoryId: 1, correctAnswer: "A");
        var streakAchievement = CreateAchievement(id: 9, name: "7 Day Streak", xpRequired: 0);

        _questionRepo.Setup(r => r.GetQuestionByIdAsync(1)).ReturnsAsync(question);
        _userRepo.Setup(r => r.GetUserByIdAsync(1)).ReturnsAsync(user);
        _achievementRepo.Setup(r => r.GetAllAchievementsAsync()).ReturnsAsync(new List<Achievement> { streakAchievement });
        _achievementRepo.Setup(r => r.HasUserAchievementAsync(1, 9)).ReturnsAsync(false);

        await _service.SubmitAnswerAsync(1, new AnswerSubmitDto { QuestionId = 1, Answer = "A" });

        _achievementRepo.Verify(r => r.UnlockAchievementAsync(1, 9), Times.Once);
    }

    // 7c. Streak >= 7 but already unlocked -> must not unlock again.
    [Fact]
    public async Task SubmitAnswerAsync_StreakAtLeastSevenButAlreadyUnlocked_DoesNotUnlockAgain()
    {
        var yesterday = DateTime.UtcNow.Date.AddDays(-1);
        var user = CreateTestUser(id: 1, xp: 0, streak: 10, lastStreakDate: yesterday); // newStreak = 11
        var question = CreateQuestion(1, categoryId: 1, correctAnswer: "A");
        var streakAchievement = CreateAchievement(id: 9, name: "7 Day Streak", xpRequired: 0);

        _questionRepo.Setup(r => r.GetQuestionByIdAsync(1)).ReturnsAsync(question);
        _userRepo.Setup(r => r.GetUserByIdAsync(1)).ReturnsAsync(user);
        _achievementRepo.Setup(r => r.GetAllAchievementsAsync()).ReturnsAsync(new List<Achievement> { streakAchievement });
        _achievementRepo.Setup(r => r.HasUserAchievementAsync(1, 9)).ReturnsAsync(true);

        await _service.SubmitAnswerAsync(1, new AnswerSubmitDto { QuestionId = 1, Answer = "A" });

        _achievementRepo.Verify(r => r.UnlockAchievementAsync(It.IsAny<int>(), It.IsAny<int>()), Times.Never);
    }

    // 8a. XPRequired == 0 means "explicitly excluded", not "always qualifies".
    [Fact]
    public async Task SubmitAnswerAsync_AchievementWithZeroXPRequired_IsAlwaysSkipped()
    {
        var user = CreateTestUser(id: 1, xp: 1000, streak: 0, lastStreakDate: DateTime.UtcNow.Date.AddDays(-1));
        var question = CreateQuestion(1, categoryId: 1, correctAnswer: "A");
        var zeroXpAchievement = CreateAchievement(id: 6, name: "Night Owl", xpRequired: 0);

        _questionRepo.Setup(r => r.GetQuestionByIdAsync(1)).ReturnsAsync(question);
        _userRepo.Setup(r => r.GetUserByIdAsync(1)).ReturnsAsync(user);
        _achievementRepo.Setup(r => r.GetAllAchievementsAsync()).ReturnsAsync(new List<Achievement> { zeroXpAchievement });

        await _service.SubmitAnswerAsync(1, new AnswerSubmitDto { QuestionId = 1, Answer = "A" });

        _achievementRepo.Verify(r => r.HasUserAchievementAsync(It.IsAny<int>(), 6), Times.Never);
        _achievementRepo.Verify(r => r.UnlockAchievementAsync(It.IsAny<int>(), 6), Times.Never);
    }

    // 8b. XP meets the threshold and isn't unlocked yet -> unlocks.
    [Fact]
    public async Task SubmitAnswerAsync_XPMeetsThresholdAndNotUnlocked_UnlocksAchievement()
    {
        var user = CreateTestUser(id: 1, xp: 90, streak: 0, lastStreakDate: null); // newXP = 100
        var question = CreateQuestion(1, categoryId: 1, correctAnswer: "A");
        var achievement = CreateAchievement(id: 2, name: "Road Rookie", xpRequired: 100);

        _questionRepo.Setup(r => r.GetQuestionByIdAsync(1)).ReturnsAsync(question);
        _userRepo.Setup(r => r.GetUserByIdAsync(1)).ReturnsAsync(user);
        _achievementRepo.Setup(r => r.GetAllAchievementsAsync()).ReturnsAsync(new List<Achievement> { achievement });
        _achievementRepo.Setup(r => r.HasUserAchievementAsync(1, 2)).ReturnsAsync(false);

        await _service.SubmitAnswerAsync(1, new AnswerSubmitDto { QuestionId = 1, Answer = "A" });

        _achievementRepo.Verify(r => r.UnlockAchievementAsync(1, 2), Times.Once);
    }

    // 8c. XP below the threshold -> does not unlock.
    [Fact]
    public async Task SubmitAnswerAsync_XPBelowThreshold_DoesNotUnlockAchievement()
    {
        var user = CreateTestUser(id: 1, xp: 50, streak: 0, lastStreakDate: null); // newXP = 60
        var question = CreateQuestion(1, categoryId: 1, correctAnswer: "A");
        var achievement = CreateAchievement(id: 2, name: "Road Rookie", xpRequired: 100);

        _questionRepo.Setup(r => r.GetQuestionByIdAsync(1)).ReturnsAsync(question);
        _userRepo.Setup(r => r.GetUserByIdAsync(1)).ReturnsAsync(user);
        _achievementRepo.Setup(r => r.GetAllAchievementsAsync()).ReturnsAsync(new List<Achievement> { achievement });

        await _service.SubmitAnswerAsync(1, new AnswerSubmitDto { QuestionId = 1, Answer = "A" });

        _achievementRepo.Verify(r => r.UnlockAchievementAsync(It.IsAny<int>(), 2), Times.Never);
    }

    // 8d. XP meets the threshold but already unlocked -> must not unlock again.
    [Fact]
    public async Task SubmitAnswerAsync_XPMeetsThresholdButAlreadyUnlocked_DoesNotUnlockAgain()
    {
        var user = CreateTestUser(id: 1, xp: 90, streak: 0, lastStreakDate: null); // newXP = 100
        var question = CreateQuestion(1, categoryId: 1, correctAnswer: "A");
        var achievement = CreateAchievement(id: 2, name: "Road Rookie", xpRequired: 100);

        _questionRepo.Setup(r => r.GetQuestionByIdAsync(1)).ReturnsAsync(question);
        _userRepo.Setup(r => r.GetUserByIdAsync(1)).ReturnsAsync(user);
        _achievementRepo.Setup(r => r.GetAllAchievementsAsync()).ReturnsAsync(new List<Achievement> { achievement });
        _achievementRepo.Setup(r => r.HasUserAchievementAsync(1, 2)).ReturnsAsync(true);

        await _service.SubmitAnswerAsync(1, new AnswerSubmitDto { QuestionId = 1, Answer = "A" });

        _achievementRepo.Verify(r => r.UnlockAchievementAsync(It.IsAny<int>(), It.IsAny<int>()), Times.Never);
    }

    // 9. Mixed list: only the one qualifying achievement unlocks, none of the others do.
    [Fact]
    public async Task SubmitAnswerAsync_MixedAchievementList_OnlyUnlocksTheOneThatQualifies()
    {
        var yesterday = DateTime.UtcNow.Date.AddDays(-1);
        // newXP = 90+10 = 100 (qualifies for Road Rookie); newStreak = 2+1 = 3 (does not reach 7).
        var user = CreateTestUser(id: 1, xp: 90, streak: 2, lastStreakDate: yesterday);
        var question = CreateQuestion(1, categoryId: 1, correctAnswer: "A");

        var qualifyingXp = CreateAchievement(id: 2, name: "Road Rookie", xpRequired: 100);
        var nonQualifyingXp = CreateAchievement(id: 3, name: "Street Smart", xpRequired: 500);
        var streakAchievement = CreateAchievement(id: 9, name: "7 Day Streak", xpRequired: 0);
        var zeroXpAchievement = CreateAchievement(id: 6, name: "Night Owl", xpRequired: 0);

        _questionRepo.Setup(r => r.GetQuestionByIdAsync(1)).ReturnsAsync(question);
        _userRepo.Setup(r => r.GetUserByIdAsync(1)).ReturnsAsync(user);
        _achievementRepo.Setup(r => r.GetAllAchievementsAsync())
            .ReturnsAsync(new List<Achievement> { qualifyingXp, nonQualifyingXp, streakAchievement, zeroXpAchievement });
        _achievementRepo.Setup(r => r.HasUserAchievementAsync(It.IsAny<int>(), It.IsAny<int>())).ReturnsAsync(false);

        await _service.SubmitAnswerAsync(1, new AnswerSubmitDto { QuestionId = 1, Answer = "A" });

        _achievementRepo.Verify(r => r.UnlockAchievementAsync(1, 2), Times.Once);
        _achievementRepo.Verify(r => r.UnlockAchievementAsync(It.IsAny<int>(), It.IsAny<int>()), Times.Exactly(1));
    }
}
