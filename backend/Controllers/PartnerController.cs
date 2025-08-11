using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MarketingSite.Data;
using MarketingSite.Models;

namespace MarketingSite.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class PartnerController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public PartnerController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<List<Partner>>> GetPartners()
        {
            return await _context.Partners.ToListAsync();
        }

        [HttpGet("public")]
        [AllowAnonymous]
        public async Task<ActionResult<List<Partner>>> GetPartnersPublic()
        {
            return await _context.Partners.ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Partner>> GetPartner(int id)
        {
            var partner = await _context.Partners.FindAsync(id);
            if (partner == null) return NotFound();
            return partner;
        }

        [HttpPost]
        public async Task<ActionResult<Partner>> CreatePartner(CreatePartnerModel model)
        {
            var partner = new Partner
            {
                ImageId = model.ImageId,
                Description = model.Description,
                ContactName = model.ContactName,
                Email = model.Email,
                Website = model.Website
            };

            _context.Partners.Add(partner);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetPartner), new { id = partner.Id }, partner);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult> UpdatePartner(int id, CreatePartnerModel model)
        {
            var partner = await _context.Partners.FindAsync(id);
            if (partner == null) return NotFound();

            partner.ImageId = model.ImageId;
            partner.Description = model.Description;
            partner.ContactName = model.ContactName;
            partner.Email = model.Email;
            partner.Website = model.Website;

            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> DeletePartner(int id)
        {
            var partner = await _context.Partners.FindAsync(id);
            if (partner == null) return NotFound();

            _context.Partners.Remove(partner);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}