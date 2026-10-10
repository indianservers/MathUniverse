import type { Mark } from "./scenes";

/** CPU Canvas2D animation layer for the canonical SVG diagrams. No WebGL required. */
export function canvasPainter(canvas: HTMLCanvasElement, dark: boolean) {
  const scale = Math.min(3, window.devicePixelRatio || 1);
  canvas.width = Math.round(180 * scale); canvas.height = Math.round(78 * scale);
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;
  const lengths = new Map([...canvas.closest("svg")!.querySelectorAll<SVGPathElement>('path[data-mark][pathLength]')].map(p => [p.dataset.mark!, p.getTotalLength()]));
  const curve = ctx.createLinearGradient(18, 16, 160, 65);
  curve.addColorStop(0, "#00d6ee"); curve.addColorStop(.5, "#248aff"); curve.addColorStop(1, "#a43dff");
  const area = ctx.createLinearGradient(15, 8, 120, 75);
  area.addColorStop(0, "#03d2eebb"); area.addColorStop(.6, "#328cff77"); area.addColorStop(1, "#a150ff33");
  function color(value: unknown, x = 0, y = 0, r = 4): string | CanvasGradient {
    const s = String(value);
    if (s === "var(--cli-paper)") return dark ? "#18233b" : "#f7fbff";
    if (s.includes("-curve")) return curve;
    if (s.includes("-area")) return area;
    if (s.includes("-ball") || s.includes("-sun")) {
      const warm = s.includes("-sun"), g = ctx!.createRadialGradient(x - r * .3, y - r * .4, 0, x, y, r);
      g.addColorStop(0, warm ? "#fff7c3" : "#e4ffff"); g.addColorStop(.3, warm ? "#ffc044" : "#04d4ff"); g.addColorStop(1, warm ? "#f87b12" : "#1878ff");
      return g;
    }
    return s;
  }
  return (marks: Mark[]) => {
    ctx.setTransform(scale, 0, 0, scale, 0, 0); ctx.clearRect(0, 0, 180, 78);
    for (const m of marks) {
      const a = m.attrs, n = (key: string, fallback = 0) => Number(a[key] ?? fallback);
      ctx.save(); ctx.lineWidth = n("strokeWidth", 1); ctx.lineJoin = "round"; ctx.lineCap = "round";
      const opacity = n("opacity", 1);
      if (m.tag === "text") {
        ctx.globalAlpha = opacity; ctx.fillStyle = dark ? "#dceeff" : "#15386b";
        ctx.font = `italic ${n("fontSize", 12)}px Georgia, serif`; ctx.fillText(m.text ?? "", n("x"), n("y"));
        ctx.restore(); continue;
      }
      let shape: Path2D;
      if (m.tag === "path") shape = new Path2D(String(a.d));
      else {
        shape = new Path2D();
        if (m.tag === "circle") shape.arc(n("cx"), n("cy"), n("r"), 0, Math.PI * 2);
        if (m.tag === "ellipse") shape.ellipse(n("cx"), n("cy"), n("rx"), n("ry"), 0, 0, Math.PI * 2);
        if (m.tag === "line") { shape.moveTo(n("x1"), n("y1")); shape.lineTo(n("x2"), n("y2")); }
        if (m.tag === "polygon") {
          const p = String(a.points).trim().split(/[ ,]+/).map(Number);
          p.forEach((_, i) => { if (!(i % 2)) { if (!i) shape.moveTo(p[i], p[i + 1]); else shape.lineTo(p[i], p[i + 1]); } }); shape.closePath();
        }
      }
      if (a.fill && a.fill !== "none") {
        ctx.globalAlpha = opacity * n("fillOpacity", 1); ctx.fillStyle = color(a.fill, n("cx"), n("cy"), n("r", 4)); ctx.fill(shape);
      }
      if (a.stroke && a.stroke !== "none") {
        ctx.globalAlpha = opacity * n("strokeOpacity", 1); ctx.strokeStyle = color(a.stroke);
        if (a.strokeDasharray) {
          const length = m.tag === "line" ? Math.hypot(n("x2") - n("x1"), n("y2") - n("y1")) : (lengths.get(m.key) ?? 100);
          const scale = a.pathLength ? length / n("pathLength", 100) : 1;
          ctx.setLineDash(String(a.strokeDasharray).split(/[ ,]+/).map(v => Number(v) * scale));
          ctx.lineDashOffset = n("strokeDashoffset") * scale;
        }
        ctx.stroke(shape);
        if (a.markerEnd && m.tag === "line") {
          const x = n("x2"), y = n("y2"), angle = Math.atan2(y - n("y1"), x - n("x1"));
          ctx.fillStyle = ctx.strokeStyle; ctx.beginPath(); ctx.moveTo(x, y);
          ctx.lineTo(x - 3 * Math.cos(angle - .5), y - 3 * Math.sin(angle - .5));
          ctx.lineTo(x - 3 * Math.cos(angle + .5), y - 3 * Math.sin(angle + .5)); ctx.closePath(); ctx.fill();
        }
      }
      ctx.restore();
    }
  };
}
