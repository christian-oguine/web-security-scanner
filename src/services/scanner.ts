import { checkHeaders } from "./checks/headers.js";
import { checkSSL } from "./checks/ssl.js";
import { checkDNS } from "./checks/dns.js";
import { checkExposedFiles } from "./checks/files.js";
import { calculateScore } from "./scoring.js";
import { ScanResult } from "../types/scanner.js";

export async function runScan(url: string): Promise<ScanResult> {
  const startTime = Date.now();
  const hostname = new URL(url).hostname;

  const [headerResults, sslResult, dnsResult, fileResults] =
    await Promise.allSettled([
      checkHeaders(url),
      checkSSL(hostname),
      checkDNS(hostname),
      checkExposedFiles(url),
    ]);

  const findings = [
    ...(headerResults.status === "fulfilled" ? headerResults.value : []),
    ...(sslResult.status === "fulfilled" ? [sslResult.value] : []),
    ...(dnsResult.status === "fulfilled" ? [dnsResult.value] : []),
    ...(fileResults.status === "fulfilled" ? fileResults.value : []),
  ];

  const { score, grade } = calculateScore(findings);
  const scanDurationMs = Date.now() - startTime;

  return {
    url,
    domain: hostname,
    grade,
    score,
    findings,
    scanDurationMs,
  };
}