import { Router } from "express";
import protect from "@/shared/middlewares/protect";
import { upload } from "@/shared/middlewares/upload";
import { makeProductController } from "./product.factory";

const router = Router();
const productController = makeProductController();

router.get("/", productController.getAllProducts);
router.get("/:id", productController.getProductById);
router.get("/slug/:slug", productController.getProductBySlug);
router.post(
  "/",
  protect,
  upload.array("files", 10),
  productController.createProduct
);
router.put(
  "/:id",
  protect,
  upload.array("files", 10),
  productController.updateProduct
);
router.delete("/:id", protect, productController.deleteProduct);

export default router;
