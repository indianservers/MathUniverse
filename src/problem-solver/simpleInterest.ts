export interface SimpleInterestData {
  principal: number;
  rate: number;
  time: number;
  interest: number;
  amount: number;
  currency: string | null;
}

const amountPattern = "(-?(?:\\d{1,3}(?:,\\d{3})+|\\d+)(?:\\.\\d+)?)";

function namedValue(input: string, names: string[], preferBefore: boolean): number | null {
  for (const name of names) {
    const before = input.match(new RegExp(`${amountPattern}\\s*(?:as\\s+)?\\b${name}\\b`, "i"));
    const match = input.match(new RegExp(`\\b${name}\\b\\s*(?:is|of|=|:)?\\s*(?:₹|\\$|€|£|USD|INR|EUR|GBP)?\\s*${amountPattern}`, "i"));
    if (preferBefore && before) return Number(before[1].replaceAll(",", ""));
    if (match) return Number(match[1].replaceAll(",", ""));
    if (before) return Number(before[1].replaceAll(",", ""));
  }
  return null;
}

export function parseSimpleInterest(input: string): SimpleInterestData | null {
  if (!/(?:simple interest|principal|interest)/i.test(input)) return null;
  const firstLabel = input.search(/\b(?:principal|rate|time|p|r|t)\b/i);
  const firstNumber = input.search(/\d/);
  const preferBefore = firstNumber >= 0 && (firstLabel < 0 || firstNumber < firstLabel);
  const principal = namedValue(input, ["principal", "p"], preferBefore);
  const rate = namedValue(input, ["rate", "r"], preferBefore);
  const time = namedValue(input, ["time", "t"], preferBefore) ?? Number(input.match(new RegExp(`${amountPattern}\\s*years?`, "i"))?.[1]?.replaceAll(",", ""));
  if (principal === null || rate === null || !Number.isFinite(time) || principal <= 0 || rate < 0 || time <= 0) return null;
  const interest = principal * rate * time / 100;
  const amount = principal + interest;
  if (!Number.isFinite(amount)) return null;
  const currency = /₹|\bINR\b/i.test(input) ? "INR" : /\$|\bUSD\b/i.test(input) ? "USD" : /€|\bEUR\b/i.test(input) ? "EUR" : /£|\bGBP\b/i.test(input) ? "GBP" : null;
  return { principal, rate, time, interest, amount, currency };
}

export function formatInterestValue(value: number, currency: string | null): string {
  const formatted = value.toLocaleString(currency === "INR" || currency === null ? "en-IN" : "en-US", { maximumFractionDigits: 2 });
  return currency === "INR" ? `₹${formatted}` : currency === "USD" ? `$${formatted}` : currency === "EUR" ? `€${formatted}` : currency === "GBP" ? `£${formatted}` : formatted;
}
