using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;

namespace MarketingSite.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class PolicyController : ControllerBase
    {
        private readonly IAuthorizationService _authorizationService;

        public PolicyController(IAuthorizationService authorizationService)
        {
            _authorizationService = authorizationService;
        }

        [HttpGet]
        public ActionResult GetPolicies()
        {
            var policies = new[]
            {
                new { Name = "AdminOnly", Description = "Requires Admin role", Requirements = new[] { "Admin" } },
                new { Name = "UserOrAdmin", Description = "Requires User or Admin role", Requirements = new[] { "User", "Admin" } },
                new { Name = "RequireEmail", Description = "Requires email claim", Requirements = new[] { "email claim" } }
            };

            return Ok(policies);
        }

        [HttpPost("test/{policyName}")]
        public async Task<ActionResult> TestPolicy(string policyName)
        {
            var authResult = await _authorizationService.AuthorizeAsync(User, policyName);
            
            return Ok(new 
            { 
                PolicyName = policyName,
                IsAuthorized = authResult.Succeeded,
                FailureReasons = authResult.Failure?.FailureReasons?.Select(r => r.Message) ?? new string[0]
            });
        }

        [HttpGet("user-permissions")]
        public async Task<ActionResult> GetUserPermissions()
        {
            var permissions = new Dictionary<string, bool>();
            var policies = new[] { "AdminOnly", "UserOrAdmin", "RequireEmail" };

            foreach (var policy in policies)
            {
                var authResult = await _authorizationService.AuthorizeAsync(User, policy);
                permissions[policy] = authResult.Succeeded;
            }

            return Ok(new
            {
                UserId = User.Identity?.Name,
                Roles = User.Claims.Where(c => c.Type == "role" || c.Type == "http://schemas.microsoft.com/ws/2008/06/identity/claims/role").Select(c => c.Value),
                Permissions = permissions
            });
        }
    }
}