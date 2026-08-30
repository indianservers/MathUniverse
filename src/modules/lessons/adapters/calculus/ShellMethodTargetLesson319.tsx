import {
  CheckCircle2,
  Eye,
  Hand,
  Lightbulb,
  RotateCcw,
  Share2,
  Target,
} from "lucide-react";
import {
  useEffect,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";
import type { LessonAdapterProps } from "../../types";
import "./ShellMethodTargetLesson319.css";

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));
const clean = (value: number, precision = 8) =>
  Number(value.toFixed(precision));
const heightAt = (x: number) => 4 - x;
const shellArea = (x: number) => 2 * Math.PI * x * heightAt(x);
const volumeTo = (x: number) => 2 * Math.PI * (2 * x * x - (x * x * x) / 3);
const totalVolume = volumeTo(4);

export default function ShellMethodTargetLesson319({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [x, setX] = useState(1.2),
    [dx, setDx] = useState(0.1),
    [tab, setTab] = useState("Interact"),
    [from, setFrom] = useState("0"),
    [to, setTo] = useState("3"),
    [result, setResult] = useState<"" | "correct" | "incorrect">(""),
    [solution, setSolution] = useState(false),
    [actions, setActions] = useState(0);
  const radius = x,
    height = heightAt(x),
    area = shellArea(x),
    differential = area * dx,
    accumulated = volumeTo(x),
    progress = (x / 4) * 100;
  const reset = () => {
    setX(1.2);
    setDx(0.1);
    setTab("Interact");
    setFrom("0");
    setTo("3");
    setResult("");
    setSolution(false);
    setActions(0);
  };
  useEffect(reset, [resetToken]);
  const act = (run: () => void) => {
    run();
    setActions((value) => value + 1);
    onInteraction();
  };
  const check = () =>
    act(() =>
      setResult(
        Math.abs(Number(from)) < 1e-9 && Math.abs(Number(to) - 3) < 1e-9
          ? "correct"
          : "incorrect",
      ),
    );
  return (
    <section
      className="sh319-page"
      data-testid="calculus-mockup-0398"
      data-dedicated-lesson="319"
      data-object-model="cylindrical-shell-radius-height-thickness-area-draggable-strip-volume-accumulation-bounds-practice"
      data-x={clean(x)}
      data-dx={clean(dx)}
      data-radius={clean(radius)}
      data-height={clean(height)}
      data-area={clean(area)}
      data-dv={clean(differential)}
      data-accumulated={clean(accumulated)}
      data-total={clean(totalVolume)}
      data-progress={clean(progress)}
      data-tab={tab}
      data-result={result}
      data-solution={solution}
      data-actions={actions}
    >
      <header className="sh319-hero">
        <div>
          <span>
            <b>CALCULUS</b>
            <b>INTEGRAL CALCULUS AND DIFFERENTIAL EQUATIONS</b>
          </span>
          <h1>Shell Method</h1>
          <p>Use cylindrical shells.</p>
          <div className="meta">
            <i>♙ Advanced</i>
            <i>ϟ Advanced Lab</i>
            <i>▣ Integral / ODE / CAS</i>
            <i>◷ 6-10 min</i>
          </div>
          <div className="actions">
            <select aria-label="Lesson language">
              <option>English (English)</option>
            </select>
            <button
              type="button"
              onClick={() => {
                reset();
                onInteraction();
              }}
            >
              <RotateCcw />
              Reset
            </button>
            <button
              type="button"
              onClick={() =>
                act(() => void navigator.clipboard?.writeText(location.href))
              }
            >
              <Share2 />
              Share
            </button>
            <button
              type="button"
              onClick={() =>
                act(() => document.documentElement.requestFullscreen?.())
              }
            >
              ↗ Workspace
            </button>
          </div>
        </div>
        <aside>
          <h3>The Rule (Shell Method)</h3>
          <p>
            A shell uses radius times height times thickness rather than washer
            radii.
          </p>
          <p>
            Use the highlighted points and labels; the symbolic overlay verifies
            the exact calculus rule.
          </p>
          <strong>
            V=∫<sub>a</sub>
            <sup>b</sup>2πr(x)h(x)dx
          </strong>
        </aside>
      </header>
      <nav className="sh319-tabs">
        {[
          ["Interact", "Build & visualize"],
          ["Explain", "Understand the idea"],
          ["Example", "See it solved"],
          ["Formula", "The rule"],
          ["Misconception", "What not to do"],
          ["Practice", "Try it yourself"],
        ].map(([name, sub]) => (
          <button
            type="button"
            key={name}
            className={tab === name ? "active" : ""}
            onClick={() => act(() => setTab(name))}
          >
            <b>{name}</b>
            <small>{sub}</small>
          </button>
        ))}
      </nav>
      <section className="sh319-flow">
        {[
          [
            Eye,
            "1 Observe",
            "A vertical strip at width dx forms a cylindrical shell.",
          ],
          [Hand, "Manipulate", "Adjust the bounds and linked controls."],
          [Lightbulb, "Notice", "Volume accumulates as shells add up."],
          [Target, "Understand", "Apply V=∫2πrh dx to compute volume."],
        ].map(([Icon, title, text], index) => (
          <article key={String(title)}>
            <Icon />
            <div>
              <h3>{String(title)}</h3>
              <p>{String(text)}</p>
            </div>
            {index < 3 && <b>→</b>}
          </article>
        ))}
      </section>
      <section className="sh319-model">
        <header>
          <h2>Work directly on the model</h2>
          <span>
            <CheckCircle2 />
            Everything looks correct!
          </span>
          <button
            type="button"
            aria-label="Restore shell model"
            onClick={() =>
              act(() => {
                setX(1.2);
                setDx(0.1);
              })
            }
          >
            ↻
          </button>
        </header>
        <main>
          <section>
            <h3>Revolved region and cylindrical shells</h3>
            <ShellGraph x={x} dx={dx} onX={(value) => act(() => setX(value))} />
          </section>
          <aside>
            <article>
              <h3>Region:</h3>
              <p>bounded by y=−x+4, x=0, y=0</p>
              <p>
                <b>x-interval:</b> 0≤x≤4
              </p>
            </article>
            <article>
              <h3>Linked controls</h3>
              <label>
                x <small>(shell position)</small>
                <input
                  aria-label="Shell position"
                  type="range"
                  min="0"
                  max="4"
                  step=".05"
                  value={x}
                  onChange={(event) =>
                    act(() => setX(Number(event.target.value)))
                  }
                />
                <output>{x.toFixed(2)}</output>
              </label>
              <label>
                dx <small>(thickness)</small>
                <input
                  aria-label="Shell thickness"
                  type="range"
                  min=".001"
                  max=".5"
                  step=".001"
                  value={dx}
                  onChange={(event) =>
                    act(() => setDx(Number(event.target.value)))
                  }
                />
                <output>{dx.toFixed(3)}</output>
              </label>
              <p>
                r(x)=x <span>{radius.toFixed(2)}</span>
              </p>
              <p>
                h(x)=−x+4 <span>{height.toFixed(2)}</span>
              </p>
              <p>
                <b>Shell area</b> A(x)=2πrh <span>{area.toFixed(3)}</span>
              </p>
            </article>
          </aside>
        </main>
        <section className="sh319-metrics">
          <article>
            <ShellIcon />
            <b>Radius</b>
            <span>r=x</span>
            <strong>{radius.toFixed(2)}</strong>
          </article>
          <article>
            <i>↕</i>
            <b>Height</b>
            <span>h=−x+4</span>
            <strong>{height.toFixed(2)}</strong>
          </article>
          <article>
            <i>↔</i>
            <b>Thickness</b>
            <span>dx</span>
            <strong>{dx.toFixed(3)}</strong>
          </article>
          <article>
            <ShellIcon />
            <b>Shell area</b>
            <span>A=2πrh</span>
            <strong>{area.toFixed(3)}</strong>
          </article>
        </section>
        <section className="sh319-accum">
          <div>
            <h3>Accumulation (sum of shells)</h3>
            <p>Volume up to x={x.toFixed(2)}</p>
            <p>V(x)=∫₀ˣ2πr(t)h(t)dt</p>
            <p>
              =∫₀<sup>{x.toFixed(2)}</sup>2πt(4−t)dt
            </p>
            <strong>= {accumulated.toFixed(3)} cubic units</strong>
          </div>
          <AccumulationSolid x={x} />
          <article>
            As x increases, more shells are added and the volume builds up to
            the full solid.
          </article>
        </section>
      </section>
      <section className="sh319-worked">
        <div>
          <h3>Worked Example (Complete Solution)</h3>
          <p>
            Find the volume obtained by revolving the region bounded by y=−x+4,
            x=0, and y=0 about the y-axis using the shell method.
          </p>
          <ol>
            <li>
              <b>Bounds:</b> 0≤x≤4
            </li>
            <li>
              <b>Radius:</b> r=x
            </li>
            <li>
              <b>Height:</b> h=−x+4
            </li>
            <li>
              <b>Apply the rule:</b> V=∫₀⁴2πx(4−x)dx
            </li>
          </ol>
          <strong>V=2π[2x²−x³/3]₀⁴ = 64π/3 cubic units</strong>
        </div>
        <aside>
          <b>Exact Volume</b>
          <strong>64π/3</strong>
          <span>cubic units</span>
          <hr />
          <b>≈ {totalVolume.toFixed(3)} cubic units</b>
        </aside>
      </section>
      <section className="sh319-warning">
        <div>⚠</div>
        <article>
          <h3>Misconception Warning</h3>
          <p>
            Do not use disk/washer radii here. This is the shell method, so
            radius is horizontal distance to the axis (r=x).
          </p>
          <p>
            Using vertical slices or washers perpendicular to the axis will set
            up the wrong model.
          </p>
        </article>
        <CompareMethods />
      </section>
      <section className="sh319-practice">
        <div>
          <h3>Practice Challenge</h3>
          <p>
            The region is bounded by y=−2x+6, x=0, and y=0. Revolve about the
            y-axis using the shell method.
          </p>
          <label>
            x from{" "}
            <input
              aria-label="Shell practice lower bound"
              value={from}
              onChange={(event) => {
                setFrom(event.target.value);
                setResult("");
              }}
            />{" "}
            to{" "}
            <input
              aria-label="Shell practice upper bound"
              value={to}
              onChange={(event) => {
                setTo(event.target.value);
                setResult("");
              }}
            />
          </label>
          <button type="button" onClick={check}>
            Check
          </button>
        </div>
        <span>
          Score <b>{result === "correct" ? "5 / 5" : "0 / 5"}</b>
        </span>
        <button
          type="button"
          onClick={() => act(() => setSolution((value) => !value))}
        >
          ◉ {solution ? "Hide" : "Show"} solution
        </button>
        <output className={result}>
          {result === "correct"
            ? "Correct bounds: [0,3]."
            : result === "incorrect"
              ? "Solve −2x+6=0 for the upper bound."
              : solution
                ? "V=∫₀³2πx(6−2x)dx=18π cubic units."
                : ""}
        </output>
      </section>
    </section>
  );
}

function ShellGraph({
  x,
  dx,
  onX,
}: {
  x: number;
  dx: number;
  onX: (x: number) => void;
}) {
  const w = 455,
    h = 385,
    p = 44,
    sx = (value: number) => p + (value / 5) * (w - 2 * p),
    sy = (value: number) => h - p - ((value + 1) / 6) * (h - 2 * p),
    path = `M${sx(0)},${sy(4)}L${sx(4)},${sy(0)}`,
    region = `M${sx(0)},${sy(0)}L${sx(0)},${sy(4)}L${sx(4)},${sy(0)}Z`,
    drag = (event: ReactPointerEvent<SVGCircleElement>) => {
      event.currentTarget.setPointerCapture(event.pointerId);
      const box = event.currentTarget.ownerSVGElement?.getBoundingClientRect();
      if (!box) return;
      const move = (pointer: PointerEvent) =>
        onX(clamp(((pointer.clientX - box.left) / box.width) * 5, 0, 4));
      const up = () => {
        window.removeEventListener("pointermove", move);
        window.removeEventListener("pointerup", up);
      };
      window.addEventListener("pointermove", move);
      window.addEventListener("pointerup", up);
    };
  const shellWidth = Math.max(4, sx(x + dx / 2) - sx(x - dx / 2));
  return (
    <svg className="sh319-graph" viewBox={`0 0 ${w} ${h}`}>
      <path d={region} className="region" />
      <line x1={p} x2={w - p} y1={sy(0)} y2={sy(0)} className="axis" />
      <line x1={sx(0)} x2={sx(0)} y1={p} y2={h - p} className="axis" />
      {[0, 1, 2, 3, 4].map((value) => (
        <g key={`x-${value}`} className="tick">
          <line
            x1={sx(value)}
            x2={sx(value)}
            y1={sy(0) - 3}
            y2={sy(0) + 3}
          />
          <text x={sx(value)} y={sy(0) + 17} textAnchor="middle">
            {value}
          </text>
        </g>
      ))}
      {[-1, 0, 2, 4].map((value) => (
        <g key={`y-${value}`} className="tick">
          <line
            x1={sx(0) - 3}
            x2={sx(0) + 3}
            y1={sy(value)}
            y2={sy(value)}
          />
          <text x={sx(0) - 9} y={sy(value) + 4} textAnchor="end">
            {value}
          </text>
        </g>
      ))}
      <text className="axis-label" x={w - p + 6} y={sy(0) + 4}>
        x
      </text>
      <text className="axis-label" x={sx(0) + 7} y={p - 7}>
        y
      </text>
      <path d={path} className="curve" />
      <rect
        x={sx(x) - shellWidth / 2}
        y={sy(heightAt(x))}
        width={shellWidth}
        height={sy(0) - sy(heightAt(x))}
        className="strip"
      />
      <ellipse
        cx={sx(x)}
        cy={sy(heightAt(x))}
        rx={14 + dx * 16}
        ry="5"
        className="shell-top"
      />
      <path
        d={`M${sx(x) - 14 - dx * 16},${sy(heightAt(x))}V${sy(-1)}M${sx(x) + 14 + dx * 16},${sy(heightAt(x))}V${sy(-1)}`}
        className="shell-side"
      />
      <ellipse
        cx={sx(x)}
        cy={sy(-1)}
        rx={14 + dx * 16}
        ry="5"
        className="shell-bottom"
      />
      <circle
        data-drag="shell-position"
        cx={sx(x)}
        cy={sy(0)}
        r="7"
        onPointerDown={drag}
      />
      <text x={sx(0.5)} y={sy(3.4)}>
        y=−x+4
      </text>
      <text x={sx(x)} y={sy(-1) - 11} textAnchor="middle">
        dx
      </text>
    </svg>
  );
}
function ShellIcon() {
  return (
    <svg viewBox="0 0 32 42">
      <ellipse cx="16" cy="7" rx="10" ry="4" />
      <path d="M6 7V34M26 7V34" />
      <ellipse cx="16" cy="34" rx="10" ry="4" />
    </svg>
  );
}
function AccumulationSolid({ x }: { x: number }) {
  const width = 30 + x * 45;
  return (
    <svg className="sh319-solid" viewBox="0 0 300 145">
      <path
        d={`M38 35C18 35 18 112 38 112H${38 + width}C${58 + width} 112 ${58 + width} 35 ${38 + width} 35Z`}
      />
      <ellipse cx={38 + width} cy="73" rx="12" ry="39" />
      <line className="solid-axis" x1="28" x2="28" y1="20" y2="122" />
      <line x1="30" x2="270" y1="115" y2="115" />
      <text className="solid-label" x="277" y="119">
        x
      </text>
      <text className="solid-label" x="32" y="18">
        y
      </text>
      <text x="32" y="130">
        0
      </text>
      <text x={38 + width} y="130">
        {x.toFixed(2)}
      </text>
    </svg>
  );
}
function CompareMethods() {
  return (
    <svg className="sh319-compare" viewBox="0 0 220 70">
      <g>
        <text x="30" y="9">
          ✕ Wrong (washer)
        </text>
        <path d="M18 52C30 20 70 20 82 52" />
        <line x1="18" x2="18" y1="18" y2="60" />
        <ellipse cx="72" cy="37" rx="8" ry="22" />
      </g>
      <g transform="translate(112 0)">
        <text x="20" y="9">
          ✓ Right (shell)
        </text>
        <path d="M18 52C30 20 70 20 82 52" />
        <line x1="18" x2="18" y1="18" y2="60" />
        <rect x="48" y="23" width="5" height="29" />
      </g>
    </svg>
  );
}
