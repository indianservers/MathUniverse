import type { Mark } from "./scenes";

export function createPainter(canvas: HTMLCanvasElement) {
  const dpr = Math.min(2, window.devicePixelRatio || 1);
  canvas.width = 200 * dpr; canvas.height = 180 * dpr;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;
  const spectrum = ctx.createLinearGradient(0, 27, 0, 157);
  ["#2eeaff", "#aa64ff", "#2eeaff", "#ae67ff", "#2eeaff"].forEach((color, i) => spectrum.addColorStop(i / 4, color));
  return (marks: Mark[], phase: number, textures?: HTMLCanvasElement[], roots = false) => {
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.clearRect(0, 0, 200, 180);
    if (textures) {
      const q = .5 - .5 * Math.cos(2 * Math.PI * phase), zoom = 1 + .085 * q;
      ctx.save(); ctx.translate(101, 91); ctx.rotate(-Math.PI / 2); ctx.scale(zoom, zoom);
      ctx.drawImage(textures[0], -78 + q * 2, -74, 156, 148);
      ctx.globalAlpha = .3 * q; ctx.drawImage(textures[1], -78 + q * 2, -74, 156, 148); ctx.restore();
    }
    ctx.save();
    if (roots) { ctx.translate(100, 101); ctx.rotate(.015 * Math.sin(phase * Math.PI * 2)); ctx.translate(-100, -101); }
    for (const m of marks) {
      const a = m.attrs, n = (k: string, d = 0) => Number(a[k] ?? d);
      ctx.save(); ctx.globalAlpha = n("opacity", 1); ctx.lineWidth = n("strokeWidth", 1.5); ctx.lineCap = "round"; ctx.lineJoin = "round";
      ctx.shadowBlur = m.tag === "text" ? 0 : 4; ctx.shadowColor = String(a.stroke ?? "#26d9ff");
      if (m.tag === "text") { ctx.fillStyle = String(a.fill ?? "#e5f6ff"); ctx.font = `italic ${n("fontSize", 12)}px Georgia,serif`; ctx.fillText(m.text ?? "", n("x"), n("y")); ctx.restore(); continue; }
      let shape: Path2D;
      if (m.tag === "path") shape = new Path2D(String(a.d));
      else { shape = new Path2D(); if (m.tag === "circle") shape.arc(n("cx"), n("cy"), n("r"), 0, Math.PI * 2); else { shape.moveTo(n("x1"), n("y1")); shape.lineTo(n("x2"), n("y2")); } }
      if (a.strokeDasharray) ctx.setLineDash(String(a.strokeDasharray).split(/[ ,]+/).map(Number));
      if (a.fill && a.fill !== "none") { ctx.fillStyle = String(a.fill); ctx.fill(shape); }
      if (a.stroke && a.stroke !== "none") { ctx.strokeStyle = a["data-spectrum"] ? spectrum : String(a.stroke); ctx.stroke(shape); }
      if (a["data-arrow"]) {
        const x = n("x2"), y = n("y2"), angle = Math.atan2(y - n("y1"), x - n("x1"));
        ctx.fillStyle = String(a.stroke); ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x - 7 * Math.cos(angle - .4), y - 7 * Math.sin(angle - .4)); ctx.lineTo(x - 7 * Math.cos(angle + .4), y - 7 * Math.sin(angle + .4)); ctx.closePath(); ctx.fill();
      }
      ctx.restore();
    }
    ctx.restore();
  };
}
