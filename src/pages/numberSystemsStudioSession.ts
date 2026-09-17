export type NumberSystemsPage =
  | "home"
  | "rational"
  | "irrational"
  | "real-line"
  | "hierarchy"
  | "concepts"
  | "practice";

export const NUMBER_SYSTEMS_ROUTES: Record<NumberSystemsPage, string> = {
  home: "/number-systems",
  rational: "/number-systems/rational",
  irrational: "/number-systems/irrational",
  "real-line": "/number-systems/real-line",
  hierarchy: "/number-systems/hierarchy",
  concepts: "/number-systems/concepts",
  practice: "/number-systems/practice",
};

export const NUMBER_TAB_REDIRECTS: Record<string, NumberSystemsPage> = {
  rational: "rational",
  irrational: "irrational",
  "real-line": "real-line",
  space: "hierarchy",
  concepts: "concepts",
  accuracy: "practice",
};

const LAST_ROUTE_KEY = "number-systems-studio:last-route";
const COMPLETED_KEY = "number-systems-studio:completed";
const COACH_KEY = "number-systems-studio:coach-dismissed";
const CLASS_KEY = "number-systems-studio:class-band";

export type NumberClassBand = "all" | "6-7" | "8-10" | "jee";

const labPages: NumberSystemsPage[] = ["rational", "irrational", "real-line", "hierarchy", "concepts", "practice"];

export function pageFromPath(pathname: string): NumberSystemsPage {
  const match = Object.entries(NUMBER_SYSTEMS_ROUTES).find(([, route]) => route === pathname);
  return (match?.[0] as NumberSystemsPage | undefined) ?? "home";
}

export function readStringList(key: string): string[] {
  if (typeof window === "undefined") return [];
  try {
    const value = JSON.parse(localStorage.getItem(key) ?? "[]");
    return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : [];
  } catch {
    return [];
  }
}

export function rememberLastRoute(pathname: string) {
  if (typeof window === "undefined") return;
  localStorage.setItem(LAST_ROUTE_KEY, pathname);
}

export function lastNumberSystemsRoute() {
  if (typeof window === "undefined") return NUMBER_SYSTEMS_ROUTES.rational;
  return localStorage.getItem(LAST_ROUTE_KEY) || NUMBER_SYSTEMS_ROUTES.rational;
}

export function completedLabs() {
  return readStringList(COMPLETED_KEY).filter((item): item is NumberSystemsPage =>
    labPages.includes(item as NumberSystemsPage),
  );
}

export function markLabComplete(page: NumberSystemsPage) {
  if (page === "home" || typeof window === "undefined") return;
  const next = new Set(completedLabs());
  next.add(page);
  localStorage.setItem(COMPLETED_KEY, JSON.stringify([...next]));
}

export function studioProgressPercent() {
  return Math.round((completedLabs().length / labPages.length) * 100);
}

export function coachDismissed() {
  return typeof window !== "undefined" && localStorage.getItem(COACH_KEY) === "1";
}

export function dismissCoach() {
  if (typeof window === "undefined") return;
  localStorage.setItem(COACH_KEY, "1");
}

export function readClassBand(): NumberClassBand {
  if (typeof window === "undefined") return "all";
  const value = localStorage.getItem(CLASS_KEY);
  if (value === "6-7" || value === "8-10" || value === "jee" || value === "all") return value;
  return "all";
}

export function saveClassBand(band: NumberClassBand) {
  if (typeof window === "undefined") return;
  localStorage.setItem(CLASS_KEY, band);
}

export function gcdInt(a: number, b: number): number {
  let x = Math.abs(Math.round(a));
  let y = Math.abs(Math.round(b));
  while (y) {
    const next = x % y;
    x = y;
    y = next;
  }
  return x || 1;
}

export function primeFactors(n: number): number[] {
  const factors: number[] = [];
  let remaining = Math.max(1, Math.round(Math.abs(n)));
  for (let prime = 2; prime * prime <= remaining; prime += 1) {
    while (remaining % prime === 0) {
      factors.push(prime);
      remaining /= prime;
    }
  }
  if (remaining > 1) factors.push(remaining);
  return factors;
}

export function factorTreeLabel(n: number) {
  const factors = primeFactors(n);
  if (factors.length === 0) return "1";
  const counts = new Map<number, number>();
  for (const factor of factors) counts.set(factor, (counts.get(factor) ?? 0) + 1);
  return [...counts.entries()].map(([prime, power]) => (power === 1 ? `${prime}` : `${prime}^${power}`)).join(" × ");
}

export function terminatingDenominator(q: number) {
  let remaining = Math.abs(Math.round(q));
  if (remaining === 0) return false;
  while (remaining % 2 === 0) remaining /= 2;
  while (remaining % 5 === 0) remaining /= 5;
  return remaining === 1;
}

export function repeatingDecimal(p: number, q: number) {
  const denominator = Math.max(1, Math.abs(Math.round(q)));
  const sign = p * q < 0 ? "-" : "";
  const numerator = Math.abs(Math.round(p));
  if (terminatingDenominator(denominator / gcdInt(numerator, denominator))) {
    const value = numerator / denominator;
    const text = value.toString();
    return `${sign}${text}`;
  }
  const remainders = new Map<number, number>();
  let remainder = numerator % denominator;
  let whole = Math.floor(numerator / denominator);
  let digits = "";
  while (remainder !== 0 && !remainders.has(remainder) && digits.length < 16) {
    remainders.set(remainder, digits.length);
    remainder *= 10;
    digits += Math.floor(remainder / denominator);
    remainder %= denominator;
  }
  if (remainder === 0) return `${sign}${whole}.${digits}`;
  const start = remainders.get(remainder) ?? 0;
  return `${sign}${whole}.${digits.slice(0, start)}(${digits.slice(start)})`;
}
