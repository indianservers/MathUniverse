import {
  ArrowLeft,
  Minus,
  MoreVertical,
  Play,
  Plus,
  RefreshCcw,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./negative-numbers-modulo-n-mobile.css";
export default function N() {
  const nav = useNavigate(),
    [mod, setMod] = useState(9),
    [value, setValue] = useState(-4),
    [shown, setShown] = useState(4),
    [playing, setPlaying] = useState(false),
    [menu, setMenu] = useState(false),
    result = ((value % mod) + mod) % mod,
    c = 180,
    r = 118,
    pts = Array.from({ length: mod }, (_, i) => {
      const a = -Math.PI / 2 + (i * 2 * Math.PI) / mod;
      return { x: c + r * Math.cos(a), y: c + r * Math.sin(a) };
    });
  useEffect(() => {
    if (!playing) return;
    setShown(0);
    let s = 0,
      goal = Math.abs(value);
    const id = setInterval(() => {
      s++;
      setShown(s);
      if (s >= goal) {
        clearInterval(id);
        setPlaying(false);
      }
    }, 330);
    return () => clearInterval(id);
  }, [playing, value, mod]);
  const reset = () => {
    setMod(9);
    setValue(-4);
    setShown(4);
    setPlaying(false);
    setMenu(false);
  };
  return (
    <main className="negative-mod">
      <header>
        <button onClick={() => nav(-1)} aria-label="Back to visual proofs">
          <ArrowLeft />
        </button>
        <h1>Negative Numbers Modulo n</h1>
        <p>62 / 69</p>
        <button onClick={() => setMenu((v) => !v)} aria-label="Lesson options">
          <MoreVertical />
        </button>
      </header>
      <section>
        <div className="direction-labels">
          <span>−</span>
          <span>+</span>
        </div>
        <svg
          viewBox="0 0 360 390"
          role="group"
          aria-label={`${value} is congruent to ${result} modulo ${mod}`}
        >
          <circle cx={c} cy={c} r={r} className="neg-ring" />
          <path
            d={`M${c} ${c - r}A${r} ${r} 0 ${shown > mod / 2 ? 1 : 0} 0 ${pts[((-shown % mod) + mod) % mod].x} ${pts[((-shown % mod) + mod) % mod].y}`}
            className="negative-walk"
            markerEnd="url(#neg-arrow)"
          />
          <path
            d={`M${c} ${c - r}A${r} ${r} 0 0 1 ${pts[Math.min(3, mod - 1)].x} ${pts[Math.min(3, mod - 1)].y}`}
            className="positive-hint"
          />
          {pts.map((p, i) => (
            <g key={i}>
              <line x1={c} y1={c} x2={p.x} y2={p.y} className="neg-spoke" />
              <g
                role="button"
                tabIndex={0}
                onClick={() => {
                  const steps = (mod - i) % mod;
                  setValue(-steps);
                  setShown(steps);
                }}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    const steps = (mod - i) % mod;
                    setValue(-steps);
                    setShown(steps);
                  }
                }}
                aria-label={`Represent negative ${(mod - i) % mod}`}
              >
                <circle cx={p.x} cy={p.y} r="25" fill="transparent" />
                <circle
                  cx={p.x}
                  cy={p.y}
                  r={i === result ? 19 : 16}
                  className={i === result ? "neg-result" : "neg-node"}
                />
                <text x={p.x} y={p.y + 7}>{i}</text>
              </g>
            </g>
          ))}
          <circle cx={c} cy={c} r="7" className="hub" />
          <defs>
            <marker
              id="neg-arrow"
              markerWidth="7"
              markerHeight="7"
              refX="6"
              refY="3.5"
              orient="auto"
            >
              <path d="M0 0L7 3.5L0 7z" />
            </marker>
          </defs>
        </svg>
        <div className="negative-equation">
          <span>{value}</span> ≡ <strong>{result}</strong>{" "}
          <small>(mod {mod})</small>
        </div>
        <div className="signed-line">
          <i />
          <b>0</b>
          {Array.from({ length: mod }, (_, i) => (
            <span key={i}>{i}</span>
          ))}
        </div>
      </section>
      <button
        className="negative-play"
        onClick={() => setPlaying(true)}
        aria-label="Animate negative modular walk"
      >
        <Play />
      </button>
      {menu ? (
        <aside role="dialog">
          <button
            onClick={() => setMenu(false)}
            aria-label="Close lesson options"
          >
            <X />
          </button>
          <h2>Move counterclockwise</h2>
          <p>
            {value} means move {Math.abs(value)} steps backward from zero,
            landing at residue {result}.
          </p>
          <div>
            <button
              onClick={() => {
                setValue((v) => Math.min(-1, v + 1));
                setShown(Math.abs(Math.min(-1, value + 1)));
              }}
              aria-label="Decrease negative magnitude"
            >
              <Minus />
            </button>
            <strong>{value}</strong>
            <button
              onClick={() => {
                setValue((v) => Math.max(-(mod - 1), v - 1));
                setShown(Math.abs(Math.max(-(mod - 1), value - 1)));
              }}
              aria-label="Increase negative magnitude"
            >
              <Plus />
            </button>
          </div>
          <button
            onClick={() => {
              const n = mod === 9 ? 7 : mod === 7 ? 10 : 9;
              setMod(n);
              setValue((v) => -Math.min(n - 1, Math.abs(v)));
              setShown(Math.min(n - 1, Math.abs(value)));
            }}
            aria-label="Cycle negative modulus"
          >
            mod {mod}
          </button>
          <button onClick={reset} aria-label="Reset negative residue">
            <RefreshCcw /> Reset
          </button>
        </aside>
      ) : null}
    </main>
  );
}
