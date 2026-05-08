import { FindingResult } from "../../types/scanner.js";

async function checkFile(
  baseUrl: string,
  path: string
): Promise<{ exposed: boolean; status: number }> {
  try {
    const response = await fetch(`${baseUrl}${path}`, {
      method: "GET",
      redirect: "follow",
      signal: AbortSignal.timeout(8000),
    });

    if (response.status !== 200) {
      return { exposed: false, status: response.status };
    }

    const body = await response.text();
    const exposed = body.length > 0 && !body.toLowerCase().includes("<!doctype html");

    return { exposed, status: response.status };
  } catch {
    return { exposed: false, status: 0 };
  }
}

export async function checkExposedFiles(url: string): Promise<FindingResult[]> {
  const results: FindingResult[] = [];

  const baseUrl = new URL(url).origin;

  const [envResult, gitResult] = await Promise.allSettled([
    checkFile(baseUrl, "/.env"),
    checkFile(baseUrl, "/.git/config"),
  ]);

  const envExposed =
    envResult.status === "fulfilled" && envResult.value.exposed;

  results.push({
    check: "Exposed .env File",
    status: envExposed ? "fail" : "pass",
    severity: "critical",
    score: 0,
    autoFail: envExposed,
    message: envExposed
      ? "CRITICAL: .env file is publicly accessible. Rotate all credentials immediately."
      : ".env file is not publicly accessible.",
  });

  const gitExposed =
    gitResult.status === "fulfilled" && gitResult.value.exposed;

  results.push({
    check: "Exposed .git/config",
    status: gitExposed ? "fail" : "pass",
    severity: "critical",
    score: 0,
    autoFail: gitExposed,
    message: gitExposed
      ? "CRITICAL: .git/config is publicly accessible. Source code may be fully exposed."
      : ".git/config is not publicly accessible.",
  });

  return results;
}