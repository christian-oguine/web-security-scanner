import sslChecker from "ssl-checker";
import { FindingResult } from "../../types/scanner.js";

export async function checkSSL(hostname: string): Promise<FindingResult> {
  try {
    const result = await sslChecker(hostname);

    if (!result.valid) {
      return {
        check: "SSL/TLS Certificate",
        status: "fail",
        severity: "critical",
        score: 0,
        autoFail: true,
        message: "SSL certificate is invalid. All traffic is exposed.",
      };
    }

    if (result.daysRemaining <= 30) {
      return {
        check: "SSL/TLS Certificate",
        status: "warning",
        severity: "high",
        score: 0,
        autoFail: false,
        message: `SSL certificate expires in ${result.daysRemaining} days. Renew it immediately.`,
      };
    }

    return {
      check: "SSL/TLS Certificate",
      status: "pass",
      severity: "critical",
      score: 0,
      autoFail: false,
      message: `SSL certificate is valid and expires in ${result.daysRemaining} days.`,
    };
  } catch {
    return {
      check: "SSL/TLS Certificate",
      status: "fail",
      severity: "critical",
      score: 0,
      autoFail: true,
      message: "No SSL certificate found. The site does not use HTTPS.",
    };
  }
}