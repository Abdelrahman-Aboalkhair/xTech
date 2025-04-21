import express from "express";
import authorizeRole from "@/shared/middlewares/authorizeRole";
import protect from "@/shared/middlewares/protect";
import { makeProductController } from "./product.factory";
import { makeRecommendationController } from "../recommendation/recommendation.factory";
import upload from "@/shared/middlewares/upload";

const router = express.Router();
const productController = makeProductController();
const recommendationController = makeRecommendationController();

router.get("/", productController.getAllProducts);
router.get("/:id", productController.getProductById);
router.get("/slug/:slug", productController.getProductBySlug);
router.get("/:productId", recommendationController.getRecommendations);

router.post(
  "/",
  protect,
  authorizeRole("ADMIN", "SUPERADMIN"),
  upload.array("images", 10),
  productController.createProduct
);
router.post(
  "/bulk",
  protect,
  authorizeRole("ADMIN", "SUPERADMIN"),
  upload.single("file"),
  productController.bulkCreateProducts
);

router.post(
  "/retrain",
  protect,
  authorizeRole("ADMIN", "SUPERADMIN"),
  recommendationController.retrainModel
);

router.delete(
  "/:id",
  protect,
  authorizeRole("ADMIN", "SUPERADMIN"),
  productController.deleteProduct
);

export default router;
