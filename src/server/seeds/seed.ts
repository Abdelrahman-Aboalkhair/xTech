import {
  PrismaClient,
  ROLE,
  TRANSACTION_STATUS,
  PAYMENT_STATUS,
  CART_STATUS,
  CHAT_STATUS,
  SECTION_TYPE,
  CART_EVENT,
} from "@prisma/client";
import {
  randEmail,
  randFullName,
  randPassword,
  randProductName,
  randNumber,
  randParagraph,
  randPastDate,
  randCity,
  randState,
  randCountry,
  randZipCode,
  randStreetAddress,
  randUuid,
  randUserName,
  randWord,
  randSentence,
  randBoolean,
  randColor,
} from "@ngneat/falso";

const prisma = new PrismaClient();

async function seed() {
  console.log("🔄 Starting database seeding...");

  // 1. Clear existing data (in correct dependency order)
  await prisma.log.deleteMany();
  await prisma.chatMessage.deleteMany();
  await prisma.chat.deleteMany();
  await prisma.cartEvent.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.cart.deleteMany();
  await prisma.transaction.deleteMany();
  await prisma.shipment.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.restock.deleteMany();
  await prisma.stockMovement.deleteMany();
  await prisma.productVariantAttribute.deleteMany();
  await prisma.categoryAttribute.deleteMany();
  await prisma.productVariant.deleteMany();
  await prisma.attributeValue.deleteMany();
  await prisma.attribute.deleteMany();
  await prisma.interaction.deleteMany();
  await prisma.review.deleteMany();
  await prisma.report.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.address.deleteMany();
  await prisma.section.deleteMany();
  await prisma.user.deleteMany();
  console.log("✅ Cleared existing data.");

  // 2. Users (including ADMIN & SUPERADMIN)
  const userData: Array<{
    id: string;
    name: string;
    email: string;
    password?: string;
    role: ROLE;
    createdAt: Date;
    updatedAt: Date;
    emailVerified: boolean;
  }> = Array.from({ length: 8 }).map(() => ({
    id: randUuid(),
    name: randFullName(),
    email: randEmail(),
    password: randPassword(),
    role: ROLE.USER,
    createdAt: randPastDate({ years: 1 }),
    updatedAt: randPastDate({ years: 1 }),
    emailVerified: randBoolean(),
  }));
  userData.push({
    id: randUuid(),
    name: "Admin User",
    email: "admin@example.com",
    password: "Admin123!",
    role: ROLE.ADMIN,
    createdAt: new Date(),
    updatedAt: new Date(),
    emailVerified: true,
  });
  userData.push({
    id: randUuid(),
    name: "Superadmin",
    email: "superadmin@example.com",
    password: "SuperAdmin123!",
    role: ROLE.SUPERADMIN,
    createdAt: new Date(),
    updatedAt: new Date(),
    emailVerified: true,
  });
  await prisma.user.createMany({ data: userData });
  const users = await prisma.user.findMany();
  console.log("✅ Seeded users & roles.");

  // 3. Addresses
  const addressData = users.map((u) => ({
    id: randUuid(),
    userId: u.id,
    city: randCity(),
    state: randState(),
    country: randCountry(),
    zip: randZipCode(),
    street: randStreetAddress(),
    createdAt: randPastDate({ years: 1 }),
    updatedAt: randPastDate({ years: 1 }),
  }));
  await prisma.address.createMany({ data: addressData });
  const addresses = await prisma.address.findMany();
  console.log("✅ Seeded addresses.");

  // 4. Categories
  const categoryData = Array.from({ length: 5 }).map(() => ({
    id: randUuid(),
    name: randProductName(),
    slug: randUserName().toLowerCase().replace(/\s+/g, "-"),
    description: randParagraph(),
    images: [randUuid(), randUuid()],
    createdAt: randPastDate({ years: 1 }),
    updatedAt: randPastDate({ years: 1 }),
  }));
  await prisma.category.createMany({ data: categoryData });
  const categories = await prisma.category.findMany();
  console.log("✅ Seeded categories.");

  // 5. Attributes & Values
  const attributeNames = [
    { name: "Size", values: ["Small", "Medium", "Large"] },
    { name: "Color", values: ["Red", "Blue", "Green", "Black"] },
    { name: "Material", values: ["Cotton", "Polyester", "Leather"] },
  ];
  const attributes = await Promise.all(
    attributeNames.map(async ({ name, values }) => {
      const attr = await prisma.attribute.create({
        data: {
          id: randUuid(),
          name,
          slug: name.toLowerCase().replace(/\s+/g, "-"),
          createdAt: randPastDate({ years: 1 }),
          updatedAt: randPastDate({ years: 1 }),
        },
      });
      const attributeValues = await Promise.all(
        values.map((val) =>
          prisma.attributeValue.create({
            data: {
              id: randUuid(),
              attributeId: attr.id,
              value: val,
              slug: val.toLowerCase().replace(/\s+/g, "-"),
              createdAt: randPastDate({ years: 1 }),
              updatedAt: randPastDate({ years: 1 }),
            },
          })
        )
      );
      return { ...attr, values: attributeValues };
    })
  );
  console.log("✅ Seeded attributes & values.");

  // 6. Category Attributes
  const categoryAttributes = categories.flatMap((cat) =>
    attributes.map((attr) => ({
      id: randUuid(),
      categoryId: cat.id,
      attributeId: attr.id,
      isRequired: randBoolean(),
      createdAt: randPastDate({ years: 1 }),
      updatedAt: randPastDate({ years: 1 }),
    }))
  );
  await prisma.categoryAttribute.createMany({ data: categoryAttributes });
  console.log("✅ Seeded category attributes.");

  // 7. Products
  const productData = Array.from({ length: 30 }).map(() => {
    const cat = categories[randNumber({ min: 0, max: categories.length - 1 })];
    return {
      id: randUuid(),
      name: randProductName(),
      description: randParagraph(),
      slug: randUserName().toLowerCase().replace(/\s+/g, "-"),
      salesCount: randNumber({ min: 0, max: 1000 }),
      isNew: randBoolean(),
      isFeatured: randBoolean(),
      isTrending: randBoolean(),
      isBestSeller: randBoolean(),
      averageRating: randNumber({ min: 0, max: 5, fraction: 1 }),
      reviewCount: randNumber({ min: 0, max: 100 }),
      categoryId: cat.id,
      createdAt: randPastDate({ years: 1 }),
      updatedAt: randPastDate({ years: 1 }),
    };
  });
  await prisma.product.createMany({ data: productData });
  const products = await prisma.product.findMany();
  console.log("✅ Seeded products.");

  // 8. Product Variants & Variant Attributes
  const variants = [];
  const variantAttributes = [];
  for (const prod of products) {
    const count = randNumber({ min: 2, max: 4 });
    for (let i = 0; i < count; i++) {
      const variantId = randUuid();
      const price = randNumber({ min: 10, max: 500, fraction: 2 });
      const stock = randNumber({ min: 0, max: 100 });
      variants.push({
        id: variantId,
        productId: prod.id,
        sku: randUuid(),
        images: [randUuid(), randUuid()],
        price,
        stock,
        lowStockThreshold: randNumber({ min: 5, max: 20 }),
        barcode: randUuid(),
        warehouseLocation: randWord(),
        createdAt: randPastDate({ years: 1 }),
        updatedAt: randPastDate({ years: 1 }),
      });

      const selectedAttributes = attributes
        .sort(() => 0.5 - Math.random())
        .slice(0, 3);
      for (const attr of selectedAttributes) {
        const value =
          attr.values[randNumber({ min: 0, max: attr.values.length - 1 })];
        variantAttributes.push({
          id: randUuid(),
          variantId,
          attributeId: attr.id,
          valueId: value.id,
          createdAt: randPastDate({ years: 1 }),
        });
      }
    }
  }
  await prisma.productVariant.createMany({ data: variants });
  await prisma.productVariantAttribute.createMany({ data: variantAttributes });
  const createdVariants = await prisma.productVariant.findMany();
  console.log("✅ Seeded product variants & attributes.");

  // 9. Stock Movements & Restocks
  const stockMovements = [];
  const restocks = [];
  for (const variant of createdVariants) {
    const movementCount = randNumber({ min: 1, max: 3 });
    for (let i = 0; i < movementCount; i++) {
      stockMovements.push({
        id: randUuid(),
        variantId: variant.id,
        quantity: randNumber({ min: -10, max: 20 }),
        reason: randSentence(),
        userId: users[randNumber({ min: 0, max: users.length - 1 })].id,
        createdAt: randPastDate({ years: 1 }),
      });
    }
    const restockCount = randNumber({ min: 0, max: 2 });
    for (let i = 0; i < restockCount; i++) {
      restocks.push({
        id: randUuid(),
        variantId: variant.id,
        quantity: randNumber({ min: 10, max: 50 }),
        notes: randParagraph(),
        userId: users[randNumber({ min: 0, max: users.length - 1 })].id,
        createdAt: randPastDate({ years: 1 }),
      });
    }
  }
  await prisma.stockMovement.createMany({ data: stockMovements });
  await prisma.restock.createMany({ data: restocks });
  console.log("✅ Seeded stock movements & restocks.");

  // 10. Reviews
  const reviews = [];
  for (const product of products) {
    const reviewCount = randNumber({ min: 0, max: 5 });
    for (let i = 0; i < reviewCount; i++) {
      reviews.push({
        id: randUuid(),
        userId: users[randNumber({ min: 0, max: users.length - 1 })].id,
        productId: product.id,
        rating: randNumber({ min: 1, max: 5 }),
        comment: randParagraph(),
        createdAt: randPastDate({ years: 1 }),
        updatedAt: randPastDate({ years: 1 }),
      });
    }
  }
  await prisma.review.createMany({ data: reviews });
  console.log("✅ Seeded reviews.");

  // 11. Orders, OrderItems, Payments, Shipments, Transactions
  const orders = [];
  const orderItems = [];
  const payments = [];
  const shipments = [];
  const transactions = [];
  for (const user of users) {
    const orderCount = randNumber({ min: 0, max: 3 });
    for (let i = 0; i < orderCount; i++) {
      const orderId = randUuid();
      const orderDate = randPastDate({ years: 1 });
      let total = 0;
      const itemCount = randNumber({ min: 1, max: 5 });
      for (let j = 0; j < itemCount; j++) {
        const variant =
          createdVariants[
            randNumber({ min: 0, max: createdVariants.length - 1 })
          ];
        const qty = randNumber({ min: 1, max: 4 });
        const price = variant.price;
        total += price * qty;
        orderItems.push({
          id: randUuid(),
          orderId,
          variantId: variant.id,
          quantity: qty,
          price,
          createdAt: orderDate,
          updatedAt: orderDate,
        });
      }
      orders.push({
        id: orderId,
        userId: user.id,
        amount: total,
        orderDate,
        status:
          Object.values(TRANSACTION_STATUS)[
            randNumber({
              min: 0,
              max: Object.values(TRANSACTION_STATUS).length - 1,
            })
          ],
        createdAt: orderDate,
        updatedAt: orderDate,
      });
      payments.push({
        id: randUuid(),
        method: ["Stripe", "PayPal", "CreditCard"][
          randNumber({ min: 0, max: 2 })
        ],
        amount: total,
        userId: user.id,
        orderId,
        status:
          Object.values(PAYMENT_STATUS)[
            randNumber({
              min: 0,
              max: Object.values(PAYMENT_STATUS).length - 1,
            })
          ],
        createdAt: orderDate,
        updatedAt: orderDate,
      });
      shipments.push({
        id: randUuid(),
        carrier: ["UPS", "FedEx", "DHL"][randNumber({ min: 0, max: 2 })],
        trackingNumber: randUuid(),
        shippedDate: orderDate,
        deliveryDate: randBoolean()
          ? new Date(
              orderDate.getTime() +
                1000 * 60 * 60 * 24 * randNumber({ min: 1, max: 7 })
            )
          : null,
        orderId,
        createdAt: orderDate,
        updatedAt: orderDate,
      });
      transactions.push({
        id: randUuid(),
        orderId,
        status:
          Object.values(TRANSACTION_STATUS)[
            randNumber({
              min: 0,
              max: Object.values(TRANSACTION_STATUS).length - 1,
            })
          ],
        transactionDate: orderDate,
        createdAt: orderDate,
        updatedAt: orderDate,
      });
    }
  }
  await prisma.order.createMany({ data: orders });
  await prisma.orderItem.createMany({ data: orderItems });
  await prisma.payment.createMany({ data: payments });
  await prisma.shipment.createMany({ data: shipments });
  await prisma.transaction.createMany({ data: transactions });
  console.log("✅ Seeded orders, items, payments, shipments & transactions.");

  // 12. Carts & CartItems & CartEvents
  const carts = [];
  const cartItems = [];
  const cartEvents = [];
  for (const user of users) {
    const cartCount = randNumber({ min: 0, max: 2 });
    for (let i = 0; i < cartCount; i++) {
      const cartId = randUuid();
      carts.push({
        id: cartId,
        userId: user.id,
        sessionId: randUuid(),
        status:
          Object.values(CART_STATUS)[
            randNumber({ min: 0, max: Object.values(CART_STATUS).length - 1 })
          ],
        createdAt: randPastDate({ years: 1 }),
        updatedAt: randPastDate({ years: 1 }),
      });
      const itemCount = randNumber({ min: 1, max: 3 });
      for (let j = 0; j < itemCount; j++) {
        const variant =
          createdVariants[
            randNumber({ min: 0, max: createdVariants.length - 1 })
          ];
        cartItems.push({
          id: randUuid(),
          cartId,
          variantId: variant.id,
          quantity: randNumber({ min: 1, max: 5 }),
          createdAt: randPastDate({ years: 1 }),
          updatedAt: randPastDate({ years: 1 }),
        });
      }
      cartEvents.push({
        id: randUuid(),
        cartId,
        userId: user.id,
        sessionId: randUuid(),
        eventType:
          Object.values(CART_EVENT)[
            randNumber({ min: 0, max: Object.values(CART_EVENT).length - 1 })
          ],
        timestamp: randPastDate({ years: 1 }),
        createdAt: randPastDate({ years: 1 }),
      });
    }
  }
  await prisma.cart.createMany({ data: carts });
  await prisma.cartItem.createMany({ data: cartItems });
  await prisma.cartEvent.createMany({ data: cartEvents });
  console.log("✅ Seeded carts, cart items & cart events.");

  // 13. Interactions
  const interactions = [];
  for (const user of users.slice(0, 5)) {
    const interactionCount = randNumber({ min: 1, max: 5 });
    for (let i = 0; i < interactionCount; i++) {
      interactions.push({
        id: randUuid(),
        userId: user.id,
        sessionId: randUuid(),
        productId:
          products[randNumber({ min: 0, max: products.length - 1 })].id,
        type: ["VIEW", "CLICK", "ADD_TO_CART"][randNumber({ min: 0, max: 2 })],
        createdAt: randPastDate({ years: 1 }),
      });
    }
  }
  await prisma.interaction.createMany({ data: interactions });
  console.log("✅ Seeded interactions.");

  // 14. Reports
  const reports = [];
  for (const user of users.slice(0, 3)) {
    reports.push({
      id: randUuid(),
      type: ["SALES", "USER_ACTIVITY", "INVENTORY"][
        randNumber({ min: 0, max: 2 })
      ],
      format: ["PDF", "CSV"][randNumber({ min: 0, max: 1 })],
      userId: user.id,
      parameters: { filters: randWord() },
      filePath: `/reports/${randUuid()}.pdf`,
      createdAt: randPastDate({ years: 1 }),
    });
  }
  await prisma.report.createMany({ data: reports });
  console.log("✅ Seeded reports.");

  // 15. Sections
  const sections = [];
  for (const type of Object.values(SECTION_TYPE)) {
    sections.push({
      type,
      title: Array.from({ length: 3 }, () => randWord()).join(" "),
      description: randParagraph(),
      images: [randUuid(), randUuid()],
      icons: randUuid(),
      link: `https://example.com/${randWord()}`,
      ctaText: Array.from({ length: 2 }, () => randWord()).join(" "),
      isVisible: randBoolean(),
      primaryColor: randColor(),
      secondaryColor: randColor(),
    });
  }
  await prisma.section.createMany({ data: sections });
  console.log("✅ Seeded sections.");

  // 16. Chats & Chat Messages
  const chats = [];
  const chatMessages = [];
  const adminUser = userData.find((u) => u.role === ROLE.ADMIN);
  if (!adminUser) throw new Error("Admin user not found");
  for (const user of users.slice(0, 5)) {
    const chatId = randUuid();
    chats.push({
      id: chatId,
      userId: user.id,
      status:
        Object.values(CHAT_STATUS)[
          randNumber({ min: 0, max: Object.values(CHAT_STATUS).length - 1 })
        ],
      createdAt: randPastDate({ years: 1 }),
      updatedAt: randPastDate({ years: 1 }),
    });
    const messageCount = randNumber({ min: 2, max: 5 });
    for (let i = 0; i < messageCount; i++) {
      const isAdmin = i % 2 === 1;
      chatMessages.push({
        id: randUuid(),
        chatId,
        senderId: isAdmin ? adminUser.id : user.id,
        content: isAdmin
          ? "Sure, let me check your order status."
          : randSentence(),
        type: "TEXT",
        createdAt: randPastDate({ years: 1 }),
      });
    }
  }
  await prisma.chat.createMany({ data: chats });
  await prisma.chatMessage.createMany({ data: chatMessages });
  console.log("✅ Seeded chats & messages.");

  // 17. Logs
  const logs = Array.from({ length: 20 }).map(() => ({
    id: randUuid(),
    level: ["info", "warn", "error"][randNumber({ min: 0, max: 2 })],
    message: Array.from({ length: 5 }, () => randWord()).join(" "),
    context: { details: randSentence() },
    createdAt: randPastDate({ years: 1 }),
  }));
  await prisma.log.createMany({ data: logs });
  console.log("✅ Seeded logs.");

  console.log("🎉 Database seeding complete!");
}

seed()
  .catch((e) => {
    console.error("❌ Seeding error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
