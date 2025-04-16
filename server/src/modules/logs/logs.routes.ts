import express from "express";
import { makeLogsController } from "./logs.factory";

const router = express.Router();
const logsController = makeLogsController();

router.get("/", logsController.getLogs);
router.get("/:id", logsController.getLogById);
router.get("/:level", logsController.getLogByLevel);
router.delete("/:id", logsController.deleteLog);
router.delete("/", logsController.clearLogs);

export default router;
