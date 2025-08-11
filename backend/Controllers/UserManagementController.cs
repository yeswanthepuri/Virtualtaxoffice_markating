using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MarketingSite.Models;

namespace MarketingSite.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Policy = "AdminOnly")]
    public class UserManagementController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager;

        public UserManagementController(UserManager<ApplicationUser> userManager)
        {
            _userManager = userManager;
        }

        [HttpGet]
        public async Task<ActionResult<List<UserInfo>>> GetUsers()
        {
            var users = await _userManager.Users.ToListAsync();
            var userInfos = new List<UserInfo>();

            foreach (var user in users)
            {
                var roles = await _userManager.GetRolesAsync(user);
                userInfos.Add(new UserInfo
                {
                    Id = user.Id,
                    Email = user.Email,
                    FirstName = user.FirstName,
                    LastName = user.LastName,
                    Roles = roles.ToList()
                });
            }

            return Ok(userInfos);
        }

        [HttpGet("{userId}")]
        public async Task<ActionResult<UserInfo>> GetUser(string userId)
        {
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
            {
                return NotFound(new { message = "User not found" });
            }

            var roles = await _userManager.GetRolesAsync(user);
            return Ok(new UserInfo
            {
                Id = user.Id,
                Email = user.Email,
                FirstName = user.FirstName,
                LastName = user.LastName,
                Roles = roles.ToList()
            });
        }

        [HttpPut("{userId}/activate")]
        public async Task<ActionResult> ActivateUser(string userId)
        {
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
            {
                return NotFound(new { message = "User not found" });
            }

            user.IsActive = true;
            var result = await _userManager.UpdateAsync(user);

            if (result.Succeeded)
            {
                return Ok(new { message = "User activated successfully" });
            }

            return BadRequest(new { message = string.Join(", ", result.Errors.Select(e => e.Description)) });
        }

        [HttpPut("{userId}/deactivate")]
        public async Task<ActionResult> DeactivateUser(string userId)
        {
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
            {
                return NotFound(new { message = "User not found" });
            }

            user.IsActive = false;
            var result = await _userManager.UpdateAsync(user);

            if (result.Succeeded)
            {
                return Ok(new { message = "User deactivated successfully" });
            }

            return BadRequest(new { message = string.Join(", ", result.Errors.Select(e => e.Description)) });
        }

        [HttpDelete("{userId}")]
        public async Task<ActionResult> DeleteUser(string userId)
        {
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
            {
                return NotFound(new { message = "User not found" });
            }

            var result = await _userManager.DeleteAsync(user);
            if (result.Succeeded)
            {
                return Ok(new { message = "User deleted successfully" });
            }

            return BadRequest(new { message = string.Join(", ", result.Errors.Select(e => e.Description)) });
        }
    }
}