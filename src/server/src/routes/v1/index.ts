import { Router } from "express";
import usersRoutes from "@/modules/user/user.routes";
import authRoutes from "@/modules/auth/auth.routes";
import productRoutes from "@/modules/product/product.routes";
import categoryRoutes from "@/modules/category/category.routes";
import logRoutes from "@/modules/logs/logs.routes";

const router = Router();

router.use("/users", usersRoutes);
router.use("/auth", authRoutes);
router.use("/products", productRoutes);
router.use("/categories", categoryRoutes);
router.use("/logs", logRoutes);

export default router;
