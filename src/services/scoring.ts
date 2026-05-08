import { FindingResult } from "../types/scanner.js";

export interface ScoringResult {
  score: number;
  grade: string;
}

function calculateGrade(score: number): string {
  if (score >= 85) return "A";
  if (score >= 70) return "B";
  if (score >= 55) return "C";
  if (score >= 40) return "D";
  return "F";
}

export function calculateScore(findings: FindingResult[]): ScoringResult {
  const hasAutoFail = findings.some((f) => f.autoFail === true);

  if (hasAutoFail) {
    return { score: 0, grade: "F" };
  }

  const score = findings.reduce((total, finding) => {
    return total + (finding.score ?? 0);
  }, 0);

  const finalScore = Math.min(score, 100);
  const grade = calculateGrade(finalScore);

  return { score: finalScore, grade };
}