
const { createClient } = require("redis");

const redis = createClient({
    url: process.env.REDIS_URL || "redis://redis:6379"
});

redis.on("error", (error) => {
    console.error("Redis error:", error);
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
