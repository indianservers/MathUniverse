import { useEffect, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import {
  Download, Bookmark, Grid3X3, HelpCircle, Moon, Play, Redo2, RotateCcw, Settings, Share2, Sun,
} from "lucide-react";
import type { StudioMockupPage } from "../mockup/studioMockupCatalog";
import { clamp, fmt } from "../mockup/studioLabKit";

export function Card({ title, kicker, children, className = "" }: { title?: string; kicker?: string; children: ReactNode; className?: string }) {
  return (
    <section className={`la-card ${className}`}>
      {kicker ? <div className="la-kicker">{kicker}</div> : null}
      {title ? <h2>{title}</h2> : null}
      {children}
    </section>
  );
}

export function Switch({ label, on, onChange }: { label: string; on: boolean; onChange: (v: boolean) => void }) {
  return (
    <button type="button" className={`la-switch${on ? " is-on" : ""}`} aria-pressed={on} onClick={() => onChange(!on)}>
      <span>{label}</span>
      <i />
    </button>
  );
}

export function SliderRow({
  label, value, min, max, step = 0.01, onChange, digits = 2,
}: {
  label: string; value: number; min: number; max: number; step?: number; onChange: (n: number) => void; digits?: number;
}) {
  return (
    <label className="la-slider">
      <span>{label}</span>
      <input type="range" min={min} max={max} step={step} value={value} aria-label={label} onChange={(event) => onChange(Number(event.target.value))} />
      <output>{fmt(value, digits)}</output>
    </label>
  );
}

export function BracketMatrix({ matrix }: { matrix: number[][] }) {
  return (
    <div className="la-brackets" aria-hidden="true">
      <b />
      <table>
        <tbody>
          {matrix.map((row, r) => (
            <tr key={r}>{row.map((cell, c) => <td key={c}>{fmt(cell, 2)}</td>)}</tr>
          ))}
        </tbody>
      </table>
      <b />
    </div>
  );
}

export function LinearLabHeader({
  page, onReset, onAnimate, speed = "1.0x", onSpeed,
}: {
  page: StudioMockupPage;
  onReset?: () => void;
  onAnimate?: () => void;
  speed?: string;
  onSpeed?: (s: string) => void;
}) {
  const [host, setHost] = useState<HTMLElement | null>(null);
  useEffect(() => { setHost(document.getElementById("msk-lab-tools")); }, []);
  const id = page.id;
  const chip = (label: string, icon: ReactNode, onClick?: () => void, className = "la-tool") => (
    <button type="button" className={className} onClick={onClick}>{icon}<span>{label}</span></button>
  );
  let tools: ReactNode = null;
  if (id === "eigenvectors") {
    tools = (
      <>
        {chip("Reset", <RotateCcw />, onReset)}
        {chip("Animate", <Play />, onAnimate)}
        <label className="la-tool">
          <select aria-label="Speed" value={speed} onChange={(event) => onSpeed?.(event.target.value)}>
            <option>0.5x</option>
            <option>1.0x</option>
            <option>2.0x</option>
          </select>
        </label>
        <button type="button" className="la-tool" aria-label="Settings"><Settings /></button>
        <button type="button" className="la-tool" aria-label="Help"><HelpCircle /></button>
      </>
    );
  } else if (id === "linear-transforms") {
    tools = (
      <>
        <button type="button" className="la-tool" aria-label="Help"><HelpCircle /></button>
        {chip("Share", <Share2 />)}
        {chip("Reset", <RotateCcw />, onReset)}
        <button type="button" className="la-tool" aria-label="Light"><Sun /></button>
        <button type="button" className="la-tool" aria-label="Dark"><Moon /></button>
      </>
    );
  } else if (id === "vectors") {
    tools = (
      <>
        {chip("Help", <HelpCircle />)}
        {chip("Saved", <Bookmark />)}
        {chip("Share", <Share2 />, undefined, "la-tool is-share")}
        <button type="button" className="la-tool" aria-label="Light"><Sun /></button>
        <button type="button" className="la-tool" aria-label="Dark"><Moon /></button>
      </>
    );
  } else if (id === "least-squares") {
    tools = (
      <>
        {chip("Help", <HelpCircle />)}
        {chip("Settings", <Settings />)}
        {chip("Reset", <RotateCcw />, onReset)}
        <button type="button" className="la-tool" aria-label="Theme"><Moon /></button>
      </>
    );
  } else if (id === "vector-spaces") {
    tools = (
      <>
        {chip("Share", <Share2 />)}
        {chip("PNG", <Download />)}
        {chip("3D", <Grid3X3 />)}
        <span className="la-tool">Teacher mode</span>
        <button type="button" className="la-tool" aria-label="Help"><HelpCircle /></button>
      </>
    );
  } else {
    tools = (
      <>
        {id === "row-reduction" ? <span className="la-tool">Quick start</span> : null}
        <span className="la-stat-chip">0</span>
        <span className="la-stat-chip">0 XP</span>
        <span className="la-tool">Teacher mode</span>
        {id === "playground" || id === "orthogonality" ? <button type="button" className="la-tool" aria-label="Grid"><Grid3X3 /></button> : null}
        <button type="button" className="la-tool" aria-label="Settings"><Settings /></button>
        {id === "determinants" || id === "row-reduction" || id === "playground" ? <button type="button" className="la-tool" aria-label="Theme"><Moon /></button> : <button type="button" className="la-tool" aria-label="Help"><HelpCircle /></button>}
      </>
    );
  }
  if (!host) return <div className="la-inline-tools">{tools}</div>;
  return createPortal(tools, host);
}

export function clamp01(n: number) {
  return clamp(n, 0, 1);
}

export function RedoIcon() {
  return <Redo2 />;
}
