export function formatNumber(value: number, decimals = 2) {
  return new Intl.NumberFormat("en", { maximumFractionDigits: decimals }).format(value);
}

export function formatAngle(radians: number) {
  return `${formatNumber((radians * 180) / Math.PI, 1)} deg`;
}

export function formatFormulaValue(value: number, unit = "") {
  const formatted = Number.isInteger(value) ? value.toString() : formatNumber(value, 3);
  return unit ? `${formatted} ${unit}` : formatted;
}
