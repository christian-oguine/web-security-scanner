import * as tls from "tls";
import { FindingResult } from "../../types/scanner.js";

function checkSSLRaw(hostname: string): Promise<{ daysRemaining: number; valid: boolean }> {
  return new Promise((resolve, reject) => {
    const socket = tls.connect(
      {
        host: hostname,
        port: 443,
        servername: hostname,
        rejectUnauthorized: false,
      },
      () => {
        const cert = socket.getPeerCertificate();
        socket.destroy();

        if (!cert || !cert.valid_to) {
          reject(new Error("No certificate found"));
          return;
        }

        const expiryDate = new Date(cert.valid_to);
        const now = new Date();
        const daysRemaining = Math.floor(
          (expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
        );

        resolve({ daysRemaining, valid: daysRemaining > 0 });
      }
    );

    socket.on("error", reject);

    socket.setTimeout(5000, () => {
      socket.destroy();
      reject(new Error("SSL check timed out"));
    });
  });
}

export async function checkSSL(hostname: string): Promise<FindingResult> {
  try {
    const { valid, daysRemaining } = await checkSSLRaw(hostname);

    if (!valid) {
      return {
        check: "SSL/TLS Certificate",
        status: "fail",
        severity: "critical",
        score: 0,
        autoFail: true,
        message: "SSL certificate has expired. All traffic is exposed.",
      };
    }

    if (daysRemaining <= 30) {
      return {
        check: "SSL/TLS Certificate",
        status: "warning",
        severity: "high",
        score: 0,
        autoFail: false,
        message: `SSL certificate expires in ${daysRemaining} days. Renew it immediately.`,
      };
    }

    return {
      check: "SSL/TLS Certificate",
      status: "pass",
      severity: "critical",
      score: 0,
      autoFail: false,
      message: `SSL certificate is valid and expires in ${daysRemaining} days.`,
    };
  } catch {
    return {
      check: "SSL/TLS Certificate",
      status: "fail",
      severity: "critical",
      score: 0,
      autoFail: true,
      message: "No SSL certificate found. The site does not use HTTPS or connection dropped.",
    };
  }
}