using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MarketingSite.Data;
using Backend.Models;
using Microsoft.AspNetCore.Authorization;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class ResourceController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly Backend.Services.ResourceCacheService _cacheService;

        public ResourceController(ApplicationDbContext context, Backend.Services.ResourceCacheService cacheService)
        {
            _context = context;
            _cacheService = cacheService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Resource>>> GetResources()
        {
            return await _context.Resources.OrderByDescending(r => r.CreatedAt).ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Resource>> GetResource(long id)
        {
            var resource = await _context.Resources.FindAsync(id);
            if (resource == null) return NotFound();
            return resource;
        }

        [HttpPost]
        public async Task<ActionResult<Resource>> CreateResource([FromBody] CreateResourceRequest request)
        {
            var resource = new Resource
            {
                Title = request.Title,
                Description = request.Description
            };

            _context.Resources.Add(resource);
            await _context.SaveChangesAsync();

            await _cacheService.InvalidateCacheAsync();
            return CreatedAtAction(nameof(GetResource), new { id = resource.ResourceId }, resource);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateResource(long id, [FromBody] CreateResourceRequest request)
        {
            var resource = await _context.Resources.FindAsync(id);
            if (resource == null) return NotFound();

            resource.Title = request.Title;
            resource.Description = request.Description;
            resource.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();
            await _cacheService.InvalidateCacheAsync();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteResource(long id)
        {
            var resource = await _context.Resources.FindAsync(id);
            if (resource == null) return NotFound();

            _context.Resources.Remove(resource);
            await _context.SaveChangesAsync();
            await _cacheService.InvalidateCacheAsync();
            return NoContent();
        }



        [HttpGet("published")]
        [AllowAnonymous]
        public async Task<ActionResult<IEnumerable<Resource>>> GetPublishedResources()
        {
            var resources = await _cacheService.GetPublishedResourcesAsync();
            return Ok(resources);
        }

        [HttpPost("clear-cache")]
        public async Task<IActionResult> ClearCache()
        {
            await _cacheService.InvalidateCacheAsync();
            return Ok(new { message = "Resource cache cleared successfully" });
        }

        [HttpGet("sections")]
        public async Task<ActionResult<IEnumerable<ResourceSection>>> GetAllSections()
        {
            return await _context.ResourceSections.ToListAsync();
        }

        [HttpPost("{resourceId}/sections")]
        public async Task<ActionResult<ResourceSection>> AddSection(long resourceId, [FromBody] CreateSectionRequest request)
        {
            try
            {
                if (!await _context.Resources.AnyAsync(r => r.ResourceId == resourceId))
                    return NotFound("Resource not found");

                // Validate parent section exists if specified
                if (request.ParentSectionId.HasValue)
                {
                    var parentExists = await _context.ResourceSections.AnyAsync(s => s.SectionId == request.ParentSectionId.Value);
                    if (!parentExists)
                        return BadRequest("Parent section not found");
                }

                var section = new ResourceSection
                {
                    ResourceId = resourceId,
                    ParentSectionId = request.ParentSectionId,
                    Title = request.Title,
                    Description = request.Description,
                    SortOrder = request.SortOrder
                };
                
                _context.ResourceSections.Add(section);
                await _context.SaveChangesAsync();
                return CreatedAtAction(nameof(GetResource), new { id = resourceId }, section);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error creating section", error = ex.Message });
            }
        }

        [HttpPut("sections/{sectionId}")]
        public async Task<IActionResult> UpdateSection(long sectionId, [FromBody] CreateSectionRequest request)
        {
            try
            {
                var section = await _context.ResourceSections.FindAsync(sectionId);
                if (section == null) return NotFound();
                
                section.Title = request.Title;
                section.Description = request.Description;
                section.SortOrder = request.SortOrder;
                section.UpdatedAt = DateTime.UtcNow;
                
                await _context.SaveChangesAsync();
                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error updating section", error = ex.Message });
            }
        }
    }

    public class CreateResourceRequest
    {
        public string Title { get; set; } = string.Empty;
        public string? Description { get; set; }
    }

    public class CreateSectionRequest
    {
        public long? ParentSectionId { get; set; }
        public string Title { get; set; } = string.Empty;
        public string? Description { get; set; }
        public int SortOrder { get; set; } = 0;
    }
}