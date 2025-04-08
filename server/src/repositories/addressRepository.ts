import prisma from "../config/database";

class AddressRepository {
  async findAddressesByUserId(userId: string) {
    return prisma.address.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
  }

  async findAddressById(addressId: string) {
    return prisma.address.findUnique({
      where: { id: addressId },
    });
  }

  async deleteAddress(addressId: string) {
    return prisma.address.delete({
      where: { id: addressId },
    });
  }
}

export default AddressRepository;
