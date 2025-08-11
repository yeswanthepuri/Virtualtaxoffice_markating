using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace MarketingSite.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TestController : ControllerBase
    {
        [HttpGet("public")]
        public ActionResult GetPublic()
        {
            return Ok(new { message = "Public endpoint - no auth required", timestamp = DateTime.Now });
        }

        [HttpGet("protected")]
        [Authorize]
        public ActionResult GetProtected()
        {
            return Ok(new { 
                message = "Protected endpoint - auth required", 
                user = User.Identity?.Name,
                claims = User.Claims.Select(c => new { c.Type, c.Value }),
                timestamp = DateTime.Now 
            });
        }
    }
}