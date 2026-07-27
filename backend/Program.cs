using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Scalar.AspNetCore;
using Microsoft.EntityFrameworkCore;
using KiwiDrive.Data;
using KiwiDrive.Data.Seeders;
using KiwiDrive.Repository.Interfaces;
using KiwiDrive.Repository.Implementations;
using KiwiDrive.Services.Interfaces;
using KiwiDrive.Services.Implementations;
using KiwiDrive.Middleware;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddOpenApi();

builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<IQuestionRepository, QuestionRepository>();
builder.Services.AddScoped<IQuestionService, QuestionService>();
builder.Services.AddScoped<IAchievementRepository, AchievementRepository>();
builder.Services.AddScoped<IAchievementService, AchievementService>();
builder.Services.AddScoped<IUserProgressRepository, UserProgressRepository>();
builder.Services.AddScoped<IDashboardService, DashboardService>();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins(
            "http://localhost:5173",
            "https://happy-dune-06daefb00.7.azurestaticapps.net"
            )
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});



builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudience = builder.Configuration["Jwt:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]!))
        };
    });

// Register DbContext
var isAzure = Environment.GetEnvironmentVariable("WEBSITE_INSTANCE_ID") != null;
var dbPath = isAzure
    ? Path.Combine(Environment.GetEnvironmentVariable("HOME")!, "data", "kiwidrive.db")
    : "kiwidrive.db";

var dbDirectory = Path.GetDirectoryName(dbPath);
if (!string.IsNullOrEmpty(dbDirectory))
{
    Directory.CreateDirectory(dbDirectory);
}

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite($"Data Source={dbPath}"));

var app = builder.Build();

// temp data clean
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Database.Migrate();
    await QuestionSeeder.SeedAsync(db);

    // TEMPORARY: wipe all test accounts except the ones I want to keep for the demo video.
    // Remove this block after it runs once.
    var emailsToKeep = new[] { "username@example.com" };
    var usersToDelete = db.Users.Where(u => !emailsToKeep.Contains(u.Email)).ToList();
    db.Users.RemoveRange(usersToDelete);
    await db.SaveChangesAsync();
}

// Auto generate migrate and seed questions
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Database.Migrate();
    await QuestionSeeder.SeedAsync(db);

    // TEMPORARY: promote a specific account to Admin. Remove after running once.
    var adminUser = await db.Users.FirstOrDefaultAsync(u => u.Email == "username@example.com");
    if (adminUser != null && adminUser.Role != "Admin")
    {
        adminUser.Role = "Admin";
        await db.SaveChangesAsync();
    }
}
app.UseMiddleware<ExceptionMiddleware>();
app.UseCors("AllowFrontend");

app.MapOpenApi();
app.MapScalarApiReference();

app.UseHttpsRedirection();
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

app.Run();