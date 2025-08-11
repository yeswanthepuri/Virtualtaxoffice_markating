using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using MarketingSite.Data;
using MarketingSite.Models;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

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
        policy.WithOrigins("http://localhost:4200", "https://vto.marthand.org", "http://localhost:8081")
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
        var appContext = scope.ServiceProvider.GetRequiredService<AppDbContext>();
        var identityContext = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
        
        Console.WriteLine("Testing database connection...");
        
        // Test connection
        if (appContext.Database.CanConnect())
        {
            Console.WriteLine("Database connection successful");
        }
        else
        {
            Console.WriteLine("Database connection failed");
            throw new Exception("Cannot connect to database");
        }
        
        Console.WriteLine("Checking migrations...");
        
        // Check AppDbContext migrations
        var appPendingMigrations = appContext.Database.GetPendingMigrations().ToList();
        var appAppliedMigrations = appContext.Database.GetAppliedMigrations().ToList();
        Console.WriteLine($"AppDbContext - Applied: {appAppliedMigrations.Count}, Pending: {appPendingMigrations.Count}");
        
        if (appPendingMigrations.Any())
        {
            Console.WriteLine($"Applying {appPendingMigrations.Count} app migrations: {string.Join(", ", appPendingMigrations)}");
            appContext.Database.Migrate();
        }
        
        // Check ApplicationDbContext migrations
        var identityPendingMigrations = identityContext.Database.GetPendingMigrations().ToList();
        var identityAppliedMigrations = identityContext.Database.GetAppliedMigrations().ToList();
        Console.WriteLine($"ApplicationDbContext - Applied: {identityAppliedMigrations.Count}, Pending: {identityPendingMigrations.Count}");
        
        if (identityPendingMigrations.Any())
        {
            Console.WriteLine($"Applying {identityPendingMigrations.Count} identity migrations: {string.Join(", ", identityPendingMigrations)}");
            identityContext.Database.Migrate();
        }
        else
        {
            Console.WriteLine("No pending identity migrations found. Checking if tables exist...");
            var tablesExist = identityContext.Database.CanConnect() && 
                             identityContext.Database.SqlQueryRaw<int>("SELECT COUNT(*) FROM information_schema.tables WHERE table_name = 'AspNetRoles'").FirstOrDefault() > 0;
            Console.WriteLine($"AspNetRoles table exists: {tablesExist}");
            
            if (!tablesExist)
            {
                Console.WriteLine("Identity tables don't exist. Creating database...");
                identityContext.Database.EnsureCreated();
            }
        }
        
        Console.WriteLine("Migrations applied successfully");
        
        // Seed roles
        var roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<IdentityRole>>();
        var roles = new[] { "Admin", "User", "Manager" };
        
        Console.WriteLine("Seeding roles...");
        foreach (var role in roles)
        {
            if (!await roleManager.RoleExistsAsync(role))
            {
                await roleManager.CreateAsync(new IdentityRole(role));
                Console.WriteLine($"Created role: {role}");
            }
            else
            {
                Console.WriteLine($"Role already exists: {role}");
            }
        }
        
        Console.WriteLine("Database initialization completed successfully");
    }
    catch (Exception ex)
    {
        Console.WriteLine($"Database initialization error: {ex.Message}");
        Console.WriteLine($"Stack trace: {ex.StackTrace}");
        // Continue startup even if seeding fails
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
        var appContext = context.RequestServices.GetRequiredService<AppDbContext>();
        var identityContext = context.RequestServices.GetRequiredService<ApplicationDbContext>();
        
        var canConnectApp = await appContext.Database.CanConnectAsync();
        var canConnectIdentity = await identityContext.Database.CanConnectAsync();
        
        var result = new { 
            status = "healthy", 
            database = new {
                appContext = canConnectApp ? "connected" : "disconnected",
                identityContext = canConnectIdentity ? "connected" : "disconnected"
            },
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

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }
    public DbSet<User> Users { get; set; }
}

public class User
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
}