const client = require("../config/redisClient");
const { buildCacheKey } = require("../utilis/cacheKey");

function cache(prefix = "", expirySeconds = process.env.CACHE_EXPIRY || 3600) {
  return async (req, res, next) => {
    try {
      if (!client.isOpen) {
        // Redis not available, skip cache
        return next();
      }

      // Generate unique key based on route + params + query
      const key = buildCacheKey(req, prefix);

      // Try to get data from Redis
      const cached = await client.get(key);
      if (cached) {
        console.log("📦 Cache hit:", key);
        const data = JSON.parse(cached);
        return res.status(200).json({
          success: true,
          message: "Fetched successfully (from cache)",
          data,
          total: Array.isArray(data) ? data.length : undefined,
        });
      }

      // Not found in cache, continue to controller
      res.locals.cacheKey = key;
      res.locals.expiry = expirySeconds;
      console.log("🗝️ Cache miss:", key);
      next();
    } catch (error) {
      console.error("Cache middleware error:", error);
      next(); // Continue even if Redis fails
    }
  };
}

module.exports = cache;
