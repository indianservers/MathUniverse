import type { MathRecognizedToken, MathRecognitionLevel } from "./mathRecognitionTypes";

const levelRank: Record<MathRecognitionLevel, number> = {
  school: 0,
  intermediate: 1,
  engineering: 2,
};

export function detectMathEducationLevel(tokens: MathRecognizedToken[]): MathRecognitionLevel {
  return tokens.reduce<MathRecognitionLevel>((highest, token) => (levelRank[token.level] > levelRank[highest] ? token.level : highest), "school");
}

export function formatMathEducationLevel(level: MathRecognitionLevel) {
  if (level === "engineering") return "Engineering Mathematics";
  return level[0].toUpperCase() + level.slice(1);
}
