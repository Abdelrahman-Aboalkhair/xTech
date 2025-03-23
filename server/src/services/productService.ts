import prisma from "../config/database";

export const getAllProducts = async () => {
  return await prisma.product.findMany();
};

export const createProduct = async (data: {
  name: string;
  description?: string;
  price: number;
  stock: number;
}) => {
  return await prisma.product.create({ data });
};

export const updateProduct = async (id: number, data: any) => {
  return await prisma.product.update({ where: { id }, data });
};

export const deleteProduct = async (id: number) => {
  return await prisma.product.delete({ where: { id } });
};
