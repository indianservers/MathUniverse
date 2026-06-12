import { MathRecognitionPanel } from "./intelligence/MathRecognitionPanel";
import { buildMathRecognitionAudit } from "./intelligence/mathRecognitionAudit";
import { detectMathEducationLevel } from "./intelligence/mathEducationLevel";
import type { MathRecognizedToken, MathSuggestion } from "./intelligence/mathRecognitionTypes";
import type { ProblemClassification } from "./problemTypes";

interface MathTokenHighlighterProps {
  tokens: MathRecognizedToken[];
  classification: ProblemClassification;
  suggestions: MathSuggestion[];
}

export function MathTokenHighlighter({ tokens, classification, suggestions }: MathTokenHighlighterProps) {
  const suggestionText = suggestions.map((suggestion) => suggestion.message);
  return (
    <MathRecognitionPanel
      result={{
        assumptions: classification.assumptions,
        audit: buildMathRecognitionAudit(tokens, suggestionText.length),
        categories: [...new Set(tokens.map((token) => token.category))],
        input: classification.rawInput,
        level: detectMathEducationLevel(tokens),
        possibleProblemType: classification.kind,
        suggestions: suggestionText,
        tokens,
        warnings: classification.warnings,
      }}
    />
  );
}
