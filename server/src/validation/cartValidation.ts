import Joi from "joi";
import validateRequest from "../utils/validation/validateRequest";

// Schema for adding a product to the cart
const addProductToCartSchema = Joi.object({
  productId: Joi.string().uuid().required().messages({
    "string.base": "Product ID must be a string.",
    "string.guid": "Invalid Product ID format.",
    "any.required": "Product ID is required.",
  }),
  quantity: Joi.number().integer().min(1).required().messages({
    "number.base": "Quantity must be a number.",
    "number.integer": "Quantity must be an integer.",
    "number.min": "Quantity must be at least 1.",
    "any.required": "Quantity is required.",
  }),
});

// Schema for updating a cart item
const updateCartItemSchema = Joi.object({
  productId: Joi.string().uuid().required().messages({
    "string.base": "Product ID must be a string.",
    "string.guid": "Invalid Product ID format.",
    "any.required": "Product ID is required.",
  }),
  quantity: Joi.number().integer().min(0).required().messages({
    "number.base": "Quantity must be a number.",
    "number.integer": "Quantity must be an integer.",
    "number.min": "Quantity cannot be negative.",
    "any.required": "Quantity is required.",
  }),
});

// Schema for removing a product from the cart
const removeProductFromCartSchema = Joi.object({
  productId: Joi.string().uuid().required().messages({
    "string.base": "Product ID must be a string.",
    "string.guid": "Invalid Product ID format.",
    "any.required": "Product ID is required.",
  }),
});

// Validation Middleware
const validateAddProductToCart = validateRequest(addProductToCartSchema);
const validateUpdateCartItem = validateRequest(updateCartItemSchema);
const validateRemoveProductFromCart = validateRequest(
  removeProductFromCartSchema
);

export {
  validateAddProductToCart,
  validateUpdateCartItem,
  validateRemoveProductFromCart,
};
