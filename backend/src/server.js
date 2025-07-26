import express from "express";
import logger from "./middleware/logger.js";
import transactions from "./routes/transactions.route.js";
import ratelimiter from "./middleware/rateLimiter.js";
import { initDB } from "./config/db.js";

const Port = process.env.PORT || 8081;

const app = express();

// middleware
app.use(ratelimiter);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(logger);

// routes
app.use("/api/transactions", transactions);

initDB().then(() => {
  app.listen(Port, () => {
    console.log(`Server is running on Port:${Port}`);
  });
});
