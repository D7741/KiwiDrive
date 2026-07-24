using KiwiDrive.Dtos.DashboardDtos;

namespace KiwiDrive.Services.Interfaces
{
    public interface IDashboardService
    {
        Task<List<CategoryStatDto>> GetCategoryStatsAsync(int userId);
    }
}
