import { Router } from "express";
import { makePageController } from "./page.factory";

const router = Router();
const pageController = makePageController();

router.post("/", pageController.createPage);

router.get("/", pageController.getAllPages);

router.get("/:id", pageController.getPageById);

router.put("/:id", pageController.updatePage);

router.delete("/:id", pageController.deletePage);

export default router;
