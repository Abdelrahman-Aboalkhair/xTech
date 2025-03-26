import prisma from "../config/database";
import AppError from "../utils/AppError";

interface CartLookupParams {
  userId?: string;
  cartId?: string; // guest cart identifier
}

interface CartItemInput {
  productId: string;
  quantity: number;
}

/**
 * *NOTE: For guest carts, your Cart model’s userId should be nullable.
 * For example:
 *
 * model Cart {
 *   id        String     @id @default(uuid())
 *   user      User?      @relation(fields: [userId], references: [id])
 *   userId    String?
 *   cartItems CartItem[]
 *   createdAt DateTime   @default(now())
 *   updatedAt DateTime   @updatedAt
 * }
 */

class CartService {
  /**
   * Get a cart based on either userId (logged in) or cartId (guest).
   * If no cart exists, a new one is created.
   */
  static async getCart({ userId, cartId }: CartLookupParams) {
    let cart;
    if (userId) {
      cart = await prisma.cart.findUnique({
        where: { userId },
        include: { cartItems: { include: { product: true } } },
      });
      if (!cart) {
        cart = await prisma.cart.create({
          data: { userId },
          include: { cartItems: { include: { product: true } } },
        });
      }
    } else if (cartId) {
      cart = await prisma.cart.findUnique({
        where: { id: cartId },
        include: { cartItems: { include: { product: true } } },
      });
      if (!cart) {
        // Create a new guest cart using the provided cartId if needed.
        // (Alternatively, you can let the client generate a cart id.)
        cart = await prisma.cart.create({
          data: { id: cartId },
          include: { cartItems: { include: { product: true } } },
        });
      }
    } else {
      throw new AppError(400, "No identifier provided for cart lookup");
    }
    return cart;
  }

  /**
   * Add a product to the cart.
   * If the item exists, increment its quantity.
   */
  static async addToCart(
    { userId, cartId }: CartLookupParams,
    { productId, quantity }: CartItemInput
  ) {
    const cart = await this.getCart({ userId, cartId });

    // Try to find an existing cart item for the product.
    const existingItem = await prisma.cartItem.findFirst({
      where: { cartId: cart.id, productId },
    });

    if (existingItem) {
      await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + quantity },
      });
    } else {
      await prisma.cartItem.create({
        data: { cartId: cart.id, productId, quantity },
      });
    }

    return await this.getCart({ userId, cartId });
  }

  /**
   * Update the quantity of a product in the cart.
   * If quantity is set to 0 or less, the item is removed.
   */
  static async updateCartItem(
    { userId, cartId }: CartLookupParams,
    { productId, quantity }: CartItemInput
  ) {
    const cart = await this.getCart({ userId, cartId });

    const cartItem = await prisma.cartItem.findFirst({
      where: { cartId: cart.id, productId },
    });

    if (!cartItem) {
      throw new AppError(404, "Product not in cart");
    }

    if (quantity <= 0) {
      await prisma.cartItem.delete({ where: { id: cartItem.id } });
    } else {
      await prisma.cartItem.update({
        where: { id: cartItem.id },
        data: { quantity },
      });
    }

    return await this.getCart({ userId, cartId });
  }

  /**
   * Remove a product from the cart.
   */
  static async removeFromCart(
    { userId, cartId }: CartLookupParams,
    productId: string
  ) {
    const cart = await this.getCart({ userId, cartId });

    const cartItem = await prisma.cartItem.findFirst({
      where: { cartId: cart.id, productId },
    });

    if (!cartItem) {
      throw new AppError(404, "Product not in cart");
    }

    await prisma.cartItem.delete({ where: { id: cartItem.id } });
    return await this.getCart({ userId, cartId });
  }

  /**
   * Clear all items from the cart.
   */
  static async clearCart({ userId, cartId }: CartLookupParams) {
    const cart = await this.getCart({ userId, cartId });
    await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
    return await this.getCart({ userId, cartId });
  }

  /**
   * Merge a guest cart into a logged-in user's cart.
   * This method should be called when a guest user logs in.
   */
  static async mergeGuestCartIntoUserCart(guestCartId: string, userId: string) {
    // Fetch guest cart (if exists)
    const guestCart = await prisma.cart.findUnique({
      where: { id: guestCartId },
      include: { cartItems: true },
    });
    if (!guestCart) return;

    // Get the user's cart (or create one if it doesn't exist)
    const userCart = await this.getCart({ userId });

    // For each item in the guest cart, add or update in the user's cart.
    for (const item of guestCart.cartItems) {
      const existingItem = await prisma.cartItem.findFirst({
        where: { cartId: userCart.id, productId: item.productId },
      });
      if (existingItem) {
        await prisma.cartItem.update({
          where: { id: existingItem.id },
          data: { quantity: existingItem.quantity + item.quantity },
        });
      } else {
        await prisma.cartItem.create({
          data: {
            cartId: userCart.id,
            productId: item.productId,
            quantity: item.quantity,
          },
        });
      }
    }

    // Delete the guest cart after merging.
    await prisma.cart.delete({ where: { id: guestCartId } });

    return userCart;
  }
}

export default CartService;
