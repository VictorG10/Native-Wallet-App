import express from "express";
import logger from "./middleware/logger.js";
import transactions from "./routes/transactions.route.js";
import ratelimiter from "./middleware/rateLimiter.js";
import { initDB } from "./config/db.js";
import job from "./config/cron.js";

const Port = process.env.PORT || 8081;

const app = express();

if (process.env.NODE_ENV === "production") job.start();

// middleware
app.use(ratelimiter);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(logger);

// routes
app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

app.use("/api/transactions", transactions);

initDB().then(() => {
  app.listen(Port, () => {
    console.log(`Server is running on Port:${Port}`);
  });
});
