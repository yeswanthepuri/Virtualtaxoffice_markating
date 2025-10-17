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
    public class LocationController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public LocationController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet("countries")]
        public async Task<ActionResult<IEnumerable<Country>>> GetCountries()
        {
            return await _context.Countries.ToListAsync();
        }

        [HttpGet("states/{countryId}")]
        public async Task<ActionResult<IEnumerable<State>>> GetStatesByCountry(int countryId)
        {
            if (countryId == 0)
                return await _context.States.ToListAsync();
            return await _context.States.Where(s => s.CountryId == countryId).ToListAsync();
        }

        [HttpPost("countries")]
        public async Task<ActionResult<Country>> CreateCountry(CountryRequest request)
        {
            var country = new Country
            {
                Name = request.Name,
                Code = request.Code,
                IsActive = request.IsActive
            };

            _context.Countries.Add(country);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetCountries), country);
        }

        [HttpPut("countries/{id}")]
        public async Task<IActionResult> UpdateCountry(int id, CountryRequest request)
        {
            var country = await _context.Countries.FindAsync(id);
            if (country == null) return NotFound();

            country.Name = request.Name;
            country.Code = request.Code;
            country.IsActive = request.IsActive;

            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("countries/{id}")]
        public async Task<IActionResult> DeleteCountry(int id)
        {
            var country = await _context.Countries.FindAsync(id);
            if (country == null) return NotFound();

            _context.Countries.Remove(country);
            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpPost("states")]
        public async Task<ActionResult<State>> CreateState(StateRequest request)
        {
            var state = new State
            {
                Name = request.Name,
                Code = request.Code,
                CountryId = request.CountryId,
                IsActive = request.IsActive
            };

            _context.States.Add(state);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetStatesByCountry), new { countryId = state.CountryId }, state);
        }

        [HttpPut("states/{id}")]
        public async Task<IActionResult> UpdateState(int id, StateRequest request)
        {
            var state = await _context.States.FindAsync(id);
            if (state == null) return NotFound();

            state.Name = request.Name;
            state.Code = request.Code;
            state.CountryId = request.CountryId;
            state.IsActive = request.IsActive;

            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("states/{id}")]
        public async Task<IActionResult> DeleteState(int id)
        {
            var state = await _context.States.FindAsync(id);
            if (state == null) return NotFound();

            _context.States.Remove(state);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }

    public class CountryRequest
    {
        public string Name { get; set; } = string.Empty;
        public string Code { get; set; } = string.Empty;
        public bool IsActive { get; set; } = true;
    }

    public class StateRequest
    {
        public string Name { get; set; } = string.Empty;
        public string Code { get; set; } = string.Empty;
        public int CountryId { get; set; }
        public bool IsActive { get; set; } = true;
    }
}