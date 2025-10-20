using System.ComponentModel.DataAnnotations;

namespace Backend.Models
{
    public enum ResourceStatus
    {
        Draft,
        Published,
        Archive
    }

    public class Resource
    {
        public int Id { get; set; }
        
        [MaxLength(50)]
        public string LinkDescription { get; set; } = string.Empty;
        
        [MaxLength(100)]
        public string LinkShortDescription { get; set; } = string.Empty;
        
        [MaxLength(500)]
        public string ResourceTitle { get; set; } = string.Empty;
        
        [MaxLength(5000)]
        public string ResourceShortDescription { get; set; } = string.Empty;
        
        [MaxLength(10000)]
        public string ResourceDetails { get; set; } = string.Empty;
        
        public ResourceStatus Status { get; set; } = ResourceStatus.Draft;
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    }

    public class ResourceDetails
    {
        public int Id { get; set; }
        public int ResourceId { get; set; }
        public string JsonData { get; set; } = string.Empty;
        
        public Resource Resource { get; set; } = null!;
    }
}