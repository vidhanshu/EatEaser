import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { Request } from "express";
import { config, s3Client } from "../../configs";

export const generateOTP = (digit: number) => {
  let otp = "";
  for (let i = 0; i < digit; i++) {
    otp += Math.floor(Math.random() * 10);
  }
  return otp;
};

export const getClientDomain = (req: Request) =>
  `${req.protocol}://${req.get("host")}`;

export const deleteImage = async (
  url: string,
  path: string = "restaurant/"
) => {
  const filename = url.split("/").pop();
  const command = new DeleteObjectCommand({
    Bucket: config.s3.bucket_name,
    Key: `${path}${filename}`,
  });
  await s3Client.send(command);
};
