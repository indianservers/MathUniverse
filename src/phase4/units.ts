export type UnitDefinition = { symbol: string; dimension: string; scale: number; offset: number; affine: boolean };
export type UnitQuantity = { value: number; unit: string; dimension: string; significantFigures?: number };
export type UnitResult = { status: "EXACT" | "UNDEFINED"; quantity?: UnitQuantity; diagnostic?: string };

const units: UnitDefinition[] = [
  { symbol: "m", dimension: "L", scale: 1, offset: 0, affine: false }, { symbol: "cm", dimension: "L", scale: 0.01, offset: 0, affine: false }, { symbol: "km", dimension: "L", scale: 1000, offset: 0, affine: false },
  { symbol: "s", dimension: "T", scale: 1, offset: 0, affine: false }, { symbol: "min", dimension: "T", scale: 60, offset: 0, affine: false }, { symbol: "h", dimension: "T", scale: 3600, offset: 0, affine: false },
  { symbol: "kg", dimension: "M", scale: 1, offset: 0, affine: false }, { symbol: "g", dimension: "M", scale: 0.001, offset: 0, affine: false },
  { symbol: "K", dimension: "Θ", scale: 1, offset: 0, affine: true }, { symbol: "°C", dimension: "Θ", scale: 1, offset: 273.15, affine: true }, { symbol: "°F", dimension: "Θ", scale: 5 / 9, offset: 255.3722222222222, affine: true },
  { symbol: "rad", dimension: "ANGLE", scale: 1, offset: 0, affine: false }, { symbol: "deg", dimension: "ANGLE", scale: Math.PI / 180, offset: 0, affine: false },
  { symbol: "N", dimension: "M*L/T^2", scale: 1, offset: 0, affine: false }, { symbol: "J", dimension: "M*L^2/T^2", scale: 1, offset: 0, affine: false }, { symbol: "Pa", dimension: "M/L/T^2", scale: 1, offset: 0, affine: false },
];

export const unitRegistry = Object.freeze(units);

export function convertUnit(quantity: UnitQuantity, targetUnit: string): UnitResult {
  const source = units.find((item) => item.symbol === quantity.unit); const target = units.find((item) => item.symbol === targetUnit);
  if (!source || !target) return { status: "UNDEFINED", diagnostic: "Unknown source or target unit." };
  if (source.dimension !== target.dimension) return { status: "UNDEFINED", diagnostic: `Cannot convert ${source.dimension} to ${target.dimension}.` };
  const base = quantity.value * source.scale + source.offset; const converted = (base - target.offset) / target.scale;
  return { status: "EXACT", quantity: { value: roundSig(converted, quantity.significantFigures), unit: targetUnit, dimension: target.dimension, significantFigures: quantity.significantFigures } };
}

export function addQuantities(left: UnitQuantity, right: UnitQuantity): UnitResult {
  const converted = convertUnit(right, left.unit); if (converted.status !== "EXACT" || !converted.quantity) return converted;
  return { status: "EXACT", quantity: { value: left.value + converted.quantity.value, unit: left.unit, dimension: left.dimension, significantFigures: minimumDefined(left.significantFigures, right.significantFigures) } };
}

export function multiplyQuantities(left: UnitQuantity, right: UnitQuantity): UnitResult { return { status: "EXACT", quantity: { value: left.value * right.value, unit: `${left.unit}·${right.unit}`, dimension: `${left.dimension}*${right.dimension}`, significantFigures: minimumDefined(left.significantFigures, right.significantFigures) } }; }

function minimumDefined(a?: number, b?: number) { return a === undefined ? b : b === undefined ? a : Math.min(a, b); }
function roundSig(value: number, figures?: number) { return figures ? Number(value.toPrecision(figures)) : value; }
