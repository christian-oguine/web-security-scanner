import { Router } from "express";
import { createScan, getScan } from "../controllers/scans.controller.js";
import { scanRateLimit } from "../middleware/rateLimit.js";

const router = Router();

router.post("/", scanRateLimit, createScan);
router.get("/:id", getScan);

export default router;