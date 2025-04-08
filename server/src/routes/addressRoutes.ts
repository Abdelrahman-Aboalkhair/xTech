import express from "express";
import AddressController from "../controllers/addressController";
import AddressService from "../services/addressService";
import AddressRepository from "../repositories/addressRepository";
import protect from "../middlewares/protect";
import { validateDto } from "../middlewares/validateDto";

const router = express.Router();
const addressRepository = new AddressRepository();
const addressService = new AddressService(addressRepository);
const addressController = new AddressController(addressService);

router.get("/", protect, addressController.getUserAddresses);
router.get("/:addressId", protect, addressController.getAddressDetails);
router.delete("/:addressId", protect, addressController.deleteAddress);

export default router;
