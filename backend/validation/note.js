import Joi from "joi";

export const noteValidation = Joi.object({
  title: Joi.string().min(1).max(100).required().messages({
    "string.empty": "Title is required",
  }),
  description: Joi.string().min(1).max(500).required().messages({
    "string.empty": "Description is required",
  }),
});
