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

app.get("/api/transactions/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const transactions = await sql`
    SELECT * FROM transactions WHERE user_id = ${userId} ORDER BY created_at DESC
    `;
    console.log(transactions);
    res.status(200).json(transactions);
  } catch (error) {
    console.error("Error fetching transaction:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.get("/api/transactions/summary/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const balanceResult = await sql`
    SELECT COALESCE(SUM(amount), 0) as balance FROM transactions WHERE user_id = ${userId}
    `;

    const incomeResult = await sql`
    SELECT COALESCE(SUM(amount), 0) as income FROM transactions WHERE user_id = ${userId} AND amount > 0
    `;

    const expenseResult = await sql`
    SELECT COALESCE(SUM(amount), 0) as expenses FROM transactions WHERE user_id = ${userId} AND amount < 0
    `;

    console.log({
      balance: balanceResult[0].balance,
      income: incomeResult[0].income,
      expenses: expenseResult[0].expenses,
    });
    res.status(200).json({
      balance: balanceResult[0].balance,
      income: incomeResult[0].income,
      expenses: expenseResult[0].expenses,
    });
  } catch (error) {
    console.error("Error getting the summary", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

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

app.delete("/api/transactions/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (isNaN(parseInt(id))) {
      return res.status(400).json({ message: "Invalid transaction Id" });
    }

    const transactions = await sql`
    DELETE FROM transactions WHERE id = ${id} RETURNING * `;

    if (transactions.length === 0) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    res.status(200).json({ message: "Transaction deleted successfully" });
  } catch (error) {
    console.error("Error deleting transaction", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

initDB().then(() => {
  app.listen(Port, () => {
    console.log(`Server is running on Port:${Port}`);
  });
});
