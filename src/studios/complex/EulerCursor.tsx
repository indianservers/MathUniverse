import { useRef, useState, type PointerEvent, type KeyboardEvent } from "react";
import { cursorAngle } from "./eulerCursorMath";
import "./eulerCursor.css";
type Config = {
  degrees: number;
  setDegrees: (n: number) => void;
  center?: [number, number];
  projectAngle?: (x: number, y: number) => number;
  terms?: number;
  setTerms?: (n: number) => void;
};
export function useEulerCursor(c: Config) {
  const [enabled, Enabled] = useState(true),
    [snap, Snap] = useState(0),
    [hover, Hover] = useState<number | null>(null),
    [dragging, Dragging] = useState(false),
    [previous, Previous] = useState<number | null>(null),
    [redo, Redo] = useState<number | null>(null),
    [status, Status] = useState("Click or drag the diagram to set the angle.");
  const gesture = useRef<number | null>(null),
    capture = useRef(false);
  const select = (value: number, remember = true) => {
    if (remember) {
      Previous(c.degrees);
      Redo(null);
    }
    c.setDegrees(Number(Math.max(0, Math.min(720, value)).toFixed(2)));
    Status(`Angle set to ${value.toFixed(1)} degrees.`);
  };
  const sample = (e: PointerEvent<SVGSVGElement>) => {
    const matrix = e.currentTarget.getScreenCTM();
    if (!matrix) return null;
    const point = new DOMPoint(e.clientX, e.clientY).matrixTransform(
      matrix.inverse(),
    );
    if (c.projectAngle) {
      const value = c.projectAngle(point.x, point.y);
      return snap ? Math.round(value / snap) * snap : value;
    }
    const [cx, cy] = c.center ?? [0, 0];
    if (Math.hypot(point.x - cx, point.y - cy) < 8) return null;
    return cursorAngle(point.x - cx, cy - point.y, c.degrees, snap);
  };
  const end = () => {
    capture.current = false;
    Dragging(false);
  };
  const bind = {
    tabIndex: 0,
    role: "slider",
    "aria-label": "Interactive Euler angle diagram",
    "aria-valuemin": 0,
    "aria-valuemax": 720,
    "aria-valuenow": c.degrees,
    "aria-valuetext": `${c.degrees.toFixed(1)} degrees`,
    "aria-describedby": "euler-cursor-help",
    "data-cursor-enabled": enabled,
    onPointerDown: (e: PointerEvent<SVGSVGElement>) => {
      if (!enabled || e.button !== 0) return;
      const value = sample(e);
      if (value === null) return;
      e.preventDefault();
      e.currentTarget.setPointerCapture(e.pointerId);
      gesture.current = c.degrees;
      Previous(c.degrees);
      Redo(null);
      capture.current = true;
      Dragging(true);
      select(value, false);
    },
    onPointerMove: (e: PointerEvent<SVGSVGElement>) => {
      const value = sample(e);
      Hover(value);
      if (enabled && capture.current && value !== null) select(value, false);
    },
    onPointerUp: (e: PointerEvent<SVGSVGElement>) => {
      if (e.currentTarget.hasPointerCapture(e.pointerId))
        e.currentTarget.releasePointerCapture(e.pointerId);
      end();
    },
    onPointerCancel: end,
    onPointerLeave: () => {
      if (!capture.current) Hover(null);
    },
    onDoubleClick: () => {
      if (enabled) select(0);
    },
    onKeyDown: (e: KeyboardEvent<SVGSVGElement>) => {
      if (!enabled) return;
      let value: number | undefined;
      const delta = e.shiftKey ? 1 : 5;
      if (e.key === "ArrowRight" || e.key === "ArrowUp")
        value = c.degrees + delta;
      if (e.key === "ArrowLeft" || e.key === "ArrowDown")
        value = c.degrees - delta;
      if (e.key === "Home") value = 0;
      if (e.key === "End") value = 360;
      if (e.key === "Escape" && capture.current && gesture.current !== null) {
        value = gesture.current;
        end();
      }
      if (value !== undefined) {
        e.preventDefault();
        select(Math.max(0, Math.min(720, value)));
      }
    },
  };
  const panel = (
    <section
      className={`ec-tools ${dragging ? "is-dragging" : ""}`}
      aria-label="Cursor exploration tools"
    >
      <header>
        <b>{dragging ? "Dragging angle" : "Cursor exploration"}</b>
        <output>
          {c.degrees.toFixed(1)}° · {((c.degrees * Math.PI) / 180).toFixed(3)}{" "}
          rad
        </output>
      </header>
      <p id="euler-cursor-help">
        Click or drag to rotate. Arrow keys: 5°. Shift + arrows: 1°. Home: 0°.
        End: 360°. Double-click: reset angle.
      </p>
      <div className="ec-controls">
        <label>
          <input
            type="checkbox"
            checked={enabled}
            onChange={(e) => {
              Enabled(e.target.checked);
              end();
            }}
          />{" "}
          Cursor interaction
        </label>
        <label>
          Angle snap
          <select
            aria-label="Cursor angle snap"
            value={snap}
            onChange={(e) => Snap(Number(e.target.value))}
          >
            <option value={0}>Free angle</option>
            <option value={15}>15°</option>
            <option value={30}>30°</option>
            <option value={45}>45°</option>
            <option value={90}>90°</option>
          </select>
        </label>
        <button
          disabled={previous === null}
          onClick={() => {
            if (previous !== null) {
              Redo(c.degrees);
              c.setDegrees(previous);
              Previous(null);
              Status("Previous angle restored.");
            }
          }}
        >
          Undo angle
        </button>
        <button
          disabled={redo === null}
          onClick={() => {
            if (redo !== null) {
              Previous(c.degrees);
              c.setDegrees(redo);
              Redo(null);
              Status("Angle reapplied.");
            }
          }}
        >
          Redo angle
        </button>
        <button onClick={() => select(c.degrees - 5)}>−5°</button>
        <button onClick={() => select(c.degrees + 5)}>+5°</button>
      </div>
      <div className="ec-landmarks" aria-label="Angle landmarks">
        {[0, 30, 45, 60, 90, 180, 270, 360].map((v) => (
          <button
            key={v}
            aria-pressed={Math.abs(c.degrees - v) < 0.01}
            onClick={() => select(v)}
          >
            {v}°
          </button>
        ))}
      </div>
      {c.setTerms && (
        <div className="ec-terms">
          <b>Taylor precision</b>
          <button
            disabled={(c.terms ?? 1) <= 1}
            onClick={() => c.setTerms?.(Math.max(1, (c.terms ?? 1) - 1))}
          >
            Remove term
          </button>
          <output>{c.terms} terms</output>
          <button
            disabled={(c.terms ?? 1) >= 50}
            onClick={() => c.setTerms?.(Math.min(50, (c.terms ?? 1) + 1))}
          >
            Add term
          </button>
          {[2, 5, 10, 20, 50].map((n) => (
            <button key={n} onClick={() => c.setTerms?.(n)}>
              {n}
            </button>
          ))}
        </div>
      )}
      <div className="ec-readouts">
        <span>
          cos θ <b>{Math.cos((c.degrees * Math.PI) / 180).toFixed(4)}</b>
        </span>
        <span>
          sin θ <b>{Math.sin((c.degrees * Math.PI) / 180).toFixed(4)}</b>
        </span>
        <span>
          Quadrant{" "}
          <b>
            {Math.abs(c.degrees % 90) < 0.01
              ? "axis"
              : Math.floor((c.degrees % 360) / 90) + 1}
          </b>
        </span>
        {hover !== null && (
          <span>
            Cursor <b>{hover.toFixed(1)}°</b>
          </span>
        )}
      </div>
      <p className="ec-status" role="status">
        {status}
      </p>
    </section>
  );
  return { bind, panel, hover, dragging };
}
