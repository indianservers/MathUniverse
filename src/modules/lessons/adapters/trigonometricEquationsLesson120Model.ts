export type TrigFunction120 = "sin" | "cos";

export type TrigPreset120 = {
  fn: TrigFunction120;
  angle: number;
  value: string;
};

export const TRIGONOMETRIC_PRESETS_120: TrigPreset120[] = [
  { fn: "sin", angle: 30, value: "1/2" },
  { fn: "cos", angle: 60, value: "1/2" },
  { fn: "sin", angle: 45, value: "sqrt(2)/2" },
];

export function degreesToRadians120(degrees: number) {
  return (degrees * Math.PI) / 180;
}

export function trigonometricValue120(fn: TrigFunction120, angle: number) {
  const radians = degreesToRadians120(angle);
  return fn === "sin" ? Math.sin(radians) : Math.cos(radians);
}

export function trigonometricPartnerAngle120(
  fn: TrigFunction120,
  referenceAngle: number,
) {
  return fn === "sin" ? 180 - referenceAngle : 360 - referenceAngle;
}

export function solveTrigonometricEquation120(preset: TrigPreset120) {
  const first = preset.angle;
  const second = trigonometricPartnerAngle120(preset.fn, first);
  const value = trigonometricValue120(preset.fn, first);
  return {
    first,
    second,
    value,
    quadrants: preset.fn === "sin" ? [1, 2] : [1, 4],
    valid: Math.abs(trigonometricValue120(preset.fn, second) - value) < 1e-9,
  };
}

export function trigonometricAngleText120(angle: number, radians: boolean) {
  if (!radians) return `${angle}°`;
  const known: Record<number, string> = {
    0: "0",
    30: "π/6",
    45: "π/4",
    60: "π/3",
    90: "π/2",
    120: "2π/3",
    135: "3π/4",
    150: "5π/6",
    180: "π",
    270: "3π/2",
    300: "5π/3",
    315: "7π/4",
    330: "11π/6",
    360: "2π",
  };
  return known[angle] ?? `${(angle / 180).toFixed(2)}π`;
}

export function isTrigonometricPracticeCorrect120(
  first: number,
  second: number,
) {
  const answers = [first, second].sort((left, right) => left - right);
  return answers[0] === 60 && answers[1] === 300;
}
