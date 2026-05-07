import "dotenv/config";
import express from "express";
import helmet from "helmet";
import { rateLimit } from "express-rate-limit";

const app = express();

app.use(helmet());
app.use(express.json());

app.use(
  rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 3,
    message: {
      error: "Too many scan requests from this IP. Please try again in an hour.",
    },
  })
);

export default app;