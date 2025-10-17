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
    public class ArticleController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ArticleController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Article>>> GetArticles()
        {
            return await _context.Articles.OrderByDescending(a => a.CreatedAt).ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Article>> GetArticle(int id)
        {
            var article = await _context.Articles.FindAsync(id);
            if (article == null) return NotFound();
            return article;
        }

        [HttpPost]
        public async Task<ActionResult<Article>> CreateArticle([FromForm] CreateArticleRequest request, IFormFile? file)
        {
            var article = new Article
            {
                LinkDescription = request.LinkDescription,
                LinkShortDescription = request.LinkShortDescription,
                ArticleTitle = request.ArticleTitle,
                ArticleShortDescription = request.ArticleShortDescription,
                ArticleDetails = request.ArticleDetails,
                Status = request.Status
            };

            _context.Articles.Add(article);
            await _context.SaveChangesAsync();

            // Store JSON data if provided (from validated Excel data)
            if (!string.IsNullOrEmpty(request.JsonData))
            {
                var articleDetails = new ArticleDetails
                {
                    ArticleId = article.Id,
                    JsonData = request.JsonData
                };
                _context.ArticleDetails.Add(articleDetails);
                await _context.SaveChangesAsync();
            }

            return CreatedAtAction(nameof(GetArticle), new { id = article.Id }, article);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateArticle(int id, [FromForm] CreateArticleRequest request, IFormFile? file)
        {
            var article = await _context.Articles.FindAsync(id);
            if (article == null) return NotFound();

            article.LinkDescription = request.LinkDescription;
            article.LinkShortDescription = request.LinkShortDescription;
            article.ArticleTitle = request.ArticleTitle;
            article.ArticleShortDescription = request.ArticleShortDescription;
            article.ArticleDetails = request.ArticleDetails;
            article.Status = request.Status;
            article.UpdatedAt = DateTime.UtcNow;

            // Store JSON data if provided (from validated Excel data)
            if (!string.IsNullOrEmpty(request.JsonData))
            {
                var existingDetails = await _context.ArticleDetails.FirstOrDefaultAsync(ad => ad.ArticleId == id);
                if (existingDetails != null)
                    existingDetails.JsonData = request.JsonData;
                else
                    _context.ArticleDetails.Add(new ArticleDetails { ArticleId = id, JsonData = request.JsonData });
            }

            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteArticle(int id)
        {
            var article = await _context.Articles.FindAsync(id);
            if (article == null) return NotFound();

            _context.Articles.Remove(article);
            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpGet("{id}/details")]
        public async Task<ActionResult<string>> GetArticleDetails(int id)
        {
            var details = await _context.ArticleDetails.FirstOrDefaultAsync(ad => ad.ArticleId == id);
            return details?.JsonData ?? "";
        }
    }

    public class CreateArticleRequest
    {
        public string LinkDescription { get; set; } = string.Empty;
        public string LinkShortDescription { get; set; } = string.Empty;
        public string ArticleTitle { get; set; } = string.Empty;
        public string ArticleShortDescription { get; set; } = string.Empty;
        public string ArticleDetails { get; set; } = string.Empty;
        public ArticleStatus Status { get; set; } = ArticleStatus.Draft;
        public string? JsonData { get; set; }
    }
}