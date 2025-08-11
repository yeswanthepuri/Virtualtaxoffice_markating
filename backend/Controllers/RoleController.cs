using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MarketingSite.Models;

namespace MarketingSite.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class RoleController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;

        public RoleController(UserManager<ApplicationUser> userManager, RoleManager<IdentityRole> roleManager)
        {
            _userManager = userManager;
            _roleManager = roleManager;
        }

        [HttpGet]
        public async Task<ActionResult<List<RoleResponse>>> GetRoles()
        {
            var roles = await _roleManager.Roles.ToListAsync();
            var roleResponses = new List<RoleResponse>();

            foreach (var role in roles)
            {
                var usersInRole = await _userManager.GetUsersInRoleAsync(role.Name);
                roleResponses.Add(new RoleResponse
                {
                    Id = role.Id,
                    Name = role.Name,
                    NormalizedName = role.NormalizedName,
                    Users = usersInRole.Select(u => u.Email).ToList()
                });
            }

            return Ok(roleResponses);
        }

        [HttpPost]
        public async Task<ActionResult> CreateRole(CreateRoleModel model)
        {
            if (await _roleManager.RoleExistsAsync(model.Name))
            {
                return BadRequest(new { message = "Role already exists" });
            }

            var role = new IdentityRole(model.Name);
            var result = await _roleManager.CreateAsync(role);

            if (result.Succeeded)
            {
                return Ok(new { message = "Role created successfully" });
            }

            return BadRequest(new { message = string.Join(", ", result.Errors.Select(e => e.Description)) });
        }

        [HttpDelete("{roleName}")]
        public async Task<ActionResult> DeleteRole(string roleName)
        {
            var role = await _roleManager.FindByNameAsync(roleName);
            if (role == null)
            {
                return NotFound(new { message = "Role not found" });
            }

            var result = await _roleManager.DeleteAsync(role);
            if (result.Succeeded)
            {
                return Ok(new { message = "Role deleted successfully" });
            }

            return BadRequest(new { message = string.Join(", ", result.Errors.Select(e => e.Description)) });
        }

        [HttpPost("assign")]
        public async Task<ActionResult> AssignRole(AssignRoleModel model)
        {
            var user = await _userManager.FindByIdAsync(model.UserId);
            if (user == null)
            {
                return NotFound(new { message = "User not found" });
            }

            if (!await _roleManager.RoleExistsAsync(model.RoleName))
            {
                return NotFound(new { message = "Role not found" });
            }

            var result = await _userManager.AddToRoleAsync(user, model.RoleName);
            if (result.Succeeded)
            {
                return Ok(new { message = "Role assigned successfully" });
            }

            return BadRequest(new { message = string.Join(", ", result.Errors.Select(e => e.Description)) });
        }

        [HttpPost("remove")]
        public async Task<ActionResult> RemoveRole(AssignRoleModel model)
        {
            var user = await _userManager.FindByIdAsync(model.UserId);
            if (user == null)
            {
                return NotFound(new { message = "User not found" });
            }

            var result = await _userManager.RemoveFromRoleAsync(user, model.RoleName);
            if (result.Succeeded)
            {
                return Ok(new { message = "Role removed successfully" });
            }

            return BadRequest(new { message = string.Join(", ", result.Errors.Select(e => e.Description)) });
        }

        [HttpGet("users")]
        public async Task<ActionResult<List<UserRoleResponse>>> GetUsersWithRoles()
        {
            var users = await _userManager.Users.ToListAsync();
            var userRoles = new List<UserRoleResponse>();

            foreach (var user in users)
            {
                var roles = await _userManager.GetRolesAsync(user);
                userRoles.Add(new UserRoleResponse
                {
                    UserId = user.Id,
                    Email = user.Email,
                    FirstName = user.FirstName,
                    LastName = user.LastName,
                    Roles = roles.ToList()
                });
            }

            return Ok(userRoles);
        }

        [HttpGet("user/{userId}")]
        public async Task<ActionResult<UserRoleResponse>> GetUserRoles(string userId)
        {
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
            {
                return NotFound(new { message = "User not found" });
            }

            var roles = await _userManager.GetRolesAsync(user);
            return Ok(new UserRoleResponse
            {
                UserId = user.Id,
                Email = user.Email,
                FirstName = user.FirstName,
                LastName = user.LastName,
                Roles = roles.ToList()
            });
        }
    }
}