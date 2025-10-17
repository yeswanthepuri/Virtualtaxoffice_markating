using System.ComponentModel.DataAnnotations;

namespace Backend.Models
{
    public class Country
    {
        public int Id { get; set; }
        
        [MaxLength(100)]
        public string Name { get; set; } = string.Empty;
        
        [MaxLength(3)]
        public string Code { get; set; } = string.Empty;
        
        public bool IsActive { get; set; } = true;
        
        public ICollection<State> States { get; set; } = new List<State>();
    }

    public class State
    {
        public int Id { get; set; }
        
        [MaxLength(100)]
        public string Name { get; set; } = string.Empty;
        
        [MaxLength(10)]
        public string Code { get; set; } = string.Empty;
        
        public int CountryId { get; set; }
        public Country Country { get; set; } = null!;
        
        public bool IsActive { get; set; } = true;
    }
}