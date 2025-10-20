using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace Backend.Models
{
    public class ResourceSection
    {
        public int Id { get; set; }
        
        public int ResourceId { get; set; }
        
        public int? ParentSectionId { get; set; }
        
        [MaxLength(255)]
        public string Title { get; set; } = string.Empty;
        
        public string? Description { get; set; }
        
        public int SortOrder { get; set; }
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
        
        [JsonIgnore]
        public Resource Resource { get; set; } = null!;
        [JsonIgnore]
        public ResourceSection? ParentSection { get; set; }
        public ICollection<ResourceSection> SubSections { get; set; } = new List<ResourceSection>();
    }
}