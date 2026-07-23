using KiwiDrive.Dtos.QuestionDtos;
using KiwiDrive.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace KiwiDrive.Controllers
{
    [Route("api/admin")]
    [ApiController]
    [Authorize]
    public class AdminController : ControllerBase
    {
        private readonly IQuestionService _questionService;

        public AdminController(IQuestionService questionService)
        {
            _questionService = questionService;
        }

        // POST /api/admin/questions
        [HttpPost("questions")]
        public async Task<IActionResult> CreateQuestion([FromBody] CreateQuestionDto dto)
        {
            try
            {
                var role = User.FindFirst(System.Security.Claims.ClaimTypes.Role)?.Value;
                if (role != "Admin")
                    return Forbid();

                var question = await _questionService.CreateQuestionAsync(dto);
                return Ok(question);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { error = ex.Message });
            }
            catch (Exception)
            {
                return StatusCode(500, new { error = "An error occurred while creating question." });
            }
        }

        // PUT /api/admin/questions/{id}
        [HttpPut("questions/{id}")]
        public async Task<IActionResult> UpdateQuestion(int id, [FromBody] CreateQuestionDto dto)
        {
            try
            {
                var question = await _questionService.UpdateQuestionAsync(id, dto);
                if (question == null)
                    return NotFound(new { error = $"Question with ID '{id}' does not exist." });

                return Ok(question);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { error = ex.Message });
            }
            catch (Exception)
            {
                return StatusCode(500, new { error = "An error occurred while updating question." });
            }
        }

        // DELETE /api/admin/questions/{id}
        [HttpDelete("questions/{id}")]
        public async Task<IActionResult> DeleteQuestion(int id)
        {
            try
            {
                var result = await _questionService.DeleteQuestionAsync(id);
                if (!result)
                    return NotFound(new { error = $"Question with ID '{id}' does not exist." });

                return NoContent();
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { error = ex.Message });
            }
            catch (Exception)
            {
                return StatusCode(500, new { error = "An error occurred while deleting question." });
            }
        }
    }
}