using Microsoft.AspNetCore.Mvc;
using KiwiDrive.Services.Interfaces;
using KiwiDrive.Dtos.LeaderboardDtos;

namespace KiwiDrive.Controllers
{
    [Route("api/leaderboard")]
    [ApiController]

    public class LeaderboardController : ControllerBase
    {
        private readonly IUserService _userService;

        public LeaderboardController(IUserService userService)
        {
            _userService = userService;
        }

        // GET /api/leaderboard
        [HttpGet]
        public async Task<IActionResult> GetLeaderboard()
        {
            try
            {
                var leaderboard = await _userService.GetLeaderboardAsync();
                return Ok(leaderboard);
            }
            catch (Exception)
            {
                return StatusCode(500, new { error = "An error occurred while retrieving leaderboard." });
            }
        }
    }
}