import { Request, Response } from "express";
import { checkHeaders } from "../services/checks/headers.js";
import { checkSSL } from "../services/checks/ssl.js";

export async function createScan(req: Request, res: Response) {
  try {
    const { url } = req.body;

    if (!url) {
      res.status(400).json({ error: "URL is required" });
      return;
    }

    let hostname: string;

    try {
      hostname = new URL(url).hostname;
    } catch {
      res.status(400).json({ error: "Invalid URL format" });
      return;
    }

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
    res.status(500).json({ error: "An unexpected error occurred during the scan" });
  }
}