using System.ComponentModel.DataAnnotations;

namespace KiwiDrive.DTOs
{
    public class RegisterDTOs
    {
        [Required]
        public string Email {get; set;} = string.Empty;

        [Required]
        [MinLength(2)]
        public string UserName {get; set;} = string.Empty;

        [Required]
        [MinLength(6)]
        public string PasswordHash {get; set;} = string.Empty;
    }
}