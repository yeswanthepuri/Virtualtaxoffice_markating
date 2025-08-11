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
    public class UserRoleManagementController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;
        private readonly IAuthorizationService _authorizationService;

        public UserRoleManagementController(
            UserManager<ApplicationUser> userManager, 
            RoleManager<IdentityRole> roleManager,
            IAuthorizationService authorizationService)
        {
            _userManager = userManager;
            _roleManager = roleManager;
            _authorizationService = authorizationService;
        }

        [HttpGet("users-roles")]
        public async Task<ActionResult<List<UserRoleResponse>>> GetAllUsersWithRoles()
        {
            var users = await _userManager.Users.ToListAsync();
            var result = new List<UserRoleResponse>();

            foreach (var user in users)
            {
                var roles = await _userManager.GetRolesAsync(user);
                result.Add(new UserRoleResponse
                {
                    UserId = user.Id,
                    Email = user.Email,
                    FirstName = user.FirstName,
                    LastName = user.LastName,
                    Roles = roles.ToList()
                });
            }

            return Ok(result);
        }

        [HttpPost("bulk-assign")]
        public async Task<ActionResult> BulkAssignRoles([FromBody] List<AssignRoleModel> assignments)
        {
            var results = new List<object>();

            foreach (var assignment in assignments)
            {
                var user = await _userManager.FindByIdAsync(assignment.UserId);
                if (user == null)
                {
                    results.Add(new { UserId = assignment.UserId, Success = false, Message = "User not found" });
                    continue;
                }

                var result = await _userManager.AddToRoleAsync(user, assignment.RoleName);
                results.Add(new { 
                    UserId = assignment.UserId, 
                    Success = result.Succeeded, 
                    Message = result.Succeeded ? "Success" : string.Join(", ", result.Errors.Select(e => e.Description))
                });
            }

            return Ok(results);
        }

        [HttpDelete("bulk-remove")]
        public async Task<ActionResult> BulkRemoveRoles([FromBody] List<AssignRoleModel> assignments)
        {
            var results = new List<object>();

            foreach (var assignment in assignments)
            {
                var user = await _userManager.FindByIdAsync(assignment.UserId);
                if (user == null)
                {
                    results.Add(new { UserId = assignment.UserId, Success = false, Message = "User not found" });
                    continue;
                }

                var result = await _userManager.RemoveFromRoleAsync(user, assignment.RoleName);
                results.Add(new { 
                    UserId = assignment.UserId, 
                    Success = result.Succeeded, 
                    Message = result.Succeeded ? "Success" : string.Join(", ", result.Errors.Select(e => e.Description))
                });
            }

            return Ok(results);
        }
    }
}