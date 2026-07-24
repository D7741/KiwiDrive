using System.Security.Claims;
using KiwiDrive.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace KiwiDrive.Controllers
{
    [Route("api/dashboard")]
    [ApiController]
    public class DashboardController : ControllerBase
    {
        private readonly IDashboardService _dashboardService;

        public DashboardController(IDashboardService dashboardService)
        {
            _dashboardService = dashboardService;
        }

        /// <summary>
        /// Returns the current user's progress (% of questions answered) and
        /// accuracy (% answered correctly) for every category.
        /// </summary>
        // GET /api/dashboard/category-stats
        [Authorize]
        [HttpGet("category-stats")]
        public async Task<IActionResult> GetCategoryStats()
        {
            try
            {
                var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
                var stats = await _dashboardService.GetCategoryStatsAsync(userId);
                return Ok(stats);
            }
            catch (Exception)
            {
                return StatusCode(500, new { error = "An error occurred while retrieving category stats." });
            }
        }
    }
}
