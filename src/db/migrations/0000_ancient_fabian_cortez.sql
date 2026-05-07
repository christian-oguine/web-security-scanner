CREATE TABLE "scans" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"url" text NOT NULL,
	"domain" text NOT NULL,
	"grade" text NOT NULL,
	"score" integer NOT NULL,
	"findings" jsonb NOT NULL,
	"scan_duration_ms" integer NOT NULL,
	"scanned_at" timestamp DEFAULT now() NOT NULL
);
