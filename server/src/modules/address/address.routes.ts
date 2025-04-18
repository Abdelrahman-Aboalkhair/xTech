import express from "express";
import protect from "@/shared/middlewares/protect";
import { makeAddressController } from "./address.factory";

const router = express.Router();
const addressController = makeAddressController();

router.get("/", protect, addressController.getUserAddresses);
router.get("/:id", protect, addressController.getAddressDetails);
router.delete("/:id", protect, addressController.deleteAddress);

export default router;
