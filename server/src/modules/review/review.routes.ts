import { Router } from "express";
import { makeReviewController } from "./review.factory";
import protect from "@/shared/middlewares/protect";

const router = Router();
const controller = makeReviewController();

router.get("/:productId", controller.getReviewsByProductId);
router.post("/", protect, controller.createReview);
router.delete("/:id", protect, controller.deleteReview);

export default router;
