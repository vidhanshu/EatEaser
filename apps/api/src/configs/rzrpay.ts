import Razorpay from "razorpay";
import { config } from "./config";

export const razorPay = new Razorpay({
  key_id: config.rzrpay.RAZORPAY_KEY_id,
  key_secret: config.rzrpay.RAZORPAY_KEY_SECRET,
});
