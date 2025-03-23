import { Router } from "express";
import * as userController from "../controllers/userController";
import protect from "../middlewares/protect";
import authorizeRole from "../middlewares/authorizeRole";

const router = Router();

router.get(
  "/",
  protect,
  authorizeRole("admin", "superadmin"),
  userController.getAllUsers
);

router.get(
  "/:id",
  protect,
  authorizeRole("admin", "superadmin"),
  userController.getUserById
);

router.get(
  "/email/:email",
  protect,
  authorizeRole("admin", "superadmin"),
  userController.getUserByEmail
);

router.get("/me", protect, userController.getMe);

router.put("/:id", protect, authorizeRole("user"), userController.updateMe);

router.delete("/:id", userController.deleteUser);

export default router;
