export type Point = { x: number; y: number };
export type AngleMode = "degrees" | "radians";

export function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export function degToRad(degrees: number) {
  return (degrees * Math.PI) / 180;
}

export function radToDeg(radians: number) {
  return (radians * 180) / Math.PI;
}

export function normalizeAngleDegrees(angle: number) {
  return ((angle % 360) + 360) % 360;
}

export function normalizeAngleRadians(angle: number) {
  return degToRad(normalizeAngleDegrees(radToDeg(angle)));
}

export function sinDeg(degrees: number) {
  return Math.sin(degToRad(degrees));
}

export function cosDeg(degrees: number) {
  return Math.cos(degToRad(degrees));
}

export function tanDeg(degrees: number) {
  return Math.tan(degToRad(degrees));
}

export function formatAngle(degrees: number, mode: AngleMode) {
  return mode === "degrees" ? `${degrees.toFixed(1)} deg` : `${degToRad(degrees).toFixed(3)} rad`;
}

export function formatTrigValue(value: number) {
  if (!Number.isFinite(value)) return "undefined";
  if (Math.abs(value) > 999) return "undefined";
  if (Math.abs(value) < 0.0005) return "0.000";
  return value.toFixed(3);
}

export function unitCirclePoint(angleRadians: number, radius = 1): Point {
  return { x: radius * Math.cos(angleRadians), y: radius * Math.sin(angleRadians) };
}

export function projectPointToAxes(point: Point) {
  return {
    horizontal: { x: point.x, y: 0 },
    vertical: { x: 0, y: point.y },
  };
}

export function triangleSideFromLawOfCosines(a: number, b: number, angleC: number) {
  return Math.sqrt(Math.max(0, a * a + b * b - 2 * a * b * cosDeg(angleC)));
}

export function angleFromLawOfCosines(a: number, b: number, c: number) {
  const ratio = clamp((a * a + b * b - c * c) / (2 * a * b), -1, 1);
  return radToDeg(Math.acos(ratio));
}

export function triangleAreaUsingSine(a: number, b: number, angleC: number) {
  return 0.5 * a * b * sinDeg(angleC);
}

export function arcLength(radius: number, thetaRadians: number) {
  return radius * thetaRadians;
}

export function chordLength(radius: number, thetaRadians: number) {
  return 2 * radius * Math.sin(thetaRadians / 2);
}

export function quadrantForAngle(degrees: number) {
  const normalized = normalizeAngleDegrees(degrees);
  if (normalized === 0 || normalized === 90 || normalized === 180 || normalized === 270) return "axis";
  if (normalized < 90) return "I";
  if (normalized < 180) return "II";
  if (normalized < 270) return "III";
  return "IV";
}

export function generateSinePoints(width = 300, height = 140, samples = 96) {
  return Array.from({ length: samples + 1 }, (_, index) => {
    const t = (index / samples) * 360;
    return { x: (index / samples) * width, y: height / 2 - sinDeg(t) * (height * 0.38) };
  });
}

export function generateCosinePoints(width = 300, height = 140, samples = 96) {
  return Array.from({ length: samples + 1 }, (_, index) => {
    const t = (index / samples) * 360;
    return { x: (index / samples) * width, y: height / 2 - cosDeg(t) * (height * 0.38) };
  });
}
