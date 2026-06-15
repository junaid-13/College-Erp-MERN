"use strict";

const Joi = require("joi");

const MIN_PASSWORD_LENGTH = 6;

const changePasswordSchema = Joi.object({
  oldPassword: Joi.string().required().messages({
    "any.required": "Old password is required",
  }),
  newPassword: Joi.string()
    .min(MIN_PASSWORD_LENGTH)
    .required()
    .messages({
      "any.required": "New password is required",
      "string.min": `New password must be at least ${MIN_PASSWORD_LENGTH} characters`,
    }),
});

module.exports = { changePasswordSchema, MIN_PASSWORD_LENGTH };
