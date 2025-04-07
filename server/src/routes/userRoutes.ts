import { Router } from "express";
import userController from "../controllers/userController";
import protect from "../middlewares/protect";
import authorizeRole from "../middlewares/authorizeRole";
import { validateDto } from "../middlewares/validateDto";
import { UpdateUserDto, UserEmailDto, UserIdDto } from "../dtos/userDto";

const router = Router();

router.get("/me", protect, userController.getMe);

router.get(
  "/",
  protect,
  authorizeRole("ADMIN", "SUPERADMIN"),
  userController.getAllUsers
);
router.get(
  "/:id",
  protect,
  authorizeRole("ADMIN", "SUPERADMIN"),
  validateDto(UserIdDto),
  userController.getUserById
);
router.get(
  "/email/:email",
  protect,
  authorizeRole("ADMIN", "SUPERADMIN"),
  validateDto(UserEmailDto),
  userController.getUserByEmail
);
router.put(
  "/:id",
  protect,
  authorizeRole("USER"),
  validateDto(UpdateUserDto),
  userController.updateMe
);
router.delete(
  "/:id",
  protect,
  authorizeRole("ADMIN", "SUPERADMIN"),
  validateDto(UserIdDto),
  userController.deleteUser
);

export default router;
