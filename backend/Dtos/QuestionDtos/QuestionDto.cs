namespace KiwiDrive.Dtos.QuestionDtos
{
    public class QuestionDto
    {
        public int Id {get; set;}
        public string Text {get; set;} = string.Empty;

        public string OptionA {get; set;} = string.Empty;

        public string OptionB {get; set;} = string.Empty;

        public string OptionC {get; set;} = string.Empty;

        public string OptionD {get; set;} = string.Empty;

        public string CategoryName { get; set; } = string.Empty;

    }
}