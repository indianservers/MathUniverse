import { keywordLookup, normalizeKeyword, phraseKeywords, symbolKeywords, symbolLookup } from "./mathKeywordDictionary";
import type { MathKeywordDefinition, MathRecognizedToken } from "./mathRecognitionTypes";

const fillerWords = new Set(["of", "the", "a", "an", "to", "from", "by", "with", "and", "please"]);

export function tokenizeMathInput(input: string): MathRecognizedToken[] {
  const tokens: MathRecognizedToken[] = [];
  let index = 0;

  while (index < input.length) {
    if (/\s/.test(input[index])) {
      index += 1;
      continue;
    }

    const phrase = matchPhrase(input, index);
    if (phrase) {
      tokens.push(createToken(input.slice(index, phrase.end), phrase.definition, index, phrase.end));
      index = phrase.end;
      continue;
    }

    const symbol = symbolKeywords.find((candidate) => input.startsWith(candidate, index));
    if (symbol) {
      const definition = symbolLookup.get(symbol);
      if (definition) tokens.push(createToken(symbol, definition, index, index + symbol.length));
      index += symbol.length;
      continue;
    }

    const number = matchNumber(input, index, tokens);
    if (number) {
      tokens.push(number);
      index = number.end;
      continue;
    }

    const word = matchWord(input, index);
    if (word) {
      const token = createWordToken(word.text, index, word.end);
      if (token) tokens.push(token);
      index = word.end;
      continue;
    }

    tokens.push(unknownToken(input[index], index, index + 1, "Unrecognized Symbol", "This symbol is not yet recognized by the offline math tokenizer."));
    index += 1;
  }

  return tokens;
}

function matchPhrase(input: string, start: number) {
  const lower = input.slice(start).toLowerCase();
  for (const phrase of phraseKeywords) {
    if (!lower.startsWith(phrase)) continue;
    const end = start + phrase.length;
    const beforeOk = start === 0 || !isWordCharacter(input[start - 1]);
    const afterOk = end >= input.length || !isWordCharacter(input[end]);
    if (beforeOk && afterOk) {
      const definition = keywordLookup.get(phrase);
      if (definition) return { definition, end };
    }
  }
  return null;
}

function matchNumber(input: string, start: number, tokens: MathRecognizedToken[]): MathRecognizedToken | null {
  const fragment = input.slice(start);
  const previous = tokens[tokens.length - 1];
  const canBeNegative = !previous || previous.category === "arithmetic" || previous.category === "relation" || previous.category === "grouping";
  const signPattern = canBeNegative ? "-?" : "";
  const match = fragment.match(new RegExp(`^${signPattern}(?:(?:\\d+\\.\\d+|\\d+|\\.\\d+)(?:e[+-]?\\d+)?)(?:/(?:\\d+\\.\\d+|\\d+|\\.\\d+)(?:e[+-]?\\d+)?)?%?`, "i"));
  if (!match) return null;

  const text = match[0];
  const label = text.endsWith("%") ? "Percentage" : text.includes("/") ? "Fraction" : /e[+-]?\d+/i.test(text) ? "Scientific Notation" : text.includes(".") ? "Decimal Number" : text.startsWith("-") ? "Negative Number" : "Number";
  return {
    category: "number",
    confidence: "high",
    description: "Numeric value recognized by the offline tokenizer.",
    end: start + text.length,
    label,
    level: "school",
    normalized: text.toLowerCase(),
    start,
    text,
  };
}

function matchWord(input: string, start: number) {
  const fragment = input.slice(start);
  const match = fragment.match(/^[A-Za-z][A-Za-z0-9]*/);
  if (!match) return null;
  return { text: match[0], end: start + match[0].length };
}

function createWordToken(text: string, start: number, end: number): MathRecognizedToken | null {
  const normalized = normalizeKeyword(text);
  if (fillerWords.has(normalized)) return null;
  const definition = keywordLookup.get(normalized);
  if (definition) return createToken(text, definition, start, end);

  if (/^[a-z](?:\d+)?$/i.test(text)) {
    return {
      category: "variable",
      confidence: "medium",
      description: "Symbol used as a variable or unknown.",
      end,
      label: text.length > 1 ? "Indexed Variable" : "Variable",
      level: "school",
      normalized,
      start,
      text,
    };
  }

  return unknownToken(text, start, end, "Unknown Word", "This word is not currently mapped to a supported math keyword.");
}

function createToken(text: string, definition: MathKeywordDefinition, start: number, end: number): MathRecognizedToken {
  return {
    category: definition.category,
    confidence: "high",
    description: definition.description,
    end,
    label: definition.label,
    level: definition.level,
    normalized: normalizeKeyword(text),
    start,
    suggestion: definition.suggestion,
    text,
  };
}

function unknownToken(text: string, start: number, end: number, label: string, description: string): MathRecognizedToken {
  return {
    category: "unknown",
    confidence: "low",
    description,
    end,
    label,
    level: "school",
    normalized: normalizeKeyword(text),
    start,
    suggestion: "Try a clearer mathematical expression or a supported command such as solve, simplify, derivative, integrate, mean, or determinant.",
    text,
  };
}

function isWordCharacter(value: string | undefined) {
  return Boolean(value && /[A-Za-z0-9]/.test(value));
}
