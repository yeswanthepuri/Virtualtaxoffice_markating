using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Backend.Models
{
    [Table("resources")]
    public class Resource
    {
        [Key]
        [Column("resource_id")]
        public long ResourceId { get; set; }
        
        [Required]
        [MaxLength(255)]
        public string Title { get; set; } = string.Empty;
        
        public string? Description { get; set; }
        
        [Column("created_at")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        
        [Column("updated_at")]
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
        
        public ICollection<ResourceSection> Sections { get; set; } = new List<ResourceSection>();
    }
}