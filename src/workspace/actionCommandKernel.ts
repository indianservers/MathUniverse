import { line, parseKernelPoint, point, type KernelLine, type KernelPoint } from "./geometry2dKernel";

export type TransformAction =
  | { kind: "rotate"; source: KernelPoint; center: KernelPoint; angleDegrees: number; result: KernelPoint }
  | { kind: "translate"; source: KernelPoint; vector: KernelPoint; result: KernelPoint }
  | { kind: "dilate"; source: KernelPoint; center: KernelPoint; factor: number; result: KernelPoint }
  | { kind: "mirror"; source: KernelPoint; axis: KernelLine; result: KernelPoint };

export type StyleAction = {
  objectName: string;
  patch: {
    color?: string;
    fill?: string;
    labelMode?: "name" | "value" | "both" | "hidden";
    visible?: boolean;
    trace?: boolean;
    opacity?: number;
  };
};

export type AnimationAction = {
  target: string;
  playing: boolean;
  speed: number;
  detail: string;
};

export function rotatePoint(source: KernelPoint, angleDegrees: number, center: KernelPoint = point(0, 0)): TransformAction {
  const radians = (angleDegrees * Math.PI) / 180;
  const dx = source.x - center.x;
  const dy = source.y - center.y;
  return {
    kind: "rotate",
    source,
    center,
    angleDegrees,
    result: roundPoint(point(center.x + dx * Math.cos(radians) - dy * Math.sin(radians), center.y + dx * Math.sin(radians) + dy * Math.cos(radians))),
  };
}

export function translatePoint(source: KernelPoint, vector: KernelPoint): TransformAction {
  return { kind: "translate", source, vector, result: roundPoint(point(source.x + vector.x, source.y + vector.y)) };
}

export function dilatePoint(source: KernelPoint, factor: number, center: KernelPoint = point(0, 0)): TransformAction {
  return { kind: "dilate", source, center, factor, result: roundPoint(point(center.x + (source.x - center.x) * factor, center.y + (source.y - center.y) * factor)) };
}

export function mirrorPoint(source: KernelPoint, axis: KernelLine): TransformAction {
  const dx = axis.b.x - axis.a.x;
  const dy = axis.b.y - axis.a.y;
  const lengthSquared = dx * dx + dy * dy || 1;
  const t = ((source.x - axis.a.x) * dx + (source.y - axis.a.y) * dy) / lengthSquared;
  const projection = point(axis.a.x + t * dx, axis.a.y + t * dy);
  return { kind: "mirror", source, axis, result: roundPoint(point(2 * projection.x - source.x, 2 * projection.y - source.y)) };
}

export function parseTransformCommand(name: string, args: string[]): TransformAction {
  const command = name.toLowerCase();
  const source = parseKernelPoint(args[0] ?? "");
  if (!source) throw new Error(`Use ${name}[(x,y), ...] with a point as the first argument.`);
  if (command === "rotate") {
    const angle = Number(args[1] ?? 0);
    const center = parseKernelPoint(args[2] ?? "") ?? point(0, 0);
    if (!Number.isFinite(angle)) throw new Error("Rotate angle must be numeric.");
    return rotatePoint(source, angle, center);
  }
  if (command === "translate") {
    const vector = parseKernelPoint(args[1] ?? "");
    if (!vector) throw new Error("Use Translate[(x,y), (dx,dy)].");
    return translatePoint(source, vector);
  }
  if (command === "dilate") {
    const factor = Number(args[1] ?? 1);
    const center = parseKernelPoint(args[2] ?? "") ?? point(0, 0);
    if (!Number.isFinite(factor)) throw new Error("Dilate factor must be numeric.");
    return dilatePoint(source, factor, center);
  }
  if (command === "mirror") {
    const a = parseKernelPoint(args[1] ?? "");
    const b = parseKernelPoint(args[2] ?? "");
    if (!a || !b) throw new Error("Use Mirror[(x,y), axisPointA, axisPointB].");
    return mirrorPoint(source, line(a, b));
  }
  throw new Error(`Unsupported transform command "${name}".`);
}

export function parseStyleAction(name: string, args: string[]): StyleAction {
  const objectName = (args[0] ?? "").trim();
  if (!objectName) throw new Error(`Use ${name}[object, value].`);
  const command = name.toLowerCase();
  if (command === "setcolor") {
    const color = normalizeColor(args[1] ?? "");
    const fill = args[2] ? normalizeColor(args[2]) : undefined;
    return { objectName, patch: { color, fill } };
  }
  if (command === "showlabel") {
    const labelMode = normalizeLabelMode(args[1] ?? "both");
    return { objectName, patch: { labelMode } };
  }
  if (command === "setvisible") {
    return { objectName, patch: { visible: normalizeBoolean(args[1] ?? "true") } };
  }
  if (command === "settrace") {
    return { objectName, patch: { trace: normalizeBoolean(args[1] ?? "true") } };
  }
  if (command === "setopacity") {
    const opacity = Number(args[1] ?? 1);
    if (!Number.isFinite(opacity)) throw new Error("Opacity must be numeric.");
    return { objectName, patch: { opacity: Math.max(0, Math.min(1, opacity)) } };
  }
  throw new Error(`Unsupported style command "${name}".`);
}

export function createAnimationAction(name: string, args: string[]): AnimationAction {
  const command = name.toLowerCase();
  const target = (args[0] ?? "scene").trim() || "scene";
  const speed = Number(args[1] ?? 1);
  const playing = command === "startanimation";
  return {
    target,
    playing,
    speed: Number.isFinite(speed) && speed > 0 ? speed : 1,
    detail: `${target} animation ${playing ? "started" : "paused"}${playing ? "" : " for inspection"}.`,
  };
}

export function describeTransformAction(action: TransformAction) {
  if (action.kind === "rotate") return `(${formatPoint(action.source)}) rotated ${action.angleDegrees}deg around (${formatPoint(action.center)}) -> (${formatPoint(action.result)})`;
  if (action.kind === "translate") return `(${formatPoint(action.source)}) translated by <${formatPoint(action.vector)}> -> (${formatPoint(action.result)})`;
  if (action.kind === "dilate") return `(${formatPoint(action.source)}) dilated by ${action.factor} from (${formatPoint(action.center)}) -> (${formatPoint(action.result)})`;
  return `(${formatPoint(action.source)}) mirrored over line (${formatPoint(action.axis.a)})-(${formatPoint(action.axis.b)}) -> (${formatPoint(action.result)})`;
}

function normalizeColor(value: string) {
  const clean = value.trim();
  if (/^#[0-9a-f]{3}([0-9a-f]{3})?$/i.test(clean)) return clean;
  if (/^[a-z]+$/i.test(clean)) return clean.toLowerCase();
  throw new Error("Use a CSS color name or hex color such as #06b6d4.");
}

function normalizeLabelMode(value: string): StyleAction["patch"]["labelMode"] {
  const mode = value.trim().toLowerCase();
  if (mode === "name" || mode === "value" || mode === "both" || mode === "hidden") return mode;
  throw new Error("Label mode must be name, value, both, or hidden.");
}

function normalizeBoolean(value: string) {
  return !/^(false|0|no|off|hidden)$/i.test(value.trim());
}

function roundPoint(value: KernelPoint) {
  return point(round(value.x), round(value.y));
}

function round(value: number) {
  return Math.round(value * 1_000_000) / 1_000_000;
}

function formatPoint(value: KernelPoint) {
  return `${round(value.x)}, ${round(value.y)}`;
}
