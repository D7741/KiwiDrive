namespace KiwiDrive.Dtos.QuestionDtos
{
    public class AnswerResuleDto
    {
        public bool IsCorrect {get; set;}

        public string CorrectAnswer {get; set;} = string.Empty;

        public string Explanation {get; set;} = string.Empty;

        public int XPEarned { get; set; }

    }
}