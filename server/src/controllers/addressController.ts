import { Request, Response } from "express";
import asyncHandler from "../utils/asyncHandler";
import sendResponse from "../utils/sendResponse";
import AppError from "../utils/AppError";
import AddressService from "../services/addressService";

class AddressController {
  constructor(private addressService: AddressService) {}

  // Get all addresses for the authenticated user
  getUserAddresses = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?.id; // From protect middleware
    if (!userId) {
      throw new AppError(400, "User not found");
    }
    const addresses = await this.addressService.getUserAddresses(userId);
    sendResponse(res, 200, { addresses }, "Addresses retrieved successfully");
  });

  // Get details of a specific address
  getAddressDetails = asyncHandler(async (req: Request, res: Response) => {
    const { addressId } = req.params;
    const userId = req.user?.id;
    if (!userId) {
      throw new AppError(400, "User not found");
    }
    const address = await this.addressService.getAddressDetails(
      addressId,
      userId
    );
    sendResponse(
      res,
      200,
      { address },
      "Address details retrieved successfully"
    );
  });

  // Delete an address (admin only)
  deleteAddress = asyncHandler(async (req: Request, res: Response) => {
    const { addressId } = req.params;

    await this.addressService.deleteAddress(addressId);
    sendResponse(res, 200, {}, "Address deleted successfully");
  });
}

export default AddressController;
