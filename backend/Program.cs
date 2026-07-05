using Scalar.AspNetCore;
using Microsoft.EntityFrameworkCore;
using KiwiDrive.Data;
using KiwiDrive.Data.Seeders;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddOpenApi();

// Register DbContext
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite("Data Source=kiwidrive.db"));

var app = builder.Build();

// Auto generate migrate and seed questions
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Database.Migrate();
    await QuestionSeeder.SeedAsync(db);
}

app.MapOpenApi();
app.MapScalarApiReference();

app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();

app.Run();