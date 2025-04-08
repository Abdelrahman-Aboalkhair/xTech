import AppError from "../utils/AppError";
import AddressRepository from "../repositories/addressRepository";

class AddressService {
  constructor(private addressRepository: AddressRepository) {}

  // Get all addresses for the authenticated user
  async getUserAddresses(userId: string) {
    const addresses = await this.addressRepository.findAddressesByUserId(
      userId
    );
    if (!addresses || addresses.length === 0) {
      throw new AppError(404, "No addresses found for this user");
    }
    return addresses;
  }

  // Get details of a specific address
  async getAddressDetails(addressId: string, userId: string) {
    const address = await this.addressRepository.findAddressById(addressId);
    if (!address) {
      throw new AppError(404, "Address not found");
    }
    if (address.userId !== userId) {
      throw new AppError(403, "You are not authorized to view this address");
    }
    return address;
  }

  // Delete an address (admin only)
  async deleteAddress(addressId: string) {
    const address = await this.addressRepository.findAddressById(addressId);
    if (!address) {
      throw new AppError(404, "Address not found");
    }
    return this.addressRepository.deleteAddress(addressId);
  }
}

export default AddressService;
