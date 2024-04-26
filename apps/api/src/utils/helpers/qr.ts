import fs from "fs";
import qr from "qrcode";
import path from "path";
import { DeleteObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { config, s3Client } from "../../configs";

const uploadToS3 = async (filename: string, path: string) => {
  const command = new PutObjectCommand({
    Bucket: config.s3.bucket_name,
    Key: `restaurant/${filename}`,
    ContentType: "image/png",
    Body: fs.createReadStream(path),
  });
  await s3Client.send(command);
};

export const generateAndUploadQR = async (url: string, filename: string) => {
  const pQr = path.join(__dirname, "../assets/", filename);
  // create qr code and save it to the file
  await qr.toFile(pQr, url);
  
  // // Add watermark in the center with opacity 0.5
  // const pWm = path.join(__dirname, "../assets/logo.png");
  // const image = await jimp.read(pQr);
  // const watermark = await jimp.read(pWm);
  // watermark.resize(50, 50);
  // const x = (image.bitmap.width - watermark.bitmap.width) / 2;
  // const y = (image.bitmap.height - watermark.bitmap.height) / 2;

  // image.composite(watermark, x, y, {
  //   mode: jimp.BLEND_SOURCE_OVER,
  //   opacityDest: 1,
  //   opacitySource: 1,
  // });
  // await image.writeAsync(pQr);

  // upload to s3
  await uploadToS3(filename, pQr);
  // delete the file
  fs.unlinkSync(pQr);
  // return the url
  return `https://${config.s3.bucket_name}.s3.ap-south-1.amazonaws.com/restaurant/${filename}`;
};

export const deleteQR = async (url: string) => {
  const filename = url.split("/").pop();
  const command = new DeleteObjectCommand({
    Bucket: config.s3.bucket_name,
    Key: `restaurant/${filename}`,
  });
  await s3Client.send(command);
};
