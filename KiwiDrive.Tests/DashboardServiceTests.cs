using KiwiDrive.Models;
using KiwiDrive.Repository.Interfaces;
using KiwiDrive.Services.Implementations;
using Moq;

namespace KiwiDrive.Tests;

public class DashboardServiceTests
{
    private readonly Mock<IQuestionRepository> _questionRepo = new();
    private readonly Mock<IUserProgressRepository> _progressRepo = new();
    private readonly DashboardService _service;

    public DashboardServiceTests()
    {
        _service = new DashboardService(_questionRepo.Object, _progressRepo.Object);
    }

    private static Question MakeQuestion(int id, int categoryId, string categoryName) => new()
    {
        Id = id,
        Text = $"Question {id}",
        OptionA = "A",
        OptionB = "B",
        OptionC = "C",
        OptionD = "D",
        CorrectAnswer = "A",
        CategoryId = categoryId,
        Category = new Category { Id = categoryId, Name = categoryName }
    };

    private static UserProgress MakeProgress(int userId, int categoryId, int totalAnswered, int totalCorrect) => new()
    {
        UserId = userId,
        CategoryId = categoryId,
        TotalAnswered = totalAnswered,
        TotalCorrect = totalCorrect
    };

    private void SetupQuestions(List<Question> questions) =>
        _questionRepo.Setup(r => r.GetAllQuestionsAsync()).ReturnsAsync(questions);

    private void SetupProgress(List<UserProgress> progress) =>
        _progressRepo.Setup(r => r.GetByUserAsync(It.IsAny<int>())).ReturnsAsync(progress);

    // 1. Empty / boundary: brand-new user, no progress rows at all.
    [Fact]
    public async Task GetCategoryStatsAsync_UserWithNoProgress_ReturnsZeroForAllCategories()
    {
        SetupQuestions(new List<Question>
        {
            MakeQuestion(1, 1, "Road Signs"),
            MakeQuestion(2, 1, "Road Signs"),
            MakeQuestion(3, 2, "Speed Limits"),
        });
        SetupProgress(new List<UserProgress>());

        var result = await _service.GetCategoryStatsAsync(userId: 42);

        Assert.Equal(2, result.Count);
        Assert.All(result, c =>
        {
            Assert.Equal(0, c.Progress);
            Assert.Equal(0, c.Accuracy);
            Assert.Equal(0, c.AnsweredQuestions);
        });
    }

    // 2. Hidden branch: one of several categories has no UserProgress row.
    [Fact]
    public async Task GetCategoryStatsAsync_OneCategoryHasNoProgressRecord_DoesNotThrowAndReturnsZero()
    {
        SetupQuestions(new List<Question>
        {
            MakeQuestion(1, 1, "Road Signs"),
            MakeQuestion(2, 1, "Road Signs"),
            MakeQuestion(3, 2, "Speed Limits"),
        });
        SetupProgress(new List<UserProgress>
        {
            MakeProgress(userId: 1, categoryId: 1, totalAnswered: 2, totalCorrect: 1)
        });

        var result = await _service.GetCategoryStatsAsync(userId: 1);

        var roadSigns = result.Single(c => c.CategoryId == 1);
        Assert.Equal(100, roadSigns.Progress);
        Assert.Equal(50, roadSigns.Accuracy);

        var speedLimits = result.Single(c => c.CategoryId == 2);
        Assert.Equal(0, speedLimits.Progress);
        Assert.Equal(0, speedLimits.Accuracy);
        Assert.Equal(0, speedLimits.AnsweredQuestions);
    }

    // 3. Normal calculation path, including uneven division / rounding.
    [Theory]
    [InlineData(3, 1, 1, 33, 100)]  // 1/3 answered -> 33%,  1/1 correct -> 100%
    [InlineData(3, 3, 2, 100, 67)]  // 3/3 answered -> 100%, 2/3 correct -> 67%
    [InlineData(6, 1, 0, 17, 0)]    // 1/6 answered -> 17%,  0/1 correct -> 0%
    public async Task GetCategoryStatsAsync_UnevenDivision_RoundsPercentagesToNearestInt(
        int totalQuestions, int totalAnswered, int totalCorrect, int expectedProgress, int expectedAccuracy)
    {
        var questions = Enumerable.Range(1, totalQuestions)
            .Select(i => MakeQuestion(i, categoryId: 1, categoryName: "Road Signs"))
            .ToList();
        SetupQuestions(questions);
        SetupProgress(new List<UserProgress> { MakeProgress(1, 1, totalAnswered, totalCorrect) });

        var result = await _service.GetCategoryStatsAsync(userId: 1);

        var stat = Assert.Single(result);
        Assert.Equal(expectedProgress, stat.Progress);
        Assert.Equal(expectedAccuracy, stat.Accuracy);
    }

    // 4a. Progress must clamp at 100, not overshoot past repeated attempts.
    [Fact]
    public async Task GetCategoryStatsAsync_AnsweredExceedsTotalQuestions_ClampsProgressAt100()
    {
        var questions = Enumerable.Range(1, 10).Select(i => MakeQuestion(i, 1, "Road Signs")).ToList();
        SetupQuestions(questions);
        SetupProgress(new List<UserProgress> { MakeProgress(1, 1, totalAnswered: 25, totalCorrect: 20) });

        var result = await _service.GetCategoryStatsAsync(userId: 1);

        Assert.Equal(100, Assert.Single(result).Progress);
    }

    // 4b. Boundary: answered == total should be exactly 100, not clipped below it.
    [Fact]
    public async Task GetCategoryStatsAsync_AnsweredEqualsTotalQuestions_ProgressIsExactly100()
    {
        var questions = Enumerable.Range(1, 10).Select(i => MakeQuestion(i, 1, "Road Signs")).ToList();
        SetupQuestions(questions);
        SetupProgress(new List<UserProgress> { MakeProgress(1, 1, totalAnswered: 10, totalCorrect: 10) });

        var result = await _service.GetCategoryStatsAsync(userId: 1);

        Assert.Equal(100, Assert.Single(result).Progress);
    }

    // 5. Accuracy must guard the zero-answered case, even if TotalCorrect is
    // (impossibly, in practice) non-zero.
    [Fact]
    public async Task GetCategoryStatsAsync_ZeroAnswered_AccuracyIsZeroEvenIfTotalCorrectIsNonZero()
    {
        SetupQuestions(new List<Question> { MakeQuestion(1, 1, "Road Signs") });
        SetupProgress(new List<UserProgress> { MakeProgress(1, 1, totalAnswered: 0, totalCorrect: 5) });

        var result = await _service.GetCategoryStatsAsync(userId: 1);

        var stat = Assert.Single(result);
        Assert.Equal(0, stat.Accuracy);
        Assert.Equal(0, stat.Progress);
    }

    // 6. Multiple categories: output sorted by CategoryId, per-category counts isolated.
    [Fact]
    public async Task GetCategoryStatsAsync_MultipleCategoriesOutOfOrder_ReturnsResultsOrderedByCategoryId()
    {
        var questions = new List<Question>
        {
            MakeQuestion(1, 3, "Night Driving"),
            MakeQuestion(2, 3, "Night Driving"),
            MakeQuestion(3, 1, "Road Signs"),
            MakeQuestion(4, 2, "Speed Limits"),
            MakeQuestion(5, 2, "Speed Limits"),
            MakeQuestion(6, 2, "Speed Limits"),
        };
        SetupQuestions(questions);
        SetupProgress(new List<UserProgress>());

        var result = await _service.GetCategoryStatsAsync(userId: 1);

        Assert.Equal(new[] { 1, 2, 3 }, result.Select(c => c.CategoryId).ToArray());
        Assert.Equal(1, result.Single(c => c.CategoryId == 1).TotalQuestions);
        Assert.Equal(3, result.Single(c => c.CategoryId == 2).TotalQuestions);
        Assert.Equal(2, result.Single(c => c.CategoryId == 3).TotalQuestions);
    }

    // 7. CategoryName falls back to string.Empty when Category navigation wasn't loaded.
    [Fact]
    public async Task GetCategoryStatsAsync_QuestionWithNullCategory_CategoryNameFallsBackToEmptyString()
    {
        var question = new Question
        {
            Id = 1,
            Text = "Question 1",
            OptionA = "A",
            OptionB = "B",
            OptionC = "C",
            OptionD = "D",
            CorrectAnswer = "A",
            CategoryId = 1,
            Category = null!
        };
        SetupQuestions(new List<Question> { question });
        SetupProgress(new List<UserProgress>());

        var result = await _service.GetCategoryStatsAsync(userId: 1);

        Assert.Equal(string.Empty, Assert.Single(result).CategoryName);
    }

    // Extra: confirms the userId passed in is the one actually used to look up progress.
    [Fact]
    public async Task GetCategoryStatsAsync_PassesGivenUserIdToProgressRepository()
    {
        SetupQuestions(new List<Question> { MakeQuestion(1, 1, "Road Signs") });
        SetupProgress(new List<UserProgress>());

        await _service.GetCategoryStatsAsync(userId: 99);

        _progressRepo.Verify(r => r.GetByUserAsync(99), Times.Once);
    }
}
