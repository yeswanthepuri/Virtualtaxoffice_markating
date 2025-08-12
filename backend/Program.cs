using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using MarketingSite.Data;
using MarketingSite.Models;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

// Add Identity
builder.Services.AddIdentity<ApplicationUser, IdentityRole>(options =>
{
    options.Password.RequireDigit = true;
    options.Password.RequireLowercase = true;
    options.Password.RequireUppercase = true;
    options.Password.RequireNonAlphanumeric = false;
    options.Password.RequiredLength = 6;
    options.User.RequireUniqueEmail = true;
})
.AddEntityFrameworkStores<ApplicationDbContext>()
.AddDefaultTokenProviders();

// Add JWT Authentication
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
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
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]))
    };
});

// Add Authorization Policies
builder.Services.AddAuthorization();

// Add MinIO Service
builder.Services.AddSingleton<MarketingSite.Services.MinIOService>();

builder.Services.AddControllers();
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
        policy.WithOrigins("http://localhost:4200", "https://vtobackend.coolify.marthand.org", "https://vto.coolify.marthand.org")
              .AllowAnyMethod()
              .AllowAnyHeader()
              .AllowCredentials());
});

var app = builder.Build();

// Initialize database and seed roles
using (var scope = app.Services.CreateScope())
{
    try
    {
        var identityContext = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
        
        Console.WriteLine("Creating database with all tables...");
        
        // Create database with all tables (Identity + custom)
        identityContext.Database.EnsureCreated();
        
        Console.WriteLine("Database created successfully");
        
        // Seed roles
        // var roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<IdentityRole>>();
        // var roles = new[] { "Admin", "User", "Manager" };
        
        // Console.WriteLine("Seeding roles...");
        // // foreach (var role in roles)
        // // {
        // //     if (!await roleManager.RoleExistsAsync(role))
        // //     {
        // //         await roleManager.CreateAsync(new IdentityRole(role));
        // //         Console.WriteLine($"Created role: {role}");
        // //     }
        // // }
        
        // Console.WriteLine("Database initialization completed successfully");
    }
    catch (Exception ex)
    {
        Console.WriteLine($"Database initialization error: {ex.Message}");
        // Continue startup
    }
}
app.UseCors();
app.UseAuthentication();
app.UseAuthorization();

// Add a simple health check endpoint
app.MapGet("/api/health", async (HttpContext context) => 
{
    try
    {
        var dbContext = context.RequestServices.GetRequiredService<ApplicationDbContext>();
        var canConnect = await dbContext.Database.CanConnectAsync();
        
        var result = new { 
            status = "healthy", 
            database = canConnect ? "connected" : "disconnected",
            timestamp = DateTime.UtcNow
        };
        
        await context.Response.WriteAsJsonAsync(result);
    }
    catch (Exception ex)
    {
        var result = new { 
            status = "unhealthy", 
            error = ex.Message,
            timestamp = DateTime.UtcNow
        };
        
        await context.Response.WriteAsJsonAsync(result);
    }
});

app.MapControllers();

app.Run();

public class User
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
}