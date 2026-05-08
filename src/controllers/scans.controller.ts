import { Request, Response } from "express";
import { scanRequestSchema } from "../validators/scan.validator.js";
import { runScan } from "../services/scanner.js";
import { db } from "../config/database.js";
import { scans } from "../db/schema.js";
import { eq } from "drizzle-orm";

export async function createScan(req: Request, res: Response) {
  try {
    const parsed = scanRequestSchema.safeParse(req.body);

    if (!parsed.success) {
      res.status(400).json({
        error: "Validation failed",
        details: parsed.error.issues.map((e) => e.message),
      });
      return;
    }

    const { url } = parsed.data;
    const result = await runScan(url);

    const [saved] = await db
      .insert(scans)
      .values({
        url: result.url,
        domain: result.domain,
        grade: result.grade,
        score: result.score,
        findings: result.findings,
        scanDurationMs: result.scanDurationMs,
      })
      .returning();

    res.status(201).json({
      id: saved.id,
      url: saved.url,
      domain: saved.domain,
      grade: saved.grade,
      score: saved.score,
      findings: saved.findings,
      scanDurationMs: saved.scanDurationMs,
      scannedAt: saved.scannedAt,
    });
  } catch (error) {
    console.error("Scan error:", error);
    res.status(500).json({
      error: "An unexpected error occurred during the scan",
    });
  }
}

export async function getScan(req: Request, res: Response) {
  try {
    const id = req.params['id'] as string;

    const [scan] = await db
      .select()
      .from(scans)
      .where(eq(scans.id, id));

    if (!scan) {
      res.status(404).json({ error: "Scan not found" });
      return;
    }

    res.status(200).json(scan);
  } catch (error) {
    console.error("Get scan error:", error);
    res.status(500).json({ error: "An unexpected error occurred" });
  }
}