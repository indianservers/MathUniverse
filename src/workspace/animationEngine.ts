import type { ParameterValues } from "./linkedExpressions";

export type AnimationTarget = "graph-parameter" | "cross-section" | "surface-scale" | "point-orbit";

export type AnimationSnapshot = {
  id: string;
  label: string;
  timestamp: number;
  time: number;
  target: AnimationTarget;
  parameters: ParameterValues;
  crossSection: number;
  surfaceScale: number;
  point3d: [number, number, number];
};

export function pingPongValue(time: number, duration: number, min: number, max: number) {
  const safeDuration = Math.max(0.5, duration);
  const cycle = (time % safeDuration) / safeDuration;
  const wave = cycle < 0.5 ? cycle * 2 : (1 - cycle) * 2;
  return min + (max - min) * wave;
}

export function orbitalPoint(angle: number, radius = 2.4, height = 1.4): [number, number, number] {
  return [Math.cos(angle) * radius, height + Math.sin(angle * 2) * 0.45, Math.sin(angle) * radius];
}

export function animationTargetLabel(target: AnimationTarget) {
  if (target === "graph-parameter") return "Graph parameter";
  if (target === "cross-section") return "3D cross-section";
  if (target === "surface-scale") return "Surface scale";
  return "Point P orbit";
}
