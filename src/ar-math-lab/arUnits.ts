import type { ARUnit } from "./types";

export function convertToMeters(value: number, unit: ARUnit) {
  if (!Number.isFinite(value)) {
    throw new Error("Measurement value must be a finite number.");
  }

  switch (unit) {
    case "mm":
      return value / 1000;
    case "cm":
      return value / 100;
    case "m":
      return value;
    case "inch":
      return value * 0.0254;
    case "ft":
      return value * 0.3048;
    default:
      throw new Error(`Unsupported measurement unit: ${unit satisfies never}`);
  }
}

export function normalizeARUnit(unit: string): ARUnit | null {
  const normalized = unit.trim().toLowerCase();
  if (normalized === "mm" || normalized === "millimeter" || normalized === "millimeters") return "mm";
  if (normalized === "cm" || normalized === "centimeter" || normalized === "centimeters") return "cm";
  if (normalized === "m" || normalized === "meter" || normalized === "meters" || normalized === "metre" || normalized === "metres") return "m";
  if (normalized === "inch" || normalized === "inches" || normalized === "in") return "inch";
  if (normalized === "ft" || normalized === "foot" || normalized === "feet") return "ft";
  return null;
}
