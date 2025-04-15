import { Router } from "express";
import { makeReviewController } from "./review.factory";
import protect from "@/shared/middlewares/protect";

const router = Router();
const controller = makeReviewController();

router.post("/", protect, controller.createReview);
router.get("/product/:productId", controller.getReviewsByProductId);
router.delete("/:id", protect, controller.deleteReview);

export default router;
