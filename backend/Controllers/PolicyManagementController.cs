using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MarketingSite.Models;

namespace MarketingSite.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class PolicyManagementController : ControllerBase
    {
        private readonly IAuthorizationService _authorizationService;

        public PolicyManagementController(IAuthorizationService authorizationService)
        {
            _authorizationService = authorizationService;
        }

        [HttpGet("available")]
        public ActionResult<List<PolicyModel>> GetAvailablePolicies()
        {
            var policies = new List<PolicyModel>
            {
                new() { Name = "AdminOnly", Description = "Admin role required", RequiredRoles = new() { "Admin" } },
                new() { Name = "UserOrAdmin", Description = "User or Admin role required", RequiredRoles = new() { "User", "Admin" } },
                new() { Name = "RequireEmail", Description = "Email claim required", RequiredClaims = new() { "email" } }
            };

            return Ok(policies);
        }

        [HttpPost("test-user-access")]
        public async Task<ActionResult<UserPermissionModel>> TestUserAccess(string userId)
        {
            var policies = new[] { "AdminOnly", "UserOrAdmin", "RequireEmail" };
            var permissions = new Dictionary<string, bool>();

            foreach (var policy in policies)
            {
                var authResult = await _authorizationService.AuthorizeAsync(User, policy);
                permissions[policy] = authResult.Succeeded;
            }

            return Ok(new UserPermissionModel
            {
                UserId = User.FindFirst("sub")?.Value ?? User.Identity?.Name ?? "",
                Email = User.FindFirst("email")?.Value ?? "",
                Roles = User.Claims.Where(c => c.Type == "role").Select(c => c.Value).ToList(),
                Policies = permissions
            });
        }

        [HttpPost("validate-access")]
        public async Task<ActionResult> ValidateAccess([FromBody] string policyName)
        {
            var authResult = await _authorizationService.AuthorizeAsync(User, policyName);
            
            return Ok(new 
            { 
                PolicyName = policyName,
                HasAccess = authResult.Succeeded,
                Reasons = authResult.Failure?.FailureReasons?.Select(r => r.Message) ?? new string[0]
            });
        }
    }
}