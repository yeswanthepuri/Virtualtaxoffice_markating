using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using MarketingSite.Models;
using Backend.Models;

namespace MarketingSite.Data
{
    public class ApplicationDbContext : IdentityDbContext<ApplicationUser>
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {
        }
        
        public DbSet<Partner> Partners { get; set; }
        public DbSet<User> SimpleUsers { get; set; }
        public DbSet<Article> Articles { get; set; }
        public DbSet<ArticleDetails> ArticleDetails { get; set; }
        public DbSet<Resource> Resources { get; set; }

        public DbSet<ResourceSection> ResourceSections { get; set; }
        public DbSet<Country> Countries { get; set; }
        public DbSet<State> States { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);
            
            // Configure ApplicationUser
            builder.Entity<ApplicationUser>(entity =>
            {
                entity.Property(e => e.FirstName).HasMaxLength(100);
                entity.Property(e => e.LastName).HasMaxLength(100);
            });
            
            // Configure ArticleDetails relationship
            builder.Entity<ArticleDetails>(entity =>
            {
                entity.HasOne(ad => ad.Article)
                      .WithMany()
                      .HasForeignKey(ad => ad.ArticleId)
                      .OnDelete(DeleteBehavior.Cascade);
            });
            

            // Configure ResourceSection relationships
            builder.Entity<ResourceSection>(entity =>
            {
                entity.HasOne(rs => rs.Resource)
                      .WithMany(r => r.Sections)
                      .HasForeignKey(rs => rs.ResourceId)
                      .OnDelete(DeleteBehavior.Cascade);
                      
                entity.HasOne(rs => rs.ParentSection)
                      .WithMany(rs => rs.SubSections)
                      .HasForeignKey(rs => rs.ParentSectionId)
                      .OnDelete(DeleteBehavior.Restrict);
            });
            
            // Configure State-Country relationship
            builder.Entity<State>(entity =>
            {
                entity.HasOne(s => s.Country)
                      .WithMany(c => c.States)
                      .HasForeignKey(s => s.CountryId)
                      .OnDelete(DeleteBehavior.Cascade);
            });
        }
    }
}