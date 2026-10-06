import { lessonScene, type LessonPoint } from "./geometryLessonScene";

export function shapeWorkspaceScene(shape: string, d: { cx: number; cy: number; radius: number; w: number; h: number; top: number; height: number; triangleApexX: number; triangleBaseY: number; triangleTopY: number; angle: number; a: number; b: number; c?: number }, polygonPoints: string, starPoints: string) {
  const scene = lessonScene(480, 360, p => p, d.radius / Math.max(d.a, 0.1));
  const { cx, cy, radius: r, w, h } = d;
  const p = (x: number, y: number): LessonPoint => ({ x, y });
  const rectangle = (width: number, height: number) => [p(cx - width / 2, cy - height / 2), p(cx + width / 2, cy - height / 2), p(cx + width / 2, cy + height / 2), p(cx - width / 2, cy + height / 2)];
  const parse = (value: string) => value.split(" ").map(pair => { const [x, y] = pair.split(",").map(Number); return p(x, y); });
  if (shape === "circle") scene.circle({ id: "O", x: cx, y: cy }, r);
  else if (shape === "annulus" || shape === "torus") { scene.circle(p(cx, cy), r); scene.circle(p(cx, cy), Math.max(18, Math.min(d.b * 18, r - 12))); }
  else if (shape === "crescent") {
    const path = typeof document !== "undefined" ? document.createElementNS("http://www.w3.org/2000/svg", "path") : null;
    const inner = Math.max(20, d.b * 18);
    path?.setAttribute("d", `M ${cx - r * .35} ${cy - r} A ${r} ${r} 0 1 0 ${cx - r * .35} ${cy + r} A ${inner} ${inner} 0 1 1 ${cx - r * .35} ${cy - r} Z`);
    if (path && typeof path.getTotalLength === "function") {
      const length = path.getTotalLength();
      scene.construction.loci.push({ id: "outline", label: shape, points: Array.from({ length: 241 }, (_, i) => { const p = path.getPointAtLength(length * i / 240); return { x: p.x, y: p.y }; }), style: { color: "#08b9dd" } });
    }
  } else if (shape === "rounded-rectangle") {
    const corner = Math.min((d.c ?? 1) * 18, w / 2, h / 2);
    const centers = [p(cx + w / 2 - corner, cy - h / 2 + corner), p(cx + w / 2 - corner, cy + h / 2 - corner), p(cx - w / 2 + corner, cy + h / 2 - corner), p(cx - w / 2 + corner, cy - h / 2 + corner)];
    const outline = centers.flatMap((center, k) => Array.from({ length: 25 }, (_, i) => { const a = -Math.PI / 2 + k * Math.PI / 2 + i * Math.PI / 48; return p(center.x + corner * Math.cos(a), center.y + corner * Math.sin(a)); }));
    outline.push(outline[0]);
    scene.construction.loci.push({ id: "outline", label: shape, points: outline, style: { color: "#08b9dd" } });
  } else if (shape === "ellipse") {
    const rx = shape === "ellipse" ? Math.min(d.a * 18, 170) : w / 2, ry = shape === "ellipse" ? Math.min(d.b * 18, 120) : h / 2;
    scene.construction.loci.push({ id: "outline", label: shape, points: Array.from({ length: 181 }, (_, i) => ({ x: cx + rx * Math.cos(i * Math.PI / 90), y: cy + ry * Math.sin(i * Math.PI / 90) })), style: { color: "#08b9dd" } });
  } else if (["semicircle", "sector", "quadrant", "segment"].includes(shape)) {
    const angle = shape === "semicircle" ? Math.PI : shape === "quadrant" ? Math.PI / 2 : d.angle * Math.PI / 180;
    const center = scene.point({ id: "O", x: cx, y: cy });
    const start = scene.point(p(cx + r, cy)), end = scene.point(p(cx + r * Math.cos(angle), cy - r * Math.sin(angle)));
    scene.construction.arcs.push({ id: "arc", center, start, end, sector: shape !== "segment", style: { color: "#08b9dd", fill: "rgba(8,185,221,.12)" } });
    if (shape === "segment" || shape === "semicircle") scene.line(p(cx + r, cy), p(cx + r * Math.cos(angle), cy - r * Math.sin(angle)));
  } else if (shape.includes("triangle")) {
    const left = cx - w / 2, right = cx + w / 2;
    scene.polygon([p(left, d.triangleBaseY), p(right, d.triangleBaseY), p(shape === "right-triangle" ? left : d.triangleApexX, d.triangleTopY)]);
  } else if (shape === "square" || shape === "rectangle") scene.polygon(rectangle(shape === "square" ? 2 * r : w, shape === "square" ? 2 * r : h));
  else if (shape === "star") scene.polygon(parse(starPoints));
  else if (shape === "rhombus" || shape === "kite") scene.polygon([p(cx, cy - h / 2), p(cx + w / 2, cy), p(cx, cy + h / 2), p(cx - w / 2, cy)]);
  else if (shape === "parallelogram") scene.polygon([p(cx - w / 2 + 45, cy - h / 2), p(cx + w / 2, cy - h / 2), p(cx + w / 2 - 45, cy + h / 2), p(cx - w / 2, cy + h / 2)]);
  else if (shape === "trapezium") scene.polygon([p(cx - d.top / 2, cy - d.height / 2), p(cx + d.top / 2, cy - d.height / 2), p(cx + w / 2, cy + d.height / 2), p(cx - w / 2, cy + d.height / 2)]);
  else if (shape === "cross") { scene.polygon(rectangle(w, h / 3)); scene.polygon(rectangle(w / 3, h)); }
  else scene.polygon(parse(polygonPoints));
  return scene.result();
}

export function solidKindForShape(shape: string) {
  if (shape.endsWith("prism")) return "prism";
  if (shape.endsWith("pyramid")) return "pyramid";
  if (shape === "icosahedron") return "polyhedron";
  if (shape === "hollow-cylinder") return "cylinder";
  return shape;
}
