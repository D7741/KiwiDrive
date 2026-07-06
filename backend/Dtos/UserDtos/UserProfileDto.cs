namespace KiwiDrive.Dtos
{
    public class UserProfileDto
    {
        public int Id {get; set;}
        
        public string UserName {get; set;} = string.Empty;

        public string Email {get; set;} = string.Empty;

        public int XP {get; set;}

        public int Level {get; set;}

        public int Streak {get; set;}
    }
}