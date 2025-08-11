using System.ComponentModel.DataAnnotations;

namespace MarketingSite.Models
{
    public class CreateRoleModel
    {
        [Required]
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
    }

    public class AssignRoleModel
    {
        [Required]
        public string UserId { get; set; } = string.Empty;
        [Required]
        public string RoleName { get; set; } = string.Empty;
    }

    public class RoleResponse
    {
        public string Id { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public string NormalizedName { get; set; } = string.Empty;
        public List<string> Users { get; set; } = new();
    }

    public class UserRoleResponse
    {
        public string UserId { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public List<string> Roles { get; set; } = new();
    }
}