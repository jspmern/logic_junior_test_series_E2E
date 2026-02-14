const client = require("../config/redisClient");

/**
 * Build a unique cache key based on:
 * - a prefix (like 'courses')
 * - request path (like '/api/courses')
 * - query parameters (like ?page=2)
 * - params (like /:id)
 *
 * This ensures every route + query combo has a unique cache key.
 */
function buildCacheKey(req, prefix = "") {
  let keyParts = [];

  // Prefix (like "courses" or "users")
  if (prefix) keyParts.push(prefix);

  // Add route path (to separate /api/courses and /api/users)
  if (req.baseUrl) keyParts.push(req.baseUrl.replace(/\//g, ":"));

  // Add params (like course/:id)
  if (req.params && Object.keys(req.params).length > 0) {
    const paramString = Object.entries(req.params)
      .map(([k, v]) => `${k}:${v}`)
      .join("|");
    keyParts.push(`params:${paramString}`);
  }

  // Add query (like ?page=1&limit=10)
  if (req.query && Object.keys(req.query).length > 0) {
    const queryString = Object.entries(req.query)
      .map(([k, v]) => `${k}:${v}`)
      .join("|");
    keyParts.push(`query:${queryString}`);
  }

  // Combine everything into one string
  const key = keyParts.join("::").toLowerCase();

  return key;
}

async function clearCacheByPrefix(prefix) {
  try {
    if (!client.isOpen) return; // Skip if not connected
    if (!prefix) return;
    const pattern = `${prefix}*`;

    let cursor = '0'; // must be string

    do {
      const reply = await client.scan(cursor, {
        MATCH: pattern,
        COUNT: 100,
      });

      cursor = reply.cursor; // string, correct

      const keys = reply.keys.filter((k) => typeof k === 'string'); // ensure all strings

      if (keys.length > 0) {
        await client.del(...keys); // spread array
        console.log(`🧹 Cleared cache keys: ${keys.join(", ")}`);
      }
    } while (cursor !== '0');
  } catch (error) {
    console.error("❌ Failed to clear cache:", error);
  }
}


/**
 * Delete one specific key (optional helper)
 */
async function clearCacheKey(key) {
  if (!key || typeof key !== 'string') return;
  if (!client.isOpen) return;
  try {
    await client.del(key);
    console.log(`🗑️ Cache key deleted: ${key}`);
  } catch (error) {
    console.error("❌ Error deleting cache key:", error);
  }
}


module.exports = { buildCacheKey, clearCacheByPrefix, clearCacheKey };
