using System.ComponentModel.DataAnnotations;

namespace MarketingSite.Models
{
    public class PolicyModel
    {
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public List<string> RequiredRoles { get; set; } = new();
        public List<string> RequiredClaims { get; set; } = new();
    }

    public class CreatePolicyModel
    {
        [Required]
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public List<string> RequiredRoles { get; set; } = new();
        public List<string> RequiredClaims { get; set; } = new();
    }

    public class UserPermissionModel
    {
        public string UserId { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public List<string> Roles { get; set; } = new();
        public Dictionary<string, bool> Policies { get; set; } = new();
    }
}