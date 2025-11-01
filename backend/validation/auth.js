import Joi from "joi";

export const signup = Joi.object({
  name: Joi.string().min(3).max(50).required().messages({
    "string.empty": "Name is required.",
    "string.min": "Name must be at least 3 characters long.",
    "string.max": "Name cannot exceed 50 characters.",
  }),

  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required()
    .messages({
      "string.empty": "Email is required.",
      "string.email": "Please enter a valid email address.",
    }),

  password: Joi.string()
    .min(6)
    .max(32)
    .pattern(new RegExp("^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9]).*$"))
    .required()
    .messages({
      "string.empty": "Password is required.",
      "string.min": "Password must be at least 6 characters long.",
      "string.max": "Password cannot exceed 32 characters.",
      "string.pattern.base":
        "Password must include at least one uppercase letter, one lowercase letter, and one number.",
    }),
});

export const login = Joi.object({
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required()
    .messages({
      "string.empty": "Email is required.",
      "string.email": "Invalid email address.",
    }),

  password: Joi.string().required().messages({
    "string.empty": "Password is required.",
  }),
});
