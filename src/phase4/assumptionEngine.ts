import type { MathAssumption } from "../math-foundation/types";
import type { AssumptionAnalysis, ParsedAssumption } from "./types";

export function parseAssumption(source: string, enabled = true): ParsedAssumption {
  const normalized = source.trim().replaceAll("≥", ">=").replaceAll("≤", "<=").replaceAll("≠", "!=").replaceAll("∈", "in").replaceAll("ℝ", "R").replaceAll("ℂ", "C").replaceAll("ℤ", "Z").replaceAll("ℕ", "N");
  const domain = normalized.match(/^([A-Za-z]\w*)\s+(?:in|is)\s*(R|C|Z|N|real|complex|integer|natural)$/i);
  if (domain) {
    const map: Record<string, ParsedAssumption["domain"]> = { r: "REAL", real: "REAL", c: "COMPLEX", complex: "COMPLEX", z: "INTEGER", integer: "INTEGER", n: "NATURAL", natural: "NATURAL" };
    const parsedDomain = map[domain[2].toLowerCase()] ?? "REAL";
    return make(source, domain[1], "DOMAIN", enabled, { domain: parsedDomain });
  }
  const relation = normalized.match(/^([A-Za-z]\w*)\s*(>=|<=|!=|=|>|<)\s*(-?\d+(?:\.\d+)?)$/);
  if (relation) {
    const map = { ">": "GT", ">=": "GTE", "<": "LT", "<=": "LTE", "!=": "NEQ", "=": "EQ" } as const;
    return make(source, relation[1], map[relation[2] as keyof typeof map], enabled, { value: Number(relation[3]) });
  }
  const property = normalized.match(/^([A-Za-z]\w*)\s+(?:is\s+)?(invertible|singular|positive definite)$/i);
  if (property) return make(source, property[1], "PROPERTY", enabled, { property: property[2].toLowerCase() });
  return make(source, normalized.split(/\s/)[0] || "?", "PROPERTY", enabled, { property: "unparsed" });
}

export function analyzeAssumptions(sources: Array<string | ParsedAssumption>): AssumptionAnalysis {
  const assumptions = sources.map((source) => typeof source === "string" ? parseAssumption(source) : source).filter((item) => item.enabled);
  const contradictions: string[] = [];
  const bySymbol = new Map<string, ParsedAssumption[]>();
  assumptions.forEach((item) => bySymbol.set(item.symbol, [...(bySymbol.get(item.symbol) ?? []), item]));
  bySymbol.forEach((items, symbol) => {
    const domains = new Set(items.filter((item) => item.domain).map((item) => item.domain));
    if (domains.has("REAL") && domains.has("COMPLEX")) contradictions.push(`${symbol} cannot be declared exclusively real and complex in the same active context.`);
    const equalities = items.filter((item) => item.relation === "EQ").map((item) => item.value);
    if (new Set(equalities).size > 1) contradictions.push(`${symbol} has contradictory equality assumptions.`);
    const eq = equalities[0];
    if (eq !== undefined && items.some((item) => item.relation === "NEQ" && item.value === eq)) contradictions.push(`${symbol} cannot equal and differ from ${eq}.`);
    if (eq !== undefined && items.filter((item) => ["GT", "GTE", "LT", "LTE"].includes(item.relation)).some((item) => !relationAllows(item, eq))) contradictions.push(`${symbol} = ${eq} contradicts an active bound.`);
    const lowers = items.filter((item) => item.relation === "GT" || item.relation === "GTE");
    const uppers = items.filter((item) => item.relation === "LT" || item.relation === "LTE");
    if (lowers.some((lower) => uppers.some((upper) => (lower.value ?? -Infinity) > (upper.value ?? Infinity) || ((lower.value === upper.value) && (lower.relation === "GT" || upper.relation === "LT"))))) contradictions.push(`${symbol} has contradictory lower and upper bounds.`);
  });
  return { assumptions, contradictions: [...new Set(contradictions)] };
}

export function hasAssumption(analysis: AssumptionAnalysis, symbol: string, predicate: (item: ParsedAssumption) => boolean) {
  return analysis.assumptions.some((item) => item.symbol === symbol && predicate(item));
}

function make(source: string, symbol: string, relation: ParsedAssumption["relation"], enabled: boolean, details: Partial<ParsedAssumption>): ParsedAssumption {
  const mathAssumption: MathAssumption = { id: `assumption-${hash(source)}`, symbol };
  if (details.domain) mathAssumption.domain = details.domain;
  if ((relation === "GT") && details.value === 0) mathAssumption.constraint = "POSITIVE";
  if ((relation === "GTE") && details.value === 0) mathAssumption.constraint = "NON_NEGATIVE";
  if ((relation === "NEQ") && details.value === 0) mathAssumption.constraint = "NON_ZERO";
  return { id: mathAssumption.id, source, symbol, relation, enabled, mathAssumption, ...details };
}

function relationAllows(item: ParsedAssumption, value: number) {
  const target = item.value ?? 0;
  if (item.relation === "GT") return value > target;
  if (item.relation === "GTE") return value >= target;
  if (item.relation === "LT") return value < target;
  if (item.relation === "LTE") return value <= target;
  if (item.relation === "NEQ") return value !== target;
  return true;
}

function hash(value: string) { let result = 2166136261; for (const char of value) result = Math.imul(result ^ char.charCodeAt(0), 16777619); return (result >>> 0).toString(36); }
