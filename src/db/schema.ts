import { pgTable, uuid, text, integer, jsonb, timestamp } from "drizzle-orm/pg-core";

export const scans = pgTable("scans", {
  id: uuid("id").defaultRandom().primaryKey(),
  url: text("url").notNull(),
  domain: text("domain").notNull(),
  grade: text("grade").notNull(),
  score: integer("score").notNull(),
  findings: jsonb("findings").notNull(),
  scanDurationMs: integer("scan_duration_ms").notNull(),
  scannedAt: timestamp("scanned_at").defaultNow().notNull(),
});

export type Scan = typeof scans.$inferSelect;
export type NewScan = typeof scans.$inferInsert;