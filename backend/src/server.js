import express from "express";
import logger from "./middleware/logger.js";
import { sql } from "../config/db.js";

const Port = process.env.PORT || 8081;

const app = express();

const initDB = async () => {
  try {
    await sql`CREATE TABLE IF NOT EXISTS transactions(
    id SERIAL PRIMARY KEY, 
    user_id VARCHAR(255) NOT NULL,
    title VARCHAR(255) NOT NULL,
     amount DECIMAL(10, 2) NOT NULL,
     category VARCHAR(255) NOT NULL,
     created_at DATE NOT NULL DEFAULT CURRENT_DATE  
    )`;

    console.log("Database initialized successfully");
  } catch (error) {
    console.error("Error initializing Database", error);
    process.exit(1);
  }
};

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(logger);

app.get("/", (req, res) => {
  res.send("<h1>Hello World</h1>");
});

initDB().then(() => {
  app.listen(Port, () => {
    console.log(`Server is running on Port:${Port}`);
  });
});
