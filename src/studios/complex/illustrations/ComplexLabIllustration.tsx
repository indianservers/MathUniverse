import { createElement, useEffect, useId, useLayoutEffect, useMemo, useRef } from "react";
import { gsap } from "gsap";
import { complexIllustrationRegistry, type ComplexIllustrationKind } from "./scenes";
import { illustrationSlot, type Rect } from "./geometry";
import { createPainter } from "./renderer";
import { fractalTextures } from "./fractal";
import "./illustrations.css";

export default function ComplexLabIllustration({ kind }: { kind: string }) {
  const root = useRef<HTMLDivElement>(null), uid = useId().replace(/:/g, "");
  const key = kind as ComplexIllustrationKind, entry = complexIllustrationRegistry[key];
  const staticPhase = key === "rotation" ? .5 : key === "euler" ? .98 : .72;
  const initial = useMemo(() => entry?.scene(staticPhase) ?? [], [entry, staticPhase]);
  useLayoutEffect(() => {
    const el = root.current, card = el?.closest<HTMLElement>(".cxs-topic-card");
    if (!el || !card) return;
    let disposed = false;
    const measure = () => {
      const bounds = card.getBoundingClientRect(), obstacles: Rect[] = [];
      const walker = document.createTreeWalker(card, NodeFilter.SHOW_TEXT);
      let t: Node | null;
      while ((t = walker.nextNode())) {
        if (!t.textContent?.trim() || el.contains(t)) continue;
        const range = document.createRange(); range.selectNodeContents(t);
        for (const r of range.getClientRects()) obstacles.push({ x: r.x - bounds.x - 2, y: r.y - bounds.y - 2, width: r.width + 4, height: r.height + 4 });
      }
      card.querySelectorAll<HTMLElement>(".cxs-topic-tabs a,.cxs-topic-number").forEach(link => {
        const r = link.getBoundingClientRect(); obstacles.push({ x: r.x - bounds.x, y: r.y - bounds.y, width: r.width, height: r.height });
      });
      const slot = illustrationSlot(bounds.width, bounds.height, obstacles);
      el.style.left = `${slot.x}px`; el.style.top = `${slot.y}px`; el.style.width = `${slot.width}px`; el.style.height = `${slot.height}px`;
      el.dataset.fitted = "true";
    };
    measure();
    const observer = new ResizeObserver(measure); observer.observe(card);
    void document.fonts.ready.then(() => { if (!disposed) measure(); });
    return () => { disposed = true; observer.disconnect(); };
  }, []);
  useEffect(() => {
    const el = root.current, card = el?.closest(".cxs-topic-card");
    if (!el || !card || !entry) return;
    const canvas = el.querySelector("canvas")!, media = matchMedia("(prefers-reduced-motion: reduce)");
    let visible = false, attached = false, disposed = false, time = staticPhase * 12, hover = false, speed = 1;
    let paint: ReturnType<typeof createPainter>, textures: HTMLCanvasElement[] | undefined;
    const draw = (phase: number) => {
      paint ??= createPainter(canvas);
      if (paint) { paint(entry.scene(phase), phase, textures, key === "roots"); el.dataset.canvasReady = "true"; }
    };
    const tick = (_elapsed: number, delta: number) => {
      if (document.hidden || !visible) return;
      const dt = Math.min(50, delta) / 1000;
      speed += ((hover ? 1.3 : 1) - speed) * Math.min(1, dt * 4); time += dt * speed;
      draw((time % 12) / 12);
    };
    const sync = () => {
      if (attached) { gsap.ticker.remove(tick); attached = false; }
      el.dataset.animationState = media.matches ? "static" : visible && !document.hidden ? "running" : "paused";
      if (!visible) return;
      if (media.matches) {
        if (key === "fractals") draw(staticPhase); else delete el.dataset.canvasReady;
      } else if (!document.hidden) { draw((time % 12) / 12); gsap.ticker.add(tick); attached = true; }
      if (key === "fractals" && !textures) void fractalTextures().then(loaded => { if (disposed) return; textures = loaded; if (visible) draw(media.matches ? staticPhase : (time % 12) / 12); });
    };
    const observer = new IntersectionObserver(entries => { visible = entries.some(e => e.isIntersecting); sync(); }); observer.observe(el);
    const enter = () => { hover = true; el.dataset.hover = "true"; };
    const leave = () => { hover = false; el.dataset.hover = "false"; };
    card.addEventListener("pointerenter", enter); card.addEventListener("pointerleave", leave);
    card.addEventListener("focusin", enter); card.addEventListener("focusout", leave);
    media.addEventListener("change", sync); document.addEventListener("visibilitychange", sync);
    sync();
    return () => {
      disposed = true; if (attached) gsap.ticker.remove(tick); observer.disconnect();
      card.removeEventListener("pointerenter", enter); card.removeEventListener("pointerleave", leave); card.removeEventListener("focusin", enter); card.removeEventListener("focusout", leave);
      media.removeEventListener("change", sync); document.removeEventListener("visibilitychange", sync);
      canvas.width = 0; canvas.height = 0; delete el.dataset.canvasReady;
    };
  }, [entry, key, staticPhase]);
  if (!entry) return null;
  return <div ref={root} className="complex-card-illustration" data-complex-illustration={kind} data-animation-state="static" role="img" aria-label={entry.label}>
    <svg viewBox="0 0 200 180" aria-hidden="true"><defs><linearGradient id={`cxi-spectrum-${uid}`} x1="0" y1="0" x2="0" y2="1"><stop stopColor="#2eeaff"/><stop offset=".25" stopColor="#aa64ff"/><stop offset=".5" stopColor="#2eeaff"/><stop offset=".75" stopColor="#ae67ff"/><stop offset="1" stopColor="#2eeaff"/></linearGradient><filter id={`cxi-glow-${uid}`} x="-25%" y="-25%" width="150%" height="150%"><feGaussianBlur stdDeviation="1.3" result="blur" /><feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge></filter><marker id={`cxi-arrow-${uid}`} viewBox="0 0 8 8" markerWidth="4" markerHeight="4" refX="7" refY="4" orient="auto"><path d="M0 0 8 4 0 8Z" fill="context-stroke" /></marker></defs><g filter={`url(#cxi-glow-${uid})`}>{initial.map(m => createElement(m.tag, { key: m.key, ...m.attrs, stroke: m.attrs["data-spectrum"] ? `url(#cxi-spectrum-${uid})` : m.attrs.stroke, markerEnd: m.attrs["data-arrow"] ? `url(#cxi-arrow-${uid})` : undefined }, m.text))}</g></svg>
    <canvas aria-hidden="true" />
  </div>;
}
