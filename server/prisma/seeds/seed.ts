import { PrismaClient } from "@prisma/client";
import { randEmail, randFullName, randPassword, randProductName, randNumber, randParagraph, randPastDate, randCity, randState, randCountry, randZipCode, randStreetAddress, randUuid, randUserName } from "@ngneat/falso";
interface OrderItem {
    orderId: string;
    productId: string;
    quantity: number;
    price: number;
    createdAt: Date;
    updatedAt: Date;
  }
const prisma = new PrismaClient();

async function seed() {
  try {
    console.log("Starting database seeding...");

    // Clear existing data for seeded models
    await prisma.orderItem.deleteMany();
    await prisma.order.deleteMany();
    await prisma.address.deleteMany();
    await prisma.product.deleteMany();
    await prisma.category.deleteMany();
    await prisma.user.deleteMany();
    console.log("Cleared existing data.");

    // Seed Categories (5 categories)
    const categories = Array.from({ length: 5 }, () => ({
      name: randProductName(), // e.g., "Electronics", "Clothing"
      slug: randUserName(),    // e.g., "electronics", "clothing"
      description: randParagraph(),
      images: [randUuid()],    // Placeholder for image URLs
      createdAt: randPastDate({ years: 1 }),
      updatedAt: randPastDate({ years: 1 }),
    }));
    await prisma.category.createMany({ data: categories });
    console.log("Seeded 5 categories.");
    const createdCategories = await prisma.category.findMany();

    // Seed Users (10 users)
    const users: any = Array.from({ length: 10 }, () => ({
      email: randEmail(),
      name: randFullName(),
      password: randPassword(), // In production, hash passwords
      role: "USER",
      createdAt: randPastDate({ years: 1 }),
      updatedAt: randPastDate({ years: 1 }),
    }));
    await prisma.user.createMany({ data: users });
    console.log("Seeded 10 users.");
    const createdUsers = await prisma.user.findMany();

    // Seed Addresses (one address per user)
    const addresses = createdUsers.map((user) => ({
      userId: user.id,
      city: randCity(),
      state: randState(),
      country: randCountry(),
      zip: randZipCode(),
      street: randStreetAddress(),
      createdAt: randPastDate({ years: 1 }),
      updatedAt: randPastDate({ years: 1 }),
    }));
    await prisma.address.createMany({ data: addresses });
    console.log("Seeded 10 addresses.");

    // Seed Products (50 products, linked to random categories)
    const products = Array.from({ length: 50 }, () => {
      const category = createdCategories[randNumber({ min: 0, max: createdCategories.length - 1 })];
      return {
        name: randProductName(),
        description: randParagraph(),
        price: randNumber({ min: 10, max: 1000, fraction: 2 }),
        discount: randNumber({ min: 0, max: 20, fraction: 2 }),
        slug: randUserName(),
        images: [randUuid()], // Placeholder for image URLs
        stock: randNumber({ min: 0, max: 100 }),
        salesCount: randNumber({ min: 0, max: 50 }),
        categoryId: category.id,
        createdAt: randPastDate({ years: 1 }),
        updatedAt: randPastDate({ years: 1 }),
      };
    });
    await prisma.product.createMany({ data: products });
    console.log("Seeded 50 products.");
    const createdProducts = await prisma.product.findMany();

    // Seed Orders (20 orders, each linked to a user)
    const orders = Array.from({ length: 20 }, () => {
      const user = createdUsers[randNumber({ min: 0, max: createdUsers.length - 1 })];
      return {
        userId: user.id,
        amount: 0, // Will be calculated based on order items
        orderDate: randPastDate({ years: 1 }),
        createdAt: randPastDate({ years: 1 }),
        updatedAt: randPastDate({ years: 1 }),
      };
    });
    await prisma.order.createMany({ data: orders });
    console.log("Seeded 20 orders.");
    const createdOrders = await prisma.order.findMany();

    // Seed OrderItems (1-3 items per order)
    const orderItems: OrderItem[] = [];
    for (const order of createdOrders) {
      const numItems = randNumber({ min: 1, max: 3 });
      for (let i = 0; i < numItems; i++) {
        const product = createdProducts[randNumber({ min: 0, max: createdProducts.length - 1 })];
        const quantity = randNumber({ min: 1, max: 5 });
        orderItems.push({
          orderId: order.id,
          productId: product.id,
          quantity,
          price: product.price - (product.price * product.discount / 100), // Apply discount
          createdAt: randPastDate({ years: 1 }),
          updatedAt: randPastDate({ years: 1 }),
        });
      }
    }
    await prisma.orderItem.createMany({ data: orderItems });
    console.log("Seeded order items.");

    // Update Order amounts based on order items
    for (const order of createdOrders) {
      const items = await prisma.orderItem.findMany({ where: { orderId: order.id } });
      const totalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
      await prisma.order.update({
        where: { id: order.id },
        data: { amount: totalAmount },
      });
    }
    console.log("Updated order amounts.");

    console.log("Database seeding completed successfully!");
  } catch (error) {
    console.error("Error during seeding:", error);
    
    // ! Not working
    // process.exit(1);
    
  } finally {
    await prisma.$disconnect();
  }
}

seed();