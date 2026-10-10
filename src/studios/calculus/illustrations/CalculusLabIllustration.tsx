import { createElement, useEffect, useId, useMemo, useRef } from "react";
import { loadSettings } from "../../../pages/calculusStudioSession";
import { subscribeAnimation } from "./animation";
import { canvasPainter } from "./canvas";
import { illustrationRegistry, type IllustrationKind, type Mark } from "./scenes";
import "./illustrations.css";

const attributeName = (name: string) => name === "className" ? "class" : name.replace(/[A-Z]/g, c => `-${c.toLowerCase()}`);
function paint(marks: Mark[], nodes: Map<string, SVGElement>, previous: Map<string, Mark>) {
  marks.forEach(m => {
    const node = nodes.get(m.key);
    if (!node) return;
    const before = previous.get(m.key);
    Object.entries(m.attrs).forEach(([key, value]) => {
      if (before?.attrs[key] !== value) node.setAttribute(attributeName(key), String(value));
    });
    if (m.text !== before?.text) node.textContent = m.text ?? "";
    previous.set(m.key, m);
  });
}

/** Fixed-size illustration child; owns no navigation or card layout. */
export default function CalculusLabIllustration({ kind, reducedMotion, hover, theme, animated = true }: {
  kind: IllustrationKind;
  reducedMotion?: boolean;
  hover?: boolean;
  theme?: "light" | "dark" | "glow";
  animated?: boolean;
}) {
  const uid = useId().replace(/:/g, "");
  const id = `cli-${uid}`;
  const ref = useRef<SVGSVGElement>(null);
  const entry = illustrationRegistry[kind];
  const initial = useMemo(() => entry.scene(.86, id), [entry, id]);
  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const card = root.closest(".cs-topic-card") ?? root;
    const motionQuery = matchMedia("(prefers-reduced-motion: reduce)");
    const nodes = new Map([...root.querySelectorAll<SVGElement>("[data-mark]")].map(node => [node.dataset.mark!, node]));
    const previous = new Map(initial.map(m => [m.key, m]));
    let visible = false, over = hover ?? false, speed = 1, time = .86 * 9, lastPaint = -1;
    let drawCanvas: ReturnType<typeof canvasPainter> | undefined;
    let canvasTheme = "";
    const render = (marks: Mark[]) => {
      if (visible && animated && !isReduced()) {
        const dark = theme === "dark" || theme === "glow" || !!root.closest(".cs-dark");
        if (!drawCanvas || canvasTheme !== String(dark)) {
          drawCanvas = canvasPainter(root.querySelector("canvas")!, dark);
          canvasTheme = String(dark);
        }
        if (drawCanvas) { drawCanvas(marks); if (root.dataset.canvasReady !== "true") root.dataset.canvasReady = "true"; return; }
      }
      if (root.dataset.canvasReady === "true") delete root.dataset.canvasReady;
      paint(marks, nodes, previous);
    };
    let unsubscribe: (() => void) | undefined;
    const isReduced = () => motionQuery.matches || (reducedMotion ?? loadSettings().reducedMotion);
    const stop = () => { unsubscribe?.(); unsubscribe = undefined; };
    const update = () => {
      stop();
      const reduced = isReduced();
      root.dataset.animationState = reduced || !animated ? "static" : visible ? "running" : "paused";
      if (reduced || !animated) { render(entry.scene(.86, id)); return; }
      if (!visible) return;
      unsubscribe = subscribeAnimation((elapsed, delta) => {
        speed += ((over ? 1.35 : 1) - speed) * Math.min(1, delta * 4);
        time += delta * speed;
        // 3D thumbnails at 30 Hz; inexpensive 2D attributes at display cadence.
        if (entry.dimension === 3 && elapsed - lastPaint < 1 / 30) return;
        lastPaint = elapsed;
        render(entry.scene((time % 9) / 9, id));
      });
    };
    const observer = new IntersectionObserver(entries => {
      visible = entries.some(e => e.isIntersecting && e.intersectionRatio > 0);
      update();
    }, { threshold: 0 });
    observer.observe(root);
    const enter = () => { over = hover ?? true; root.dataset.hover = "true"; };
    const leave = () => { over = hover ?? false; root.dataset.hover = "false"; };
    const settingsChange = () => update();
    card.addEventListener("pointerenter", enter);
    card.addEventListener("pointerleave", leave);
    card.addEventListener("focusin", enter);
    card.addEventListener("focusout", leave);
    motionQuery.addEventListener("change", settingsChange);
    window.addEventListener("storage", settingsChange);
    window.addEventListener("calculus-studio-settings", settingsChange);
    update();
    return () => {
      stop(); observer.disconnect();
      card.removeEventListener("pointerenter", enter); card.removeEventListener("pointerleave", leave);
      card.removeEventListener("focusin", enter); card.removeEventListener("focusout", leave);
      motionQuery.removeEventListener("change", settingsChange);
      window.removeEventListener("storage", settingsChange); window.removeEventListener("calculus-studio-settings", settingsChange);
      const canvas = root.querySelector("canvas");
      if (canvas) { canvas.width = 0; canvas.height = 0; delete root.dataset.canvasReady; }
    };
  }, [entry, initial, id, animated, reducedMotion, hover, theme]);
  return (
    <svg ref={ref} className="cs-mini-preview calculus-lab-illustration" viewBox="0 0 180 78" role="img" aria-label={entry.label}
      data-illustration={kind} data-dimension={entry.dimension} data-theme={theme} data-animation-state="static" focusable="false">
      <title>{entry.label}</title>
      <defs>
        <linearGradient id={`${id}-curve`} gradientUnits="userSpaceOnUse" x1="18" y1="16" x2="160" y2="65">
          <stop stopColor="#00d6ee" /><stop offset=".5" stopColor="#248aff" /><stop offset="1" stopColor="#a43dff" />
        </linearGradient>
        <linearGradient id={`${id}-area`} x1="0" y1="0" x2=".7" y2="1">
          <stop stopColor="#03d2ee" stopOpacity=".75" /><stop offset=".6" stopColor="#328cff" stopOpacity=".48" /><stop offset="1" stopColor="#a150ff" stopOpacity=".18" />
        </linearGradient>
        <radialGradient id={`${id}-ball`} cx=".28" cy=".24" r=".78">
          <stop stopColor="#e4ffff" /><stop offset=".28" stopColor="#04d4ff" /><stop offset=".75" stopColor="#1878ff" /><stop offset="1" stopColor="#6539ec" />
        </radialGradient>
        <radialGradient id={`${id}-sun`} cx=".28" cy=".23" r=".78">
          <stop stopColor="#fff7c3" /><stop offset=".3" stopColor="#ffc044" /><stop offset="1" stopColor="#f87b12" />
        </radialGradient>
        <marker id={`${id}-arrow`} viewBox="0 0 5 5" markerWidth="3.5" markerHeight="3.5" refX="4.4" refY="2.5" orient="auto-start-reverse">
          <path d="M0 0 5 2.5 0 5Z" fill="context-stroke" />
        </marker>
      </defs>
      <g className="cli-scene">{initial.map(m => createElement(m.tag, { key: m.key, "data-mark": m.key, ...m.attrs }, m.text))}</g>
      <foreignObject className="cli-canvas" x="0" y="0" width="180" height="78"><canvas aria-hidden="true" /></foreignObject>
    </svg>
  );
}
