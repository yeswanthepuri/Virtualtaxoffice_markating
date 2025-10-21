using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace Backend.Models
{
    [Table("resource_sections")]
    public class ResourceSection
    {
        [Key]
        [Column("section_id")]
        public long SectionId { get; set; }
        
        [Column("resource_id")]
        public long ResourceId { get; set; }
        
        [Column("parent_section_id")]
        public long? ParentSectionId { get; set; }
        
        [Required]
        [MaxLength(255)]
        public string Title { get; set; } = string.Empty;
        
        public string? Description { get; set; }
        
        [Column("deep_link")]
        public string? DeepLink { get; set; }
        
        [Column("sort_order")]
        public int SortOrder { get; set; }
        
        [Column("created_at")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        
        [Column("updated_at")]
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
        
        [JsonIgnore]
        public Resource? Resource { get; set; }
        [JsonIgnore]
        public ResourceSection? ParentSection { get; set; }
        public ICollection<ResourceSection> SubSections { get; set; } = new List<ResourceSection>();
    }
}