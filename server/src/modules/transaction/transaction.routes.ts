import protect from "@/shared/middlewares/protect";
import { makeTransactionController } from "./transaction.factory";
import express from "express";
import authorizeRole from "@/shared/middlewares/authorizeRole";

const router = express.Router();
const transactionController = makeTransactionController();

router.get(
  "/",
  protect,
  authorizeRole("ADMIN", "SUPERADMIN"),
  transactionController.getAllTransactions
);

router.get(
  "/:id",
  protect,
  authorizeRole("ADMIN", "SUPERADMIN"),
  transactionController.getTransactionById
);

router.put(
  "/status/:id",
  protect,
  authorizeRole("ADMIN", "SUPERADMIN"),
  transactionController.updateTransactionStatus
);

router.delete(
  "/:id",
  protect,
  authorizeRole("ADMIN", "SUPERADMIN"),
  transactionController.deleteTransaction
);

export default router;
