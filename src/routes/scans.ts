import { Router } from "express";
import { createScan } from "../controllers/scans.controller.js";
import { scanRateLimit } from "../middleware/rateLimit.js";

const router = Router();

router.post("/", scanRateLimit, createScan);

export default router;