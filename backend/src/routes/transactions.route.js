import { Router } from "express";
import {
  createTransaction,
  deleteTransaction,
  getSummaryByUserId,
  getTransactionUserId,
} from "../controllers/transactions.controller.js";

const router = Router();

router.get("/:userId", getTransactionUserId);

router.get("/summary/:userId", getSummaryByUserId);

router.post("/", createTransaction);

router.delete("/:id", deleteTransaction);

export default router;
