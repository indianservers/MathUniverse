import { useEffect, useMemo, useRef, useState, type PointerEvent } from "react";
import type { StudioMockupPage } from "../mockup/studioMockupCatalog";
import { clamp, fmt } from "../mockup/studioLabKit";
import { ComplexLabChrome, CxCol, CxLive, CxSlider, CxToggle } from "./ComplexLabChrome";
import { argC, fmtC, modC } from "./complexLabMath";
import { escapeTime, inMainCardioid, juliaConnected, orbit, periodBulbLabel } from "./fractalMath";

type Palette = "spectrum" | "ice" | "magma" | "forest";

const PRESETS: Array<{ name: string; cx: number; cy: number; label: string }> = [
  { name: "Douady rabbit", cx: -0.123, cy: 0.745, label: "Douady rabbit" },
  { name: "Dendrite", cx: 0, cy: 1, label: "Dendrite" },
  { name: "Ship", cx: -1.75, cy: 0.01, label: "Ship" },
  { name: "Lightning", cx: -0.1, cy: 0.651, label: "Lightning" },
];

function colorFor(k: number, max: number, palette: Palette, interior: boolean): string {
  if (k >= max) return interior ? "#020617" : "#0b1220";
  const t = k / Math.max(1, max);
  if (palette === "ice") return `hsl(${205 + t * 40} 90% ${28 + t * 42}%)`;
  if (palette === "magma") return `hsl(${18 + t * 50} 92% ${22 + t * 40}%)`;
  if (palette === "forest") return `hsl(${140 + t * 70} 80% ${18 + t * 40}%)`;
  return `hsl(${190 + (k * 11) % 140} 92% ${32 + (k % 9) * 4}%)`;
}

function FractalView({
  kind,
  cx,
  cy,
  iter,
  escapeR,
  palette,
  interior,
  smooth,
  title,
  onPick,
}: {
  kind: "mandel" | "julia";
  cx: number;
  cy: number;
  iter: number;
  escapeR: number;
  palette: Palette;
  interior: boolean;
  smooth: boolean;
  title: string;
  onPick?: (re: number, im: number) => void;
}) {
  const ref = useRef<HTMLCanvasElement>(null);
  const xmin = kind === "mandel" ? -2.2 : -1.8;
  const xmax = kind === "mandel" ? 1.0 : 1.8;
  const ymin = kind === "mandel" ? -1.35 : -1.6;
  const ymax = kind === "mandel" ? 1.35 : 1.6;
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const w = canvas.width;
    const h = canvas.height;
    const img = ctx.createImageData(w, h);
    const maxDraw = Math.min(iter, smooth ? 220 : 80);
    for (let row = 0; row < h; row += 1) {
      const y = ymax - (row / Math.max(1, h - 1)) * (ymax - ymin);
      for (let col = 0; col < w; col += 1) {
        const x = xmin + (col / Math.max(1, w - 1)) * (xmax - xmin);
        const k = kind === "mandel" ? escapeTime(0, 0, x, y, maxDraw, escapeR) : escapeTime(x, y, cx, cy, maxDraw, escapeR);
        const css = colorFor(k, maxDraw, palette, interior);
        const m = css.match(/hsl\((\d+) (\d+)% (\d+)%\)/);
        const hue = Number(m?.[1] ?? 210);
        const sat = Number(m?.[2] ?? 80) / 100;
        const lig = k >= maxDraw ? (interior ? 0.04 : 0.06) : Number(m?.[3] ?? 40) / 100;
        const a = sat * Math.min(lig, 1 - lig);
        const f = (n: number) => {
          const k2 = (n + hue / 30) % 12;
          return lig - a * Math.max(-1, Math.min(k2 - 3, 9 - k2, 1));
        };
        const r = Math.round(255 * (k >= maxDraw ? lig : f(0)));
        const g = Math.round(255 * (k >= maxDraw ? lig : f(8)));
        const b = Math.round(255 * (k >= maxDraw ? lig : f(4)));
        const i = (row * w + col) * 4;
        img.data[i] = r;
        img.data[i + 1] = g;
        img.data[i + 2] = b;
        img.data[i + 3] = 255;
      }
    }
    ctx.putImageData(img, 0, 0);
  }, [kind, cx, cy, iter, escapeR, palette, interior, smooth, xmin, xmax, ymin, ymax]);

  const pick = (event: PointerEvent<HTMLDivElement>) => {
    if (!onPick) return;
    const box = event.currentTarget.getBoundingClientRect();
    const re = xmin + ((event.clientX - box.left) / box.width) * (xmax - xmin);
    const im = ymax - ((event.clientY - box.top) / box.height) * (ymax - ymin);
    onPick(re, im);
  };

  const px = (re: number) => ((re - xmin) / (xmax - xmin)) * 100;
  const py = (im: number) => ((ymax - im) / (ymax - ymin)) * 100;

  return (
    <div className={`cx-frac-view${onPick ? " is-interactive" : ""}`} onPointerDown={pick}>
      <canvas ref={ref} width={260} height={220} aria-hidden="true" />
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-label={title}>
        <line x1="0" y1={py(0)} x2="100" y2={py(0)} stroke="rgba(226,232,240,.35)" strokeWidth="0.4" />
        <line x1={px(0)} y1="0" x2={px(0)} y2="100" stroke="rgba(226,232,240,.35)" strokeWidth="0.4" />
        <text x="96" y={py(0) - 2} fontSize="3.2" fill="#cbd5e1" textAnchor="end">Re</text>
        <text x={px(0) + 1.5} y="4" fontSize="3.2" fill="#cbd5e1">Im</text>
        {kind === "mandel" ? (
          <>
            <line x1={px(0)} y1={py(0)} x2={px(cx)} y2={py(cy)} stroke="#c4b5fd" strokeWidth="0.5" strokeDasharray="1.4 1" />
            <circle cx={px(cx)} cy={py(cy)} r="1.5" fill="#a78bfa" stroke="#fff" strokeWidth="0.4" />
            <text x={px(cx) + 2} y={py(cy) - 1.5} fontSize="3.2" fill="#e9d5ff">c</text>
          </>
        ) : null}
      </svg>
    </div>
  );
}

export default function FractalsLab({ page }: { page: StudioMockupPage }) {
  const [cx, setCx] = useState(-0.123);
  const [cy, setCy] = useState(0.745);
  const [iter, setIter] = useState(120);
  const [escapeR, setEscapeR] = useState(2);
  const [palette, setPalette] = useState<Palette>("spectrum");
  const [smooth, setSmooth] = useState(true);
  const [interior, setInterior] = useState(true);
  const [linkC, setLinkC] = useState(true);
  const [jx, setJx] = useState(-0.123);
  const [jy, setJy] = useState(0.745);
  const pts = useMemo(() => orbit(0, 0, cx, cy, 18), [cx, cy]);
  const inside = juliaConnected(cx, cy);
  const bulb = periodBulbLabel(cx, cy);
  const cardioid = inMainCardioid(cx, cy);
  const c = { re: cx, im: cy };
  const last = pts[pts.length - 1] ?? { x: 0, y: 0 };
  const zn = { re: last.x, im: last.y };
  const escapedAt = pts.findIndex((p) => p.x * p.x + p.y * p.y > escapeR * escapeR);

  return (
    <ComplexLabChrome page={page} className="is-fractal">
      {(mode, setMode) => (
        <>
          <div className="cx-frac-bar">
            <div className="cx-ops" role="group" aria-label="Fractal set">
              {(["Mandelbrot Set", "Julia Set"] as const).map((item) => (
                <button key={item} type="button" className={mode === item ? "active" : ""} aria-pressed={mode === item} onClick={() => setMode(item)}>
                  {item === "Mandelbrot Set" ? "Mandelbrot Set" : "Julia Set"}
                </button>
              ))}
            </div>
            <p className="cx-eq">c = {fmtC(c, 3)}</p>
            <CxToggle label="Link c" on={linkC} onChange={setLinkC} />
          </div>
          <CxCol>
            <div className="cx-card">
              <div className="cx-kicker">Fractal Controls</div>
              <label className="cx-select">Set
                <select aria-label="Set" value={mode} onChange={(event) => setMode(event.target.value)}>
                  <option>Mandelbrot Set</option>
                  <option>Julia Set</option>
                </select>
              </label>
              <div className="cx-kicker">Parameter c</div>
              <div className="cx-coeff">
                <label className="cx-step">
                  <span>Re</span>
                  <input type="number" aria-label="Re c" step={0.001} value={Number(cx.toFixed(3))} onChange={(event) => setCx(clamp(Number(event.target.value), -2, 1))} />
                </label>
                <label className="cx-step">
                  <span>Im</span>
                  <input type="number" aria-label="Im c" step={0.001} value={Number(cy.toFixed(3))} onChange={(event) => setCy(clamp(Number(event.target.value), -1.4, 1.4))} />
                  <b>i</b>
                </label>
              </div>
              <p className="cx-meta">Drag on Mandelbrot to set c.</p>
              <CxSlider label="Max iterations" value={iter} min={10} max={500} step={1} display={String(iter)} onChange={setIter} />
              <CxSlider label="Escape radius" value={escapeR} min={1} max={10} step={0.1} display={fmt(escapeR, 1)} onChange={setEscapeR} />
              <label className="cx-select">Palette
                <select aria-label="Palette" value={palette} onChange={(event) => setPalette(event.target.value as Palette)}>
                  <option value="spectrum">Spectrum</option>
                  <option value="ice">Ice</option>
                  <option value="magma">Magma</option>
                  <option value="forest">Forest</option>
                </select>
              </label>
              <div className="cx-kicker">Rendering</div>
              <div className="cx-ops">
                <button type="button" className={smooth ? "active" : ""} onClick={() => setSmooth(true)}>Smooth</button>
                <button type="button" className={!smooth ? "active" : ""} onClick={() => setSmooth(false)}>Discrete</button>
              </div>
              <CxToggle label="Interior coloring" on={interior} onChange={setInterior} />
              <div className="cx-ops">
                <button type="button" onClick={() => { setCx(-0.123); setCy(0.745); }}>Fit</button>
                <button type="button" onClick={() => { setCx(-0.123); setCy(0.745); setIter(120); setEscapeR(2); }}>Reset</button>
              </div>
            </div>
          </CxCol>
          <section className="cx-frac-stage">
            <div className="cx-frac-pair">
              <figure>
                <figcaption>Mandelbrot set</figcaption>
                <FractalView
                  kind="mandel"
                  cx={cx}
                  cy={cy}
                  iter={iter}
                  escapeR={escapeR}
                  palette={palette}
                  interior={interior}
                  smooth={smooth}
                  title="Mandelbrot set"
                  onPick={(re, im) => {
                    setCx(clamp(re, -2, 1));
                    setCy(clamp(im, -1.4, 1.4));
                    if (linkC) {
                      setJx(clamp(re, -2, 1));
                      setJy(clamp(im, -1.4, 1.4));
                    }
                    if (mode !== "Mandelbrot Set") setMode("Mandelbrot Set");
                  }}
                />
              </figure>
              <figure>
                <figcaption>Julia set for c</figcaption>
                <FractalView
                  kind="julia"
                  cx={linkC ? cx : jx}
                  cy={linkC ? cy : jy}
                  iter={iter}
                  escapeR={escapeR}
                  palette={palette}
                  interior={interior}
                  smooth={smooth}
                  title="Julia set for c"
                />
              </figure>
            </div>
            <p className="sr-only">MANDELBROT</p>
            <div className="cx-frac-aux">
              <figure>
                <figcaption>Orbit Diagram (starting at z<sub>0</sub> = 0)</figcaption>
                <svg className="cx-plane is-dark" viewBox="0 0 320 160" role="img" aria-label="Orbit of 0">
                  <rect width="320" height="160" fill="#07111f" rx="14" />
                  <line x1="28" y1="80" x2="300" y2="80" stroke="#334155" />
                  <line x1="160" y1="12" x2="160" y2="148" stroke="#334155" />
                  <text x="292" y="74" fill="#94a3b8" fontSize="11">Re</text>
                  <text x="166" y="20" fill="#94a3b8" fontSize="11">Im</text>
                  {pts.length > 1 ? (
                    <polyline fill="none" stroke="#38bdf8" strokeWidth="1.4" points={pts.map((p) => `${160 + p.x * 42},${80 - p.y * 42}`).join(" ")} />
                  ) : null}
                  {pts.map((p, i) => (
                    <circle key={i} cx={160 + p.x * 42} cy={80 - p.y * 42} r="4" fill={i === pts.length - 1 ? "#fbbf24" : "#38bdf8"} />
                  ))}
                </svg>
              </figure>
              <figure>
                <figcaption>Escape-Time Plot (iterations to escape)</figcaption>
                <svg className="cx-plane is-dark" viewBox="0 0 320 160" role="img" aria-label="Escape-time plot">
                  <rect width="320" height="160" fill="#07111f" rx="14" />
                  <line x1="28" y1="132" x2="300" y2="132" stroke="#334155" />
                  <polyline
                    fill="none"
                    stroke="#fbbf24"
                    strokeWidth="2"
                    points={pts.map((p, i) => `${28 + i * 16},${132 - Math.min(110, Math.hypot(p.x, p.y) * 40)}`).join(" ")}
                  />
                  {escapedAt >= 0 ? <text x="40" y="24" fill="#fde68a" fontSize="11">Escapes at n = {escapedAt}</text> : <text x="40" y="24" fill="#86efac" fontSize="11">Orbit stays bounded</text>}
                  <text x="28" y="148" fill="#64748b" fontSize="10">Iteration n</text>
                </svg>
              </figure>
              <div className="cx-frac-recurrence">
                <h3>Live Recurrence</h3>
                <p className="cx-eq">z<sub>n+1</sub> = z<sub>n</sub>² + c</p>
                {pts.slice(0, 8).map((p, i) => (
                  <p key={i} className="cx-meta">z<sub>{i}</sub> = {fmt(p.x, 5)} + {fmt(p.y, 5)}i</p>
                ))}
                <p className="cx-eq is-ans">z<sub>{pts.length - 1}</sub> = {fmtC(zn, 4)}</p>
              </div>
            </div>
          </section>
          <CxLive title="Live Values">
            <p className="cx-eq">Selected c</p>
            <p className="cx-eq is-ans">c = {fmtC(c, 3)}</p>
            <h3>Polar form</h3>
            <p>r = {fmt(modC(c), 4)}</p>
            <p>θ = {fmt(argC(c), 4)} rad = {fmt((argC(c) * 180) / Math.PI, 1)}°</p>
            <p className={cardioid || inside ? "cx-ok" : "cx-warn"}>
              {cardioid ? "Inside main cardioid" : inside ? `Inside ${bulb}` : "Outside main cardioid"} {inside ? "✓" : ""}
            </p>
            <p className="cx-note">{inside ? "The orbit remains bounded." : "The orbit of 0 escapes — Julia set is likely dust."}</p>
            <h3>Current iteration</h3>
            <p>z<sub>n</sub> = {fmtC(zn, 4)}</p>
            <p>|z<sub>n</sub>| = {fmt(modC(zn), 5)}</p>
            <h3>Orbit (first 8)</h3>
            <p className="cx-orbit-dots" aria-label="Orbit colors">
              {pts.slice(0, 8).map((_, i) => <i key={i} style={{ background: `hsl(${190 + i * 18} 90% 55%)` }} />)}
            </p>
            <p className="cx-meta">{inside ? "Bounded orbit (converging)" : "Escaping orbit"}</p>
            <h3>Quick Presets</h3>
            <div className="cx-presets">
              {PRESETS.map((item) => (
                <button key={item.name} type="button" className={cx === item.cx && cy === item.cy ? "active" : ""} onClick={() => { setCx(item.cx); setCy(item.cy); setJx(item.cx); setJy(item.cy); }}>
                  {item.label}
                </button>
              ))}
            </div>
            <button
              type="button"
              className="cx-random"
              onClick={() => {
                setCx(Number((-2 + Math.random() * 2.5).toFixed(3)));
                setCy(Number((-1.2 + Math.random() * 2.4).toFixed(3)));
              }}
            >
              Random c
            </button>
          </CxLive>
        </>
      )}
    </ComplexLabChrome>
  );
}
