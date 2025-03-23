import prisma from "../config/database";

const getAllUsers = async () => {
  return await prisma.user.findMany();
};

const getUserById = async (id: number) => {
  return await prisma.user.findUnique({ where: { id } });
};

const getUserByEmail = async (email: string) => {
  return await prisma.user.findUnique({ where: { email } });
};

const getMe = async (id: number) => {
  return await prisma.user.findUnique({ where: { id } });
};

const updateMe = async (id: number, data: any) => {
  return await prisma.user.update({ where: { id }, data });
};

const deleteUser = async (id: number) => {
  return await prisma.user.delete({ where: { id } });
};

export {
  getAllUsers,
  getUserById,
  getUserByEmail,
  getMe,
  updateMe,
  deleteUser,
};
