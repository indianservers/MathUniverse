export type {
  MathKeywordDefinition,
  MathRecognizedToken,
  MathRecognitionAudit,
  MathRecognitionLevel,
  MathRecognitionResult,
  MathTokenCategory,
  MathTokenConfidence,
} from "./intelligence/mathRecognitionTypes";
export { recognizeMathInput } from "./intelligence/mathRecognizer";

import { tokenizeMathInput } from "./intelligence/mathTokenizer";

export function recognizeMathKeywords(input: string) {
  return tokenizeMathInput(input);
}
