import * as dns from "dns/promises";
import { FindingResult } from "../../types/scanner.js";

export async function checkDNS(hostname: string): Promise<FindingResult> {
  try {
    const records = await dns.resolveTxt(`_dmarc.${hostname}`);
    const dmarcRecord = records
      .flat()
      .find((record) => record.startsWith("v=DMARC1"));

    if (!dmarcRecord) {
      return {
        check: "DMARC Record",
        status: "fail",
        severity: "medium",
        score: 0,
        message: "No DMARC record found. Your domain can be used to send phishing emails.",
      };
    }

    const policyMatch = dmarcRecord.match(/p=(\w+)/);
    const policy = policyMatch ? policyMatch[1] : "none";

    if (policy === "none") {
      return {
        check: "DMARC Record",
        status: "warning",
        severity: "medium",
        score: 10,
        message: `DMARC record exists but policy is set to "none". No emails are rejected or quarantined.`,
      };
    }

    return {
      check: "DMARC Record",
      status: "pass",
      severity: "medium",
      score: 20,
      message: `DMARC record found with policy "${policy}". Domain is protected against email spoofing.`,
    };
  } catch {
    return {
      check: "DMARC Record",
      status: "fail",
      severity: "medium",
      score: 0,
      message: "No DMARC record found. Your domain can be used to send phishing emails.",
    };
  }
}