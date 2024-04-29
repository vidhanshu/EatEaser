import * as dotenv from "dotenv";
import Joi from "joi";

dotenv.config();

const envSchema = Joi.object().keys({
  PORT: Joi.string().required().default("4000"),
  CORS_ORIGIN: Joi.string().required().default("*"),
  ACCESS_TOKEN_SECRET: Joi.string().min(8).required(),
  ACCESS_TOKEN_EXPIRE: Joi.string().required().default("20m"),
  MONGO_URI: Joi.string().required(),
  GMAIL_ID: Joi.string().email().required(),
  GMAIL_PASSWORD: Joi.string().required(),
  REDIS_URI: Joi.string().required(),
  REDIS_TOKEN: Joi.string().required(),
  S3_BUCKET_NAME: Joi.string().required(),
  S3_ACCESS_KEY: Joi.string().required(),
  S3_SECRET_KEY: Joi.string().required(),
  RAZORPAY_KEY_id: Joi.string().required(),
  RAZORPAY_KEY_SECRET: Joi.string().required(),
});

const { value: validatedEnv, error } = envSchema
  .prefs({ errors: { label: "key" } })
  .validate(process.env, { abortEarly: false, stripUnknown: true });

if (error) {
  throw new Error(
    `Environment validation error: \n${error.details
      .map((detail) => detail.message)
      .join("\n")}`
  );
}

export const config = {
  port: validatedEnv.PORT,
  cors: {
    cors_origin: validatedEnv.CORS_ORIGIN,
  },
  jwt: {
    secret: validatedEnv.ACCESS_TOKEN_SECRET,
    expire: validatedEnv.ACCESS_TOKEN_EXPIRE,
  },
  mongo: {
    uri: validatedEnv.MONGO_URI,
  },
  email: {
    gmail_id: validatedEnv.GMAIL_ID,
    gmail_password: validatedEnv.GMAIL_PASSWORD,
  },
  redis: {
    uri: validatedEnv.REDIS_URI,
    token: validatedEnv.REDIS_TOKEN,
  },
  s3: {
    bucket_name: validatedEnv.S3_BUCKET_NAME,
    access_key: validatedEnv.S3_ACCESS_KEY,
    secret_key: validatedEnv.S3_SECRET_KEY,
  },
  rzrpay: {
    RAZORPAY_KEY_id: validatedEnv.RAZORPAY_KEY_id,
    RAZORPAY_KEY_SECRET: validatedEnv.RAZORPAY_KEY_SECRET,
  },
};
