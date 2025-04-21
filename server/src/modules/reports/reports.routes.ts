import { Router } from "express";
import { makeReportsController } from "./reports.factory";
import protect from "@/shared/middlewares/protect";

const router = Router();
const controller = makeReportsController();

router.get("/generate", protect, controller.generateReport);

export default router;
