import { rateLimit } from "express-rate-limit";
import { sendResponse } from "../utils/response";

export const authLimiter = rateLimit({
  // Set the time window for rate limiting to 15 minutes (15 * 60 seconds * 1000 milliseconds)
  windowMs: 15 * 60 * 1000,
  // Set the maximum allowed number of requests within the window to 20
  max: 20,
  // Skip applying rate limiting to successful requests (prevents blocking legitimate users)
  skipSuccessfulRequests: true,
  handler: (_, res) => {
    sendResponse(res, {
      message: "Too many requests, please try after 15 minutes",
      statusCode: 429,
    });
  },
});
