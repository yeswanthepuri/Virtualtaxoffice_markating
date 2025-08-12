using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using MarketingSite.Data;

namespace MarketingSite.Services
{
    public class DatabaseInitializationService
    {
        private readonly ApplicationDbContext _context;
        private readonly RoleManager<IdentityRole> _roleManager;
        private readonly ILogger<DatabaseInitializationService> _logger;

        public DatabaseInitializationService(
            ApplicationDbContext context,
            RoleManager<IdentityRole> roleManager,
            ILogger<DatabaseInitializationService> logger)
        {
            _context = context;
            _roleManager = roleManager;
            _logger = logger;
        }

        public async Task InitializeAsync()
        {
            try
            {
                _logger.LogInformation("Creating database with all tables...");
                
                // Apply migrations
                await _context.Database.MigrateAsync();
                
                _logger.LogInformation("Database created successfully");
                
                // Seed roles
                await SeedRolesAsync();
                
                _logger.LogInformation("Database initialization completed successfully");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Database initialization error: {Message}", ex.Message);
                throw;
            }
        }

        private async Task SeedRolesAsync()
        {
            var roles = new[] { "Admin", "User", "Manager" };
            
            _logger.LogInformation("Seeding roles...");
            
            foreach (var role in roles)
            {
                if (!await _roleManager.RoleExistsAsync(role))
                {
                    await _roleManager.CreateAsync(new IdentityRole(role));
                    _logger.LogInformation("Created role: {Role}", role);
                }
            }
        }
    }
}