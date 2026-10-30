
const express = require("express");
const { redis, connectRedis } = require("./redisClient");

const app = express();

const PORT = process.env.PORT || 3000;

app.use((req, res, next) => {
    console.log(
        `[PORT ${PORT}] ${req.method} ${req.url}`
    );

    next();
});

app.get("/", (req, res) => {
    res.json({
        message: "Hello from Express!",
        server: `Express running on port ${PORT}`
    });
});

app.get("/api/users", (req, res) => {
    res.json({
        instance: process.env.HOSTNAME,
        port: PORT,
        users: [
            { id: 1, name: "Raj" },
            { id: 2, name: "Alex" }
        ]
    });
});



app.get("/api/products", (req, res) => {
    console.log(`[PORT ${PORT}] Products route executed`);

    res.json({
        server: PORT,
        generatedAt: new Date().toISOString(),

        products: [
            { id: 1, name: "Laptop", price: 55000 },
            { id: 2, name: "Keyboard", price: 1500 },
            { id: 3, name: "Mouse", price: 700 }
        ]
    });
});

app.get("/api/products-redis", async (req, res) => {

    try {
        const cacheKey = "demo:products:v1";

        //step: 1 check redis
        const cachedData = await redis.get(cacheKey);
        if (cachedData) {
            console.log(`[PORT ${PORT}] Redis HIT`);

            return res.json({
                cache: "HIT",
                handledBy: PORT,
                data: JSON.parse(cachedData)
            });
        }
        // Step 2: Simulate database query
        console.log(`[PORT ${PORT}] Redis MISS`);

        const products = [
            { id: 1, name: "Laptop", price: 55000 },
            { id: 2, name: "Keyboard", price: 1500 },
            { id: 3, name: "Mouse", price: 700 }
        ];

        const result = {
            products,
            generatedAt: new Date().toISOString()
        };
        await redis.set(
            cacheKey,
            JSON.stringify(result),
            { EX: 30 }
        );
        return res.json({
            cache: "MISS",
            handledBy: PORT,
            data: result
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: "Internal Server Error"
        });
    }
});


// app.listen(PORT, "0.0.0.0", () => {
//     console.log(`Express running on ${PORT}`);
// });
async function startServer() {
    try {
        await connectRedis();

        app.listen(PORT, "0.0.0.0", () => {
            console.log(`Express running on ${PORT}`);
        });

    } catch (error) {
        console.error("Startup failed:", error);
        process.exit(1);
    }
}

startServer();
