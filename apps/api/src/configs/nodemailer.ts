import nodemailer from "nodemailer";
import { config } from "./config";

export const transport = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: config.email.gmail_id,
    pass: config.email.gmail_password,
  },
});
