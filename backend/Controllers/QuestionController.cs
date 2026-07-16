using KiwiDrive.Dtos.QuestionDtos;
using KiwiDrive.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace KiwiDrive.Controllers
{
    [Route("api/questions")]
    [ApiController]

    public class QuestionController : ControllerBase
    {
        private readonly IQuestionService _questionService;

        public QuestionController(IQuestionService questionService)
        {
            _questionService = questionService;
        }

        // GET  /api/questions
        [HttpGet]
        public async Task<IActionResult> GetAllQuestions()
        {
            try
            {
                var questions = await _questionService.GetAllQuestionsAsync();
                return Ok(questions);
            }
            catch (Exception)
            {
                return StatusCode(500, new { error = "An error occurred while retrieving questions." });
            }
        }

        // GET  /api/questions/random
        [HttpGet("random")]
        public async Task<IActionResult> GetRandomQuestion()
        {
            try
            {
                var question = await _questionService.GetRandomQuestionAsync();
                if (question == null)
                    return NotFound(new { error = "No questions available." });

                return Ok(question);
            }
            catch (Exception)
            {
                return StatusCode(500, new { error = "An error occurred while retrieving random question." });
            }
        }

        // GET  /api/questions/category/{categoryId}
        [HttpGet("category/{categoryId}")]
        public async Task<IActionResult> GetQuestionsByCategory(int categoryId)
        {
            try
            {
                var questions = await _questionService.GetQuestionsByCategoryAsync(categoryId);
                return Ok(questions);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { error = ex.Message });
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { error = ex.Message });
            }
        }

        // POST /api/questions/answer
        [HttpPost("answer")]
        public async Task<IActionResult> SubmitAnswer([FromBody] AnswerSubmitDto dto)
        {
            // Gain user id from JWT TOKEN.
            var userId = int.Parse(User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)!.Value);
            
            try
            {
                var result = await _questionService.SubmitAnswerAsync(userId, dto);
                return Ok(result);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { error = ex.Message });
            }
            catch (Exception)
            {
                return StatusCode(500, new { error = "An error occurred while submitting answer." });
            }
        }
    }
}