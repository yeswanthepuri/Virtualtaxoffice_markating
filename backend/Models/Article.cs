using System.ComponentModel.DataAnnotations;

namespace Backend.Models
{
    public enum ArticleStatus
    {
        Draft,
        Published,
        Archive
    }

    public class Article
    {
        public int Id { get; set; }
        
        [MaxLength(50)]
        public string LinkDescription { get; set; } = string.Empty;
        
        [MaxLength(100)]
        public string LinkShortDescription { get; set; } = string.Empty;
        
        [MaxLength(500)]
        public string ArticleTitle { get; set; } = string.Empty;
        
        [MaxLength(5000)]
        public string ArticleShortDescription { get; set; } = string.Empty;
        
        [MaxLength(10000)]
        public string ArticleDetails { get; set; } = string.Empty;
        
        public ArticleStatus Status { get; set; } = ArticleStatus.Draft;
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    }

    public class ArticleDetails
    {
        public int Id { get; set; }
        public int ArticleId { get; set; }
        public string JsonData { get; set; } = string.Empty;
        
        public Article Article { get; set; } = null!;
    }
}