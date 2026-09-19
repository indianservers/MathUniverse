export const EMBED_KINDS = ["twodgraph", "twodgeometry", "threedgraph", "threedgeometry"] as const;
export type EmbedKind = (typeof EMBED_KINDS)[number];

export type EmbedVec2 = { x: number; y: number };
export type EmbedVec3 = { x: number; y: number; z: number };

export type EmbedObject = {
  id: string;
  type: string;
  label?: string;
  color?: string;
  fill?: string;
  size?: number;
  width?: number;
  height?: number;
  depth?: number;
  radius?: number;
  x?: number;
  y?: number;
  z?: number;
  x2?: number;
  y2?: number;
  z2?: number;
  expression?: string;
  points?: number[][];
  visible?: boolean;
};

export type EmbedView = {
  width?: number;
  height?: number;
  xmin?: number;
  xmax?: number;
  ymin?: number;
  ymax?: number;
  zmin?: number;
  zmax?: number;
  yaw?: number;
  pitch?: number;
  distance?: number;
  showGrid?: boolean;
  showAxes?: boolean;
  background?: string;
};

export type EmbedScene = {
  kind: EmbedKind;
  version: 1;
  title?: string;
  view: EmbedView;
  objects: EmbedObject[];
};

export const API_NAMES: Record<EmbedKind, string> = {
  twodgraph: "TwoDGraph",
  twodgeometry: "TwoDGeometry",
  threedgraph: "ThreeDGraph",
  threedgeometry: "ThreeDGeometry",
};

const SAFE_EXPR = /^(?:[0-9+\-*/^%.,() \t]|x|y|z|pi|e|sin|cos|tan|abs|sqrt|exp|log|pow|min|max)+$/i;

export function isEmbedKind(value: string): value is EmbedKind {
  return (EMBED_KINDS as readonly string[]).includes(value);
}

export function uid(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 8)}`;
}

export function defaultScene(kind: EmbedKind): EmbedScene {
  if (kind === "twodgraph") {
    return {
      kind,
      version: 1,
      title: "2D graph",
      view: { width: 640, height: 400, xmin: -6, xmax: 6, ymin: -4, ymax: 4, showGrid: true, showAxes: true, background: "#f8fbff" },
      objects: [
        { id: "f1", type: "function", label: "y = x²", expression: "x^2", color: "#2563eb", size: 2 },
        { id: "f2", type: "function", label: "y = sin(x)", expression: "sin(x)", color: "#db2777", size: 2 },
        { id: "p1", type: "point", label: "(1,1)", x: 1, y: 1, size: 6, color: "#0f766e" },
      ],
    };
  }
  if (kind === "twodgeometry") {
    return {
      kind,
      version: 1,
      title: "2D geometry",
      view: { width: 640, height: 400, xmin: -2, xmax: 8, ymin: -2, ymax: 6, showGrid: true, showAxes: true, background: "#fffdf8" },
      objects: [
        { id: "A", type: "point", label: "A", x: 0, y: 0, size: 7, color: "#1d4ed8" },
        { id: "B", type: "point", label: "B", x: 5, y: 0, size: 7, color: "#1d4ed8" },
        { id: "C", type: "point", label: "C", x: 1.6, y: 3.4, size: 7, color: "#1d4ed8" },
        { id: "ab", type: "segment", x: 0, y: 0, x2: 5, y2: 0, color: "#0f172a", size: 2 },
        { id: "bc", type: "segment", x: 5, y: 0, x2: 1.6, y2: 3.4, color: "#0f172a", size: 2 },
        { id: "ca", type: "segment", x: 1.6, y: 3.4, x2: 0, y2: 0, color: "#0f172a", size: 2 },
        { id: "circ", type: "circle", x: 2.5, y: 1.1, radius: 1.1, color: "#7c3aed", size: 2 },
      ],
    };
  }
  if (kind === "threedgraph") {
    return {
      kind,
      version: 1,
      title: "3D graph",
      view: { width: 640, height: 420, xmin: -2, xmax: 2, ymin: -2, ymax: 2, zmin: -1, zmax: 4, yaw: 0.7, pitch: 0.45, distance: 8, showGrid: true, showAxes: true, background: "#07111f" },
      objects: [
        { id: "s1", type: "surface", label: "z = x² + y²", expression: "x^2 + y^2", color: "#38bdf8", size: 1 },
      ],
    };
  }
  return {
    kind,
    version: 1,
    title: "3D geometry",
    view: { width: 640, height: 420, xmin: -3, xmax: 3, ymin: -3, ymax: 3, zmin: -3, zmax: 3, yaw: 0.6, pitch: 0.4, distance: 9, showGrid: true, showAxes: true, background: "#0b1220" },
    objects: [
      { id: "box", type: "box", label: "box", x: -0.8, y: 0, z: 0, width: 1.6, height: 1.2, depth: 1.6, color: "#22d3ee" },
      { id: "sph", type: "sphere", label: "sphere", x: 1.6, y: 0.4, z: 0.2, radius: 0.7, color: "#a78bfa" },
      { id: "seg", type: "segment", x: -2, y: -1, z: -1, x2: 2, y2: 1.4, z2: 1.2, color: "#f97316", size: 2 },
    ],
  };
}

export function normalizeScene(input: unknown, fallbackKind: EmbedKind = "twodgraph"): EmbedScene {
  const raw = (input && typeof input === "object" ? input : {}) as Partial<EmbedScene> & { objects?: unknown };
  const kind = isEmbedKind(String(raw.kind ?? fallbackKind)) ? (raw.kind as EmbedKind) : fallbackKind;
  const base = defaultScene(kind);
  const objects = Array.isArray(raw.objects)
    ? raw.objects.filter((item): item is EmbedObject => Boolean(item) && typeof item === "object").map((item, index) => ({
        id: String(item.id || `obj-${index + 1}`),
        type: String(item.type || "point"),
        label: item.label,
        color: item.color,
        fill: item.fill,
        size: num(item.size),
        width: num(item.width),
        height: num(item.height),
        depth: num(item.depth),
        radius: num(item.radius),
        x: num(item.x),
        y: num(item.y),
        z: num(item.z),
        x2: num(item.x2),
        y2: num(item.y2),
        z2: num(item.z2),
        expression: item.expression ? String(item.expression) : undefined,
        points: Array.isArray(item.points) ? item.points.filter((row) => Array.isArray(row)).map((row) => row.map((value) => Number(value) || 0)) : undefined,
        visible: item.visible !== false,
      }))
    : base.objects;
  return {
    kind,
    version: 1,
    title: raw.title ? String(raw.title) : base.title,
    view: { ...base.view, ...(raw.view ?? {}) },
    objects,
  };
}

function num(value: unknown) {
  if (value === undefined || value === null || value === "") return undefined;
  const next = Number(value);
  return Number.isFinite(next) ? next : undefined;
}

export function encodeScene(scene: EmbedScene) {
  const json = JSON.stringify(scene);
  return btoa(unescape(encodeURIComponent(json))).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

export function decodeScene(payload: string, fallbackKind: EmbedKind = "twodgraph") {
  try {
    const padded = payload.replace(/-/g, "+").replace(/_/g, "/");
    const json = decodeURIComponent(escape(atob(padded)));
    return normalizeScene(JSON.parse(json), fallbackKind);
  } catch {
    return defaultScene(fallbackKind);
  }
}

export function evaluateExpression(expression: string, vars: Record<string, number>) {
  const source = expression.trim().toLowerCase().replace(/\^/g, "**");
  if (!source || !SAFE_EXPR.test(source)) return Number.NaN;
  const names = Object.keys(vars);
  const values = names.map((name) => vars[name]);
  try {
    const fn = new Function("sin", "cos", "tan", "abs", "sqrt", "exp", "log", "pow", "min", "max", "pi", "e", ...names, `"use strict"; return (${source});`);
    const value = Number(fn(Math.sin, Math.cos, Math.tan, Math.abs, Math.sqrt, Math.exp, Math.log, Math.pow, Math.min, Math.max, Math.PI, Math.E, ...values));
    return Number.isFinite(value) ? value : Number.NaN;
  } catch {
    return Number.NaN;
  }
}

export function iframeSnippet(origin: string, scene: EmbedScene) {
  const view = scene.view;
  return `<iframe src="${origin}/embed.html?kind=${scene.kind}&c=${encodeScene(scene)}" width="${view.width ?? 640}" height="${view.height ?? 400}" style="border:0" loading="lazy" allowfullscreen title="${escapeAttr(scene.title || scene.kind)}"></iframe>`;
}

export function scriptSnippet(origin: string, scene: EmbedScene) {
  const api = API_NAMES[scene.kind];
  const file = `${scene.kind}.js`;
  const w = scene.view.width ?? 640;
  const h = scene.view.height ?? 400;
  return `<div id="mu-embed" style="width:${w}px;height:${h}px"></div>\n<script src="${origin}/${file}"></script>\n<script>\n  ${api}.embed(document.getElementById("mu-embed"), ${JSON.stringify(scene, null, 2)});\n</script>`;
}

function escapeAttr(value: string) {
  return value.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
}

function svgEl(name: string, attrs: Record<string, string | number>, parent?: SVGElement) {
  const node = document.createElementNS("http://www.w3.org/2000/svg", name);
  for (const [key, value] of Object.entries(attrs)) node.setAttribute(key, String(value));
  parent?.appendChild(node);
  return node;
}

function map2d(scene: EmbedScene, x: number, y: number) {
  const v = scene.view;
  const w = v.width ?? 640;
  const h = v.height ?? 400;
  const xmin = v.xmin ?? -6;
  const xmax = v.xmax ?? 6;
  const ymin = v.ymin ?? -4;
  const ymax = v.ymax ?? 4;
  return {
    x: ((x - xmin) / (xmax - xmin)) * w,
    y: h - ((y - ymin) / (ymax - ymin)) * h,
  };
}

function project3d(scene: EmbedScene, x: number, y: number, z: number) {
  const v = scene.view;
  const yaw = v.yaw ?? 0.7;
  const pitch = v.pitch ?? 0.4;
  const dist = v.distance ?? 8;
  const cy = Math.cos(yaw);
  const sy = Math.sin(yaw);
  const cp = Math.cos(pitch);
  const sp = Math.sin(pitch);
  const x1 = x * cy - z * sy;
  const z1 = x * sy + z * cy;
  const y1 = y * cp - z1 * sp;
  const z2 = y * sp + z1 * cp;
  const f = dist / Math.max(0.4, dist + z2);
  const w = v.width ?? 640;
  const h = v.height ?? 420;
  return { x: w / 2 + x1 * f * 70, y: h / 2 - y1 * f * 70, depth: z2 };
}

function drawGrid2d(svg: SVGElement, scene: EmbedScene) {
  const v = scene.view;
  if (v.showGrid === false) return;
  const xmin = v.xmin ?? -6;
  const xmax = v.xmax ?? 6;
  const ymin = v.ymin ?? -4;
  const ymax = v.ymax ?? 4;
  for (let x = Math.ceil(xmin); x <= xmax; x += 1) {
    const a = map2d(scene, x, ymin);
    const b = map2d(scene, x, ymax);
    svgEl("line", { x1: a.x, y1: a.y, x2: b.x, y2: b.y, stroke: "#d7e4f2", "stroke-width": x === 0 ? 1.6 : 1 }, svg);
  }
  for (let y = Math.ceil(ymin); y <= ymax; y += 1) {
    const a = map2d(scene, xmin, y);
    const b = map2d(scene, xmax, y);
    svgEl("line", { x1: a.x, y1: a.y, x2: b.x, y2: b.y, stroke: "#d7e4f2", "stroke-width": y === 0 ? 1.6 : 1 }, svg);
  }
}

function drawFunction(svg: SVGElement, scene: EmbedScene, object: EmbedObject) {
  const expression = object.expression || "x";
  const xmin = scene.view.xmin ?? -6;
  const xmax = scene.view.xmax ?? 6;
  const parts: string[] = [];
  for (let i = 0; i <= 180; i += 1) {
    const x = xmin + (i / 180) * (xmax - xmin);
    const y = evaluateExpression(expression, { x, y: 0, z: 0 });
    if (!Number.isFinite(y)) continue;
    const p = map2d(scene, x, y);
    parts.push(`${parts.length ? "L" : "M"}${p.x.toFixed(1)},${p.y.toFixed(1)}`);
  }
  if (parts.length) svgEl("path", { d: parts.join(" "), fill: "none", stroke: object.color || "#2563eb", "stroke-width": object.size || 2 }, svg);
}

function drawSurface(svg: SVGElement, scene: EmbedScene, object: EmbedObject) {
  const expression = object.expression || "x^2 + y^2";
  const xmin = scene.view.xmin ?? -2;
  const xmax = scene.view.xmax ?? 2;
  const ymin = scene.view.ymin ?? -2;
  const ymax = scene.view.ymax ?? 2;
  const n = 12;
  for (let i = 0; i <= n; i += 1) {
    const row: string[] = [];
    const y = ymin + (i / n) * (ymax - ymin);
    for (let j = 0; j <= n; j += 1) {
      const x = xmin + (j / n) * (xmax - xmin);
      const z = evaluateExpression(expression, { x, y, z: 0 });
      const p = project3d(scene, x, Number.isFinite(z) ? z * 0.35 : 0, y);
      row.push(`${row.length ? "L" : "M"}${p.x.toFixed(1)},${p.y.toFixed(1)}`);
    }
    svgEl("path", { d: row.join(" "), fill: "none", stroke: object.color || "#38bdf8", "stroke-width": 1, opacity: 0.85 }, svg);
  }
}

function boxCorners(object: EmbedObject) {
  const w = (object.width ?? 1) / 2;
  const h = (object.height ?? 1) / 2;
  const d = (object.depth ?? 1) / 2;
  const x = object.x ?? 0;
  const y = object.y ?? 0;
  const z = object.z ?? 0;
  return [
    [x - w, y - h, z - d],
    [x + w, y - h, z - d],
    [x + w, y + h, z - d],
    [x - w, y + h, z - d],
    [x - w, y - h, z + d],
    [x + w, y - h, z + d],
    [x + w, y + h, z + d],
    [x - w, y + h, z + d],
  ];
}

function drawBox(svg: SVGElement, scene: EmbedScene, object: EmbedObject) {
  const c = boxCorners(object).map(([x, y, z]) => project3d(scene, x, y, z));
  const edges = [[0, 1], [1, 2], [2, 3], [3, 0], [4, 5], [5, 6], [6, 7], [7, 4], [0, 4], [1, 5], [2, 6], [3, 7]];
  for (const [a, b] of edges) {
    svgEl("line", { x1: c[a].x, y1: c[a].y, x2: c[b].x, y2: c[b].y, stroke: object.color || "#22d3ee", "stroke-width": object.size || 2 }, svg);
  }
}

function drawSphere(svg: SVGElement, scene: EmbedScene, object: EmbedObject) {
  const r = object.radius ?? 0.7;
  const p = project3d(scene, object.x ?? 0, object.y ?? 0, object.z ?? 0);
  svgEl("circle", { cx: p.x, cy: p.y, r: r * 42, fill: object.fill || "transparent", stroke: object.color || "#a78bfa", "stroke-width": 2 }, svg);
}

function drawObject(svg: SVGElement, scene: EmbedScene, object: EmbedObject) {
  if (object.visible === false) return;
  const type = object.type;
  if (type === "function") {
    drawFunction(svg, scene, object);
    return;
  }
  if (type === "surface") {
    drawSurface(svg, scene, object);
    return;
  }
  if (type === "box") {
    drawBox(svg, scene, object);
    return;
  }
  if (type === "sphere") {
    drawSphere(svg, scene, object);
    return;
  }
  if (type === "circle") {
    const c = map2d(scene, object.x ?? 0, object.y ?? 0);
    const edge = map2d(scene, (object.x ?? 0) + (object.radius ?? 1), object.y ?? 0);
    svgEl("circle", { cx: c.x, cy: c.y, r: Math.abs(edge.x - c.x), fill: object.fill || "none", stroke: object.color || "#7c3aed", "stroke-width": object.size || 2 }, svg);
    return;
  }
  if (type === "polygon" && object.points?.length) {
    const d = object.points.map((row, index) => {
      const p = map2d(scene, row[0], row[1]);
      return `${index ? "L" : "M"}${p.x},${p.y}`;
    }).join(" ") + " Z";
    svgEl("path", { d, fill: object.fill || "rgba(37,99,235,.12)", stroke: object.color || "#2563eb", "stroke-width": object.size || 2 }, svg);
    return;
  }
  if (type === "segment" || type === "line") {
    if (scene.kind.startsWith("three")) {
      const a = project3d(scene, object.x ?? 0, object.y ?? 0, object.z ?? 0);
      const b = project3d(scene, object.x2 ?? 1, object.y2 ?? 1, object.z2 ?? 1);
      svgEl("line", { x1: a.x, y1: a.y, x2: b.x, y2: b.y, stroke: object.color || "#f97316", "stroke-width": object.size || 2 }, svg);
      return;
    }
    const a = map2d(scene, object.x ?? 0, object.y ?? 0);
    const b = map2d(scene, object.x2 ?? 1, object.y2 ?? 1);
    svgEl("line", { x1: a.x, y1: a.y, x2: b.x, y2: b.y, stroke: object.color || "#0f172a", "stroke-width": object.size || 2 }, svg);
    return;
  }
  const p = scene.kind.startsWith("three")
    ? project3d(scene, object.x ?? 0, object.y ?? 0, object.z ?? 0)
    : map2d(scene, object.x ?? 0, object.y ?? 0);
  svgEl("circle", { cx: p.x, cy: p.y, r: object.size || 5, fill: object.color || "#0f766e" }, svg);
  if (object.label) svgEl("text", { x: p.x + 8, y: p.y - 8, fill: object.color || "#0f172a", "font-size": 12, "font-family": "Inter,sans-serif" }, svg).textContent = object.label;
}

export function renderScene(container: HTMLElement, scene: EmbedScene) {
  container.innerHTML = "";
  const width = scene.view.width ?? 640;
  const height = scene.view.height ?? 400;
  container.style.position = "relative";
  container.style.width = "100%";
  container.style.height = "100%";
  container.style.minHeight = `${Math.min(height, 280)}px`;
  const svg = svgEl("svg", {
    viewBox: `0 0 ${width} ${height}`,
    width: "100%",
    height: "100%",
    role: "img",
    "aria-label": scene.title || scene.kind,
  });
  svg.style.display = "block";
  svg.style.background = scene.view.background || "#fff";
  svg.style.borderRadius = "12px";
  container.appendChild(svg);
  if (!scene.kind.startsWith("three")) drawGrid2d(svg, scene);
  else if (scene.view.showAxes !== false) {
    const o = project3d(scene, 0, 0, 0);
    const x = project3d(scene, 2, 0, 0);
    const y = project3d(scene, 0, 2, 0);
    const z = project3d(scene, 0, 0, 2);
    svgEl("line", { x1: o.x, y1: o.y, x2: x.x, y2: x.y, stroke: "#f87171", "stroke-width": 2 }, svg);
    svgEl("line", { x1: o.x, y1: o.y, x2: y.x, y2: y.y, stroke: "#4ade80", "stroke-width": 2 }, svg);
    svgEl("line", { x1: o.x, y1: o.y, x2: z.x, y2: z.y, stroke: "#60a5fa", "stroke-width": 2 }, svg);
  }
  for (const object of scene.objects) drawObject(svg, scene, object);
  return svg;
}

export function embed(target: string | HTMLElement, content: unknown, fallbackKind: EmbedKind = "twodgraph") {
  const el = typeof target === "string" ? document.querySelector<HTMLElement>(target) : target;
  if (!el) throw new Error("Math Universe embed target not found");
  const scene = normalizeScene(content, fallbackKind);
  renderScene(el, scene);
  return scene;
}

export function createApi(kind: EmbedKind) {
  return {
    kind,
    defaultScene: () => defaultScene(kind),
    embed(target: string | HTMLElement, content?: unknown) {
      return embed(target, content ?? defaultScene(kind), kind);
    },
    encode: encodeScene,
    decode: (payload: string) => decodeScene(payload, kind),
  };
}
