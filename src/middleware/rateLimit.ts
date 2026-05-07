import { rateLimit } from "express-rate-limit";

export const scanRateLimit = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: "Too many scan requests from this IP. Please try again in an hour.",
  },
});