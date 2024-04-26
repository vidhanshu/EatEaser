import { S3Client } from "@aws-sdk/client-s3";
import { config } from "./config";

export const s3Client = new S3Client({
  region: "ap-south-1",
  credentials: {
    accessKeyId: config.s3.access_key,
    secretAccessKey: config.s3.secret_key,
  },
});
