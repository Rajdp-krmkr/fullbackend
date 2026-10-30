const { createClient } = require("redis");

const redis = createClient({
    url: process.env.REDIS_URL || "redis://127.0.0.1:6379"
});

redis.on("error", (err) => {
    console.error("Redis error:", err);
});

async function connectRedis() {
    if (!redis.isOpen) {
        await redis.connect();
    }

    console.log("Connected to Redis");
}

module.exports = {
    redis,
    connectRedis
};