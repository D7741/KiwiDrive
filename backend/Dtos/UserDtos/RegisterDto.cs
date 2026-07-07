using System.ComponentModel.DataAnnotations;

namespace KiwiDrive.Dtos.UserDtos
{
    public class RegisterDto
    {
        [Required]
        public string Email {get; set;} = string.Empty;

        [Required]
        [MinLength(2)]
        public string UserName {get; set;} = string.Empty;

        [Required]
        [MinLength(6)]
        public string Password{get; set;} = string.Empty;
    }
}