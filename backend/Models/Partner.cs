using System.ComponentModel.DataAnnotations;

namespace MarketingSite.Models
{
    public class Partner
    {
        public int Id { get; set; }
        
        [Required]
        public string ImageId { get; set; } = string.Empty;
        
        [Required]
        public string Description { get; set; } = string.Empty;
        
        [Required]
        public string ContactName { get; set; } = string.Empty;
        
        [Required]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;
        
        public string Website { get; set; } = string.Empty;
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }

    public class CreatePartnerModel
    {
        [Required]
        public string ImageId { get; set; } = string.Empty;
        
        [Required]
        public string Description { get; set; } = string.Empty;
        
        [Required]
        public string ContactName { get; set; } = string.Empty;
        
        [Required]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;
        
        public string Website { get; set; } = string.Empty;
    }
}