import "dotenv/config";
import express from "express";
import helmet from "helmet";
//import scansRouter from "./routes/scans.js";
import { errorHandler } from "./middleware/errorHandler.js";

const app = express();

app.use(helmet());
app.use(express.json({ limit: "10kb" }));

//app.use("/api/scans", scansRouter);

app.use(errorHandler);

export default app;