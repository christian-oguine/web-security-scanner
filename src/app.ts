import "dotenv/config";
import express from "express";
import helmet from "helmet";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import scansRouter from "./routes/scans.js";
import { errorHandler } from "./middleware/errorHandler.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

app.use(express.static(join(__dirname, "../public")));
app.use(helmet());
app.use(express.json({ limit: "10kb" }));

app.use("/api/scans", scansRouter);

app.use(errorHandler);

export default app;