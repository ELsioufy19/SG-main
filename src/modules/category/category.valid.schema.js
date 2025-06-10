import joi from "joi";
import { Types } from "mongoose";

export const idValidator = (value, helper) =>
  Types.ObjectId.isValid(value) ? true : helper.message("Invalid id");

export const createCatSchema = joi.object({
  name: joi.string().min(3).required(),
});

export const updateSchema = joi.object({
  name: joi.string().min(3),
  catId: joi.string().custom(idValidator).required(),
});

export const deleteSchema = joi.object({
  catId: joi.string().custom(idValidator).required(),
});
