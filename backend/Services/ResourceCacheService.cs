using Microsoft.Extensions.Caching.Distributed;
using Microsoft.EntityFrameworkCore;
using MarketingSite.Data;
using Backend.Models;
using System.Text.Json;

namespace Backend.Services
{
    public class ResourceCacheService
    {
        private readonly IDistributedCache _cache;
        private readonly ApplicationDbContext _context;
        private const string CACHE_KEY = "published_resources";
        private const int CACHE_DURATION_MINUTES = 30;

        public ResourceCacheService(IDistributedCache cache, ApplicationDbContext context)
        {
            _cache = cache;
            _context = context;
        }

        public async Task<List<Resource>> GetPublishedResourcesAsync()
        {
            var cachedData = await _cache.GetStringAsync(CACHE_KEY);
            
            if (!string.IsNullOrEmpty(cachedData))
            {
                return JsonSerializer.Deserialize<List<Resource>>(cachedData) ?? new List<Resource>();
            }

            var resources = await _context.Resources
                .Where(r => r.Status == ResourceStatus.Published)
                .OrderByDescending(r => r.CreatedAt)
                .ToListAsync();

            var options = new DistributedCacheEntryOptions
            {
                AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(CACHE_DURATION_MINUTES)
            };

            await _cache.SetStringAsync(CACHE_KEY, JsonSerializer.Serialize(resources), options);
            return resources;
        }

        public async Task InvalidateCacheAsync()
        {
            await _cache.RemoveAsync(CACHE_KEY);
        }
    }
}