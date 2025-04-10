import { Router } from "express";
import pageController from "../controllers/pageController";

const router = Router();

router.post("/", pageController.createPage);

router.get("/", pageController.getAllPages);

router.get("/:id", pageController.getPageById);

router.put("/:id", pageController.updatePage);

router.delete("/:id", pageController.deletePage);

export default router;
