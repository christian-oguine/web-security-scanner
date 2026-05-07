import { z } from "zod";

const PRIVATE_IP_PATTERNS = [
  /^localhost$/i,
  /^127\./,
  /^10\./,
  /^172\.(1[6-9]|2[0-9]|3[0-1])\./,
  /^192\.168\./,
  /^169\.254\./,
  /^::1$/,
  /^fc00:/i,
  /^fe80:/i,
];

function isPrivateHost(hostname: string): boolean {
  return PRIVATE_IP_PATTERNS.some((pattern) => pattern.test(hostname));
}

export const scanRequestSchema = z.object({
  url: z
    .string({ error: "URL is required" })
    .url({ message: "Invalid URL format" })
    
    .refine(
      (url) => {
        const scheme = new URL(url).protocol;
        return scheme === "http:" || scheme === "https:";
      },
      { message: "URL must use http or https" }
    )
    .refine(
      (url) => {
        const hostname = new URL(url).hostname;
        return !isPrivateHost(hostname);
      },
      { message: "Scanning internal or private IP addresses is not permitted" }
    ),
});

export type ScanRequest = z.infer<typeof scanRequestSchema>;