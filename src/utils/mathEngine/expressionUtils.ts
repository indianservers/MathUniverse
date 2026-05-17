export function safeNumber(value: unknown, fallback = 0) {
  const parsed = typeof value === "number" ? value : Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

export function formatNumber(value: number, digits = 6) {
  if (!Number.isFinite(value)) return "undefined";
  if (Math.abs(value) < 1e-12) return "0";
  return Number(value.toFixed(digits)).toString();
}

export function parseNumberList(text: string) {
  return text
    .split(/[,\s]+/)
    .map((value) => Number(value.trim()))
    .filter(Number.isFinite);
}
