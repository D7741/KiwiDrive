using KiwiDrive.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace KiwiDrive.Controllers
{
    [Route("api/achievements")]
    [ApiController]
    public class AchievementController : ControllerBase
    {
        private readonly IAchievementService _achievementService;

        public AchievementController(IAchievementService achievementService)
        {
            _achievementService = achievementService;
        }

        // GET /api/achievements
        [HttpGet]
        public async Task<IActionResult> GetAllAchievements()
        {
            try
            {
                var achievements = await _achievementService.GetAllAchievementsAsync();
                return Ok(achievements);
            }
            catch (Exception)
            {
                return StatusCode(500, new { error = "An error occurred while retrieving achievements." });
            }
        }

        // GET /api/achievements/user
        [Authorize]
        [HttpGet("user")]
        public async Task<IActionResult> GetUserAchievements()
        {
            try
            {
                var userId = int.Parse(User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)!.Value);
                var achievements = await _achievementService.GetUserAchievementsAsync(userId);
                return Ok(achievements);
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

    }
}