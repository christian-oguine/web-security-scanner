import { FindingResult } from "../../types/scanner.js";

export async function checkHeaders(url: string): Promise<FindingResult[]> {
  const results: FindingResult[] = [];

  let headers: Headers;

  try {
    const response = await fetch(url, {
      method: "GET",
      redirect: "follow",
      signal: AbortSignal.timeout(10000),
    });
    headers = response.headers;
  } catch {
    return [{
      check: "HTTP Security Headers",
      status: "fail",
      severity: "high",
      score: 0,
      message: "Could not reach the URL to check security headers.",
    }];
  }

  const csp = headers.get("content-security-policy");
  results.push({
    check: "Content-Security-Policy",
    status: csp ? "pass" : "fail",
    severity: "high",
    score: csp ? 25 : 0,
    message: csp
      ? "Content-Security-Policy header is present."
      : "Content-Security-Policy header is missing. The site is vulnerable to XSS attacks.",
  });

  const hsts = headers.get("strict-transport-security");
  results.push({
    check: "Strict-Transport-Security",
    status: hsts ? "pass" : "fail",
    severity: "high",
    score: hsts ? 25 : 0,
    message: hsts
      ? "Strict-Transport-Security header is present."
      : "Strict-Transport-Security header is missing. The site is vulnerable to protocol downgrade attacks.",
  });

  const xframe = headers.get("x-frame-options");
  results.push({
    check: "X-Frame-Options",
    status: xframe ? "pass" : "fail",
    severity: "medium",
    score: xframe ? 15 : 0,
    message: xframe
      ? "X-Frame-Options header is present."
      : "X-Frame-Options header is missing. The site may be vulnerable to clickjacking.",
  });

  const xcto = headers.get("x-content-type-options");
  results.push({
    check: "X-Content-Type-Options",
    status: xcto ? "pass" : "fail",
    severity: "low",
    score: xcto ? 10 : 0,
    message: xcto
      ? "X-Content-Type-Options header is present."
      : "X-Content-Type-Options header is missing. The site is vulnerable to MIME type confusion attacks.",
  });

  const rp = headers.get("referrer-policy");
  results.push({
    check: "Referrer-Policy",
    status: rp ? "pass" : "fail",
    severity: "low",
    score: rp ? 5 : 0,
    message: rp
      ? "Referrer-Policy header is present."
      : "Referrer-Policy header is missing. Sensitive URL information may leak to third parties.",
  });

  return results;
}