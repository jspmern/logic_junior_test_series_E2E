const redis = require("redis");
require("dotenv").config();

// Create redis client with URL from env
const client = redis.createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379',
  socket: {
    reconnectStrategy: (retries) => {
      if (retries > 5) {
        console.log("❌ Redis reconnection attempts exhausted. Caching will be disabled.");
        return new Error("Redis reconnection attempts exhausted");
      }
      return Math.min(retries * 100, 3000);
    },
  },
});

// Log connection events
client.on("connect", () => console.log("✅ Redis connected successfully"));
client.on("error", (err) => {
  // Suppress spammy connection errors if we know we are failing
  if (err.code === 'ECONNREFUSED') {
    // console.error("Redis connection refused (Caching disabled)");
  } else {
    console.error("❌ Redis Error:", err.message);
  }
});
client.on("reconnecting", () => console.log("♻️ Reconnecting to Redis..."));
client.on("end", () => console.log("Redis client disconnected"));

// Connect to redis
(async () => {
  try {
    await client.connect();
  } catch (error) {
    console.log("⚠️ Redis connection failed. App will run without caching.");
    // We don't exit process, just let it run
  }
})();

module.exports = client;
