export type Severity = "critical" | "high" | "medium" | "low" | "info";

export type FindingStatus = "pass" | "fail" | "warning";

export interface FindingResult {
  check: string;
  status: FindingStatus;
  severity: Severity;
  score: number;
  message: string;
}

export interface ScanResult {
  url: string;
  domain: string;
  grade: string;
  score: number;
  findings: FindingResult[];
  scanDurationMs: number;
}