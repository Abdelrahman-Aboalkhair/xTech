import Joi, { Schema } from "joi";
import validateRequest from "../utils/validation/validateRequest";

const createCategorySchema: Schema = Joi.object({
  name: Joi.string().min(3).max(50).required().messages({
    "string.empty": "Category name is required",
    "string.min": "Category name must be at least {#limit} characters",
    "string.max": "Category name must be at most {#limit} characters",
    "any.required": "Category name is required",
  }),
});

const validateCreateCategory = validateRequest(createCategorySchema);

export { validateCreateCategory };
