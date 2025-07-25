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

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(logger);

app.post("/api/transactions", async (req, res) => {
  try {
    const { title, amount, category, user_id } = req.body;

    if (!title || !user_id || amount === undefined || !category) {
      return res.status(404).json({ message: "All fields are required" });
    }

    const transaction = await sql`
    INSERT INTO transactions(user_id, title, amount,category)
    VALUEs (${user_id}, ${title}, ${amount}, ${category})
    RETURNING *
    `;

    console.log(transaction);
    res.status(201).json(transaction[0]);
  } catch (error) {
    console.error("Error creating transaction", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

initDB().then(() => {
  app.listen(Port, () => {
    console.log(`Server is running on Port:${Port}`);
  });
});
