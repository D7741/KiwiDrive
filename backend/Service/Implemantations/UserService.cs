using System.Text;
using KiwiDrive.Models;
using System.Security.Claims;
using KiwiDrive.Dtos.UserDtos;
using KiwiDrive.Dtos.LeaderboardDtos;
using KiwiDrive.Repository.Interfaces;
using System.IdentityModel.Tokens.Jwt;
using KiwiDrive.Services.Interfaces;
using Microsoft.IdentityModel.Tokens;

namespace KiwiDrive.Services.Implementations
{
    public class UserService: IUserService
    {
        private readonly IUserRepository _userRepository;
        private readonly IConfiguration _configuration;

        public UserService(IUserRepository userRepository, IConfiguration configuration)
        {
            _userRepository = userRepository;
            _configuration = configuration;
        }

        public async Task<AuthResponseDto> RegisterAsync(RegisterDto dto)
        {
            if (dto == null)
                throw new ArgumentNullException(nameof(dto), "Register cannot be null.");

            var existingUser = await _userRepository.GetUserByEmailAsync(dto.Email);

            if (existingUser != null)
                throw new InvalidOperationException($"User with email '{dto.Email}' already exists.");

            var user = new User
            {
                Email = dto.Email,
                Username = dto.Username,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password)
            };

            await _userRepository.CreateUserAsync(user);

            var token = GenerateJwtToken(user);

            return new AuthResponseDto
            {
                Token = token,
                User = MapToProfileDto(user)
            };
        }

        public async Task<AuthResponseDto> LoginAsync(LoginDto dto)
        {
            if (dto == null)
                throw new ArgumentNullException(nameof(dto), "Login cannot be null.");

            var user = await _userRepository.GetUserByEmailAsync(dto.Email);

            if (user == null || !BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash))
                throw new UnauthorizedAccessException("Invalid email or password.");

            var token = GenerateJwtToken(user);

            return new AuthResponseDto
            {
                Token = token,
                User = MapToProfileDto(user)
            };

        }

        public async Task<UserProfileDto?> GetUserProfileAsync(int id)
        {
            var user = await _userRepository.GetUserByIdAsync(id);
            if (user == null) return null;
            return MapToProfileDto(user); 
        }

        public async Task<UserProfileDto?> UpdateUserAsync(int id, UserUpdateDto dto)
        {
            var user = await _userRepository.GetUserByIdAsync(id);
            if (user == null) return null;

            // Coz repo is dealing a updated user as a parameter, so we have to pass a updated user here.
            user.Username = dto.Username;
            user.Email = dto.Email;

            var updatedUser = await _userRepository.UpdateUserAsync(user);
            if (updatedUser == null) return null;

            return MapToProfileDto(updatedUser);

        }

        public async Task<bool> DeleteUserAsync(int id)
        {
            return await _userRepository.DeleteUserAsync(id);
        }

        // Leaderboard
        public async Task<List<LeaderboardEntryDto>> GetLeaderboardAsync()
        {
            var users = await _userRepository.GetLeaderboardAsync();

            return users.Select((u, index) => new LeaderboardEntryDto
            {
                Rank = index + 1,
                Username = u.Username,
                XP = u.XP,
                Level = u.Level,
                Streak = u.Streak
            }).ToList();
        }



        // private helper

        private string GenerateJwtToken(User user)
        {
            var key = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]!));

            var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(ClaimTypes.Name, user.Username)
            };

            var token = new JwtSecurityToken(
                issuer: _configuration["Jwt:Issuer"],
                audience: _configuration["Jwt:Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddDays(
                    double.Parse(_configuration["Jwt:ExpiryDays"]!)),
                signingCredentials: credentials
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        private static UserProfileDto MapToProfileDto(User user) => new()
        {
            Id = user.Id,
            Username = user.Username,
            Email = user.Email,
            XP = user.XP,
            Level = user.Level,
            Streak = user.Streak
        };

    } 
}