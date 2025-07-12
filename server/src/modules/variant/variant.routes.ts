import express from "express";
import { makeVariantController } from "./variant.factory";

const router = express.Router();
const controller = makeVariantController();

router.get("/", controller.getAllVariants);
router.get("/:id", controller.getVariantById);
router.get("/sku/:sku", controller.getVariantBySku);
router.post("/", controller.createVariant);
router.patch("/:id", controller.updateVariant);
router.post("/:id/restock", controller.restockVariant);
router.delete("/:id", controller.deleteVariant);

export default router;