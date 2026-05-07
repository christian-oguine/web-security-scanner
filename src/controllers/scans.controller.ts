import { Request, Response } from "express";
import { scanRequestSchema } from "../validators/scan.validator.js";
import { checkHeaders } from "../services/checks/headers.js";
import { checkSSL } from "../services/checks/ssl.js";

export async function createScan(req: Request, res: Response) {
  try {
    const parsed = scanRequestSchema.safeParse(req.body);

    if (!parsed.success) {
      res.status(400).json({
        error: "Validation failed",
        details: parsed.error.issues.map((issue) => issue.message),
      });
      return;
    }

    const { url } = parsed.data;
    const hostname = new URL(url).hostname;

    const [headerResults, sslResult] = await Promise.allSettled([
      checkHeaders(url),
      checkSSL(hostname),
    ]);

    const findings = [
      ...(headerResults.status === "fulfilled" ? headerResults.value : []),
      ...(sslResult.status === "fulfilled" ? [sslResult.value] : []),
    ];

    res.status(200).json({ url, hostname, findings });
  } catch (error) {
    console.error("Scan error:", error);
    res.status(500).json({
      error: "An unexpected error occurred during the scan",
    });
  }
}