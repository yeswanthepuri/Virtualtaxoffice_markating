using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MarketingSite.Services;

namespace MarketingSite.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class FileUploadController : ControllerBase
    {
        private readonly MinIOService _minioService;

        public FileUploadController(MinIOService minioService)
        {
            _minioService = minioService;
        }

        [HttpGet("image/{fileName}")]
        [AllowAnonymous]
        public async Task<ActionResult> GetImage(string fileName)
        {
            try
            {
                var stream = await _minioService.GetFileAsync(fileName);
                var contentType = fileName.ToLower().EndsWith(".png") ? "image/png" : "image/jpeg";
                return File(stream, contentType);
            }
            catch
            {
                return NotFound();
            }
        }

        [HttpPost("image")]
        public async Task<ActionResult<object>> UploadImage(IFormFile file)
        {
            if (file == null || file.Length == 0)
                return BadRequest("No file uploaded");

            var allowedTypes = new[] { "image/jpeg", "image/jpg", "image/png" };
            if (!allowedTypes.Contains(file.ContentType.ToLower()))
                return BadRequest("Only JPG and PNG images are allowed");

            try
            {
                var fileName = await _minioService.UploadFileAsync(file);
                return Ok(new { fileName, message = "File uploaded successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Upload failed: {ex.Message}");
            }
        }
    }
}