namespace KiwiDrive.Dtos
{
    public class AuthResponseDto
    {
        public string Token { get; set; } = string.Empty;
        public UserProfileDto User { get; set; } = null!;
    }
}