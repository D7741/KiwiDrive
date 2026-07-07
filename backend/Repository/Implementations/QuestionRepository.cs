using KiwiDrive.Data;
using KiwiDrive.Models;
using KiwiDrive.Repository.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace KiwiDrive.Repository.Implementations
{
    public class QuestionRepository: IQuestionRepository
    {
        private readonly AppDbContext _context;

        public QuestionRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<Question> CreateQuestionAsync(Question question)
        {
            if (question == null)
                throw new ArgumentNullException(nameof(question), "Question cannot be null.");
            

            var existingQuestion = await _context.Questions.FirstOrDefaultAsync(q => q.Text == question.Text);

            if (existingQuestion != null)
                throw new InvalidOperationException($"A question with the text '{question.Text}' already exists.");
            

            await _context.Questions.AddAsync(question);
            await _context.SaveChangesAsync();
            return question;

        }

        public async Task<Question?> GetQuestionByIdAsync(int id)
        {
            if (id <= 0)
                throw new ArgumentException($"Question ID '{id}' is invalid.", nameof(id));
            
            return await _context.Questions.FindAsync(id);
        }

        public async Task<Question?> GetQuestionRandomAsync()
        {
            return await _context.Questions
                .OrderBy(q => Guid.NewGuid())
                .FirstOrDefaultAsync();
        }

        public async Task<List<Question>> GetQuestionsByCategoryAsync(int categoryId)
        {
            if (categoryId <= 0)
                throw new ArgumentException($"Category ID '{categoryId}' is invalid.", nameof(categoryId));
            
            return await _context.Questions
                .Where(q => q.CategoryId == categoryId)
                .ToListAsync();
        }

        public async Task<List<Question>> GetAllQuestionsAsync()
        {
            return await _context.Questions.ToListAsync();
        }

        public async Task<Question?> UpdateQuestionAsync(Question question)
        {
            if (question == null)
                throw new ArgumentNullException(nameof(question), "question cannot be null.");
            
            var existingQuestion = await _context.Questions.FindAsync(question.Id);

            if (existingQuestion == null) return null;

            existingQuestion.Text = question.Text;
            existingQuestion.OptionA = question.OptionA;
            existingQuestion.OptionB = question.OptionB;
            existingQuestion.OptionC = question.OptionC;
            existingQuestion.OptionD = question.OptionD;
            existingQuestion.CorrectAnswer = question.CorrectAnswer;
            existingQuestion.Explanation = question.Explanation; 

            await _context.SaveChangesAsync();
            return existingQuestion;
        }

        public async Task<bool> DeleteQuestionAsync(int id)
        {
            if (id <= 0) return false;

            var question = await _context.Questions.FindAsync(id);

            if (question == null) return false;

            _context.Questions.Remove(question);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}