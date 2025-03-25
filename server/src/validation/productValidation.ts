import Joi, { Schema } from "joi";
import validateRequest from "../helpers/validateRequest";

const createProductSchema: Schema = Joi.object({
  name: Joi.string().min(3).max(100).required().messages({
    "string.empty": "Product name is required",
    "string.min": "Product name must be at least {#limit} characters",
    "string.max": "Product name must be at most {#limit} characters",
    "any.required": "Product name is required",
  }),

  description: Joi.string().allow(null, "").max(500).messages({
    "string.max": "Description cannot exceed {#limit} characters",
  }),

  price: Joi.number().positive().precision(2).required().messages({
    "number.base": "Price must be a valid number",
    "number.positive": "Price must be greater than zero",
    "any.required": "Price is required",
  }),

  discount: Joi.number().min(0).max(100).default(0).messages({
    "number.min": "Discount cannot be negative",
    "number.max": "Discount cannot exceed 100%",
  }),

  images: Joi.array()
    .items(
      Joi.string().uri().messages({
        "string.uri": "Each image must be a valid URL",
      })
    )
    .min(1)
    .required()
    .messages({
      "array.min": "At least one product image is required",
      "any.required": "Product images are required",
    }),

  stock: Joi.number().integer().min(0).required().messages({
    "number.base": "Stock must be a valid number",
    "number.integer": "Stock must be an integer",
    "number.min": "Stock cannot be negative",
    "any.required": "Stock quantity is required",
  }),

  categoryId: Joi.number().integer().optional().messages({
    "number.base": "Category ID must be a valid number",
    "number.integer": "Category ID must be an integer",
  }),

  bestSeller: Joi.boolean().default(false).messages({
    "boolean.base": "BestSeller must be a boolean value",
  }),

  featured: Joi.boolean().default(false).messages({
    "boolean.base": "Featured must be a boolean value",
  }),
});

const updateProductSchema: Schema = Joi.object({
  name: Joi.string().min(3).max(100).messages({
    "string.min": "Product name must be at least {#limit} characters",
    "string.max": "Product name must be at most {#limit} characters",
  }),

  description: Joi.string().allow(null, "").max(500).messages({
    "string.max": "Description cannot exceed {#limit} characters",
  }),

  price: Joi.number().positive().precision(2).messages({
    "number.base": "Price must be a valid number",
    "number.positive": "Price must be greater than zero",
  }),

  discount: Joi.number().min(0).max(100).messages({
    "number.min": "Discount cannot be negative",
    "number.max": "Discount cannot exceed 100%",
  }),

  images: Joi.array()
    .items(
      Joi.string().uri().messages({
        "string.uri": "Each image must be a valid URL",
      })
    )
    .min(1)
    .messages({
      "array.min": "At least one product image is required",
    }),

  stock: Joi.number().integer().min(0).messages({
    "number.base": "Stock must be a valid number",
    "number.integer": "Stock must be an integer",
    "number.min": "Stock cannot be negative",
  }),

  categoryId: Joi.number().integer().messages({
    "number.base": "Category ID must be a valid number",
    "number.integer": "Category ID must be an integer",
  }),

  bestSeller: Joi.boolean().messages({
    "boolean.base": "BestSeller must be a boolean value",
  }),

  featured: Joi.boolean().messages({
    "boolean.base": "Featured must be a boolean value",
  }),
})
  .min(1)
  .messages({
    "object.min": "At least one field must be updated",
  });

const validateCreateProduct = validateRequest(createProductSchema);
const validateUpdateProduct = validateRequest(updateProductSchema);

export { validateCreateProduct, validateUpdateProduct };
