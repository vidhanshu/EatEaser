import Joi from "joi";
import { S3_ALL_AVAILABLE_PATHS } from "../constants";

const uploadFileSchema = {
  query: Joi.object().keys({
    path: Joi.string()
      .valid(...S3_ALL_AVAILABLE_PATHS)
      .required(),
  }),
};
const deleteFileSchema = {
  body: Joi.object({}).keys({
    key: Joi.string()
      .pattern(/^[^\s/]+\/[^\s/.]+\.[^\s.]+$/)
      .messages({
        "string.pattern.base":
          "Invalid key format. It should be like 'folder/file.ext'",
      })
      .required(),
  }),
};
export const s3Validation = {
  deleteFileSchema,
  uploadFileSchema,
};
