export type UnitDefinition = { symbol: string; name: string; dimension: string; scale: number };

export const GRAPH_UNITS: UnitDefinition[] = [
  { symbol: "mm", name: "millimetres", dimension: "length", scale: 0.001 },
  { symbol: "cm", name: "centimetres", dimension: "length", scale: 0.01 },
  { symbol: "m", name: "metres", dimension: "length", scale: 1 },
  { symbol: "km", name: "kilometres", dimension: "length", scale: 1000 },
  { symbol: "s", name: "seconds", dimension: "time", scale: 1 },
  { symbol: "min", name: "minutes", dimension: "time", scale: 60 },
  { symbol: "h", name: "hours", dimension: "time", scale: 3600 },
  { symbol: "g", name: "grams", dimension: "mass", scale: 0.001 },
  { symbol: "kg", name: "kilograms", dimension: "mass", scale: 1 },
  { symbol: "m/s", name: "metres per second", dimension: "speed", scale: 1 },
  { symbol: "km/h", name: "kilometres per hour", dimension: "speed", scale: 1000 / 3600 },
  { symbol: "N", name: "newtons", dimension: "force", scale: 1 },
  { symbol: "J", name: "joules", dimension: "energy", scale: 1 },
];

export function convertGraphUnit(value: number, fromSymbol: string, toSymbol: string) {
  const from = GRAPH_UNITS.find((unit) => unit.symbol === fromSymbol);
  const to = GRAPH_UNITS.find((unit) => unit.symbol === toSymbol);
  if (!from || !to) return { ok: false as const, message: "Choose known units." };
  if (from.dimension !== to.dimension) return { ok: false as const, message: `Dimension mismatch: ${from.dimension} cannot convert to ${to.dimension}.` };
  const result = value * from.scale / to.scale;
  return { ok: true as const, value: result, message: `${value} ${from.symbol} = ${format(result)} ${to.symbol}`, dimension: from.dimension };
}

function format(value: number) { return `${Math.round(value * 1e9) / 1e9}`; }
