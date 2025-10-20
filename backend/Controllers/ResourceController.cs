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
        public async Task<ActionResult<Resource>> GetResource(int id)
        {
            var resource = await _context.Resources.FindAsync(id);
            if (resource == null) return NotFound();
            return resource;
        }

        [HttpPost]
        public async Task<ActionResult<Resource>> CreateResource([FromForm] CreateResourceRequest request, IFormFile? file)
        {
            var resource = new Resource
            {
                LinkDescription = request.LinkDescription,
                LinkShortDescription = request.LinkShortDescription,
                ResourceTitle = request.ResourceTitle,
                ResourceShortDescription = request.ResourceShortDescription,
                ResourceDetails = request.ResourceDetails,
                Status = request.Status
            };

            _context.Resources.Add(resource);
            await _context.SaveChangesAsync();

            // Store JSON data if provided (from validated Excel data)
            if (!string.IsNullOrEmpty(request.JsonData))
            {
                var resourceDetails = new ResourceDetails
                {
                    ResourceId = resource.Id,
                    JsonData = request.JsonData
                };
                _context.ResourceDetails.Add(resourceDetails);
                await _context.SaveChangesAsync();
            }

            await _cacheService.InvalidateCacheAsync();
            return CreatedAtAction(nameof(GetResource), new { id = resource.Id }, resource);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateResource(int id, [FromForm] CreateResourceRequest request, IFormFile? file)
        {
            var resource = await _context.Resources.FindAsync(id);
            if (resource == null) return NotFound();

            resource.LinkDescription = request.LinkDescription;
            resource.LinkShortDescription = request.LinkShortDescription;
            resource.ResourceTitle = request.ResourceTitle;
            resource.ResourceShortDescription = request.ResourceShortDescription;
            resource.ResourceDetails = request.ResourceDetails;
            resource.Status = request.Status;
            resource.UpdatedAt = DateTime.UtcNow;

            // Store JSON data if provided (from validated Excel data)
            if (!string.IsNullOrEmpty(request.JsonData))
            {
                var existingDetails = await _context.ResourceDetails.FirstOrDefaultAsync(rd => rd.ResourceId == id);
                if (existingDetails != null)
                    existingDetails.JsonData = request.JsonData;
                else
                    _context.ResourceDetails.Add(new ResourceDetails { ResourceId = id, JsonData = request.JsonData });
            }

            await _context.SaveChangesAsync();
            await _cacheService.InvalidateCacheAsync();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteResource(int id)
        {
            var resource = await _context.Resources.FindAsync(id);
            if (resource == null) return NotFound();

            _context.Resources.Remove(resource);
            await _context.SaveChangesAsync();
            await _cacheService.InvalidateCacheAsync();
            return NoContent();
        }

        [HttpGet("{id}/details")]
        public async Task<ActionResult<string>> GetResourceDetails(int id)
        {
            var details = await _context.ResourceDetails.FirstOrDefaultAsync(rd => rd.ResourceId == id);
            return details?.JsonData ?? "";
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
        public async Task<ActionResult<ResourceSection>> AddSection(int resourceId, [FromBody] CreateSectionRequest request)
        {
            if (!await _context.Resources.AnyAsync(r => r.Id == resourceId))
                return NotFound("Resource not found");

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

        [HttpPut("sections/{sectionId}")]
        public async Task<IActionResult> UpdateSection(int sectionId, [FromBody] CreateSectionRequest request)
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
    }

    public class CreateResourceRequest
    {
        public string LinkDescription { get; set; } = string.Empty;
        public string LinkShortDescription { get; set; } = string.Empty;
        public string ResourceTitle { get; set; } = string.Empty;
        public string ResourceShortDescription { get; set; } = string.Empty;
        public string ResourceDetails { get; set; } = string.Empty;
        public ResourceStatus Status { get; set; } = ResourceStatus.Draft;
        public string? JsonData { get; set; }
    }

    public class CreateSectionRequest
    {
        public int? ParentSectionId { get; set; }
        public string Title { get; set; } = string.Empty;
        public string? Description { get; set; }
        public int SortOrder { get; set; } = 0;
    }
}