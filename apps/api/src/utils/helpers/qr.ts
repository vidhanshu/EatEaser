import { DeleteObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import path from "path";
import qr from "qrcode";
import { config, s3Client } from "../../configs";

const uploadToS3 = async (filename: string, buffer: Buffer) => {
  const command = new PutObjectCommand({
    Bucket: config.s3.bucket_name,
    Key: `restaurant/${filename}`,
    ContentType: "image/png",
    Body: buffer,
  });
  await s3Client.send(command);
};

export const generateAndUploadQR = async (url: string, filename: string) => {
  const pQr = path.join(__dirname, "../assets/", filename);
  // create qr code and save it to the file
  await qr.toFile(pQr, url);
  qr.toBuffer(url, async (err, buffer) => {
    if (!err) {
      await uploadToS3(filename, buffer);
    }
  });

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
