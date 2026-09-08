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
import "./modular-arithmetic-clock-mobile.css";
export default function M() {
  const nav = useNavigate(),
    [mod, setMod] = useState(7),
    [start, setStart] = useState(5),
    [add, setAdd] = useState(4),
    [shown, setShown] = useState(4),
    [playing, setPlaying] = useState(false),
    [menu, setMenu] = useState(false),
    result = (start + add) % mod,
    r = 135,
    c = 180,
    points = Array.from({ length: mod }, (_, i) => {
      const a = -Math.PI / 2 + (i * Math.PI * 2) / mod;
      return { x: c + r * Math.cos(a), y: c + r * Math.sin(a) };
    });
  useEffect(() => {
    if (!playing) return;
    setShown(0);
    let s = 0;
    const id = setInterval(() => {
      s++;
      setShown(s);
      if (s >= add) {
        clearInterval(id);
        setPlaying(false);
      }
    }, 420);
    return () => clearInterval(id);
  }, [playing, start, add, mod]);
  const reset = () => {
    setMod(7);
    setStart(5);
    setAdd(4);
    setShown(4);
    setPlaying(false);
    setMenu(false);
  };
  const changeMod = () => {
    const next = mod === 5 ? 7 : mod === 7 ? 8 : mod === 8 ? 12 : 5;
    setMod(next);
    setStart((v) => v % next);
    setShown(add);
  };
  return (
    <main className="mod-clock">
      <header>
        <button onClick={() => nav(-1)} aria-label="Back to visual proofs">
          <ArrowLeft />
        </button>
        <h1>Modular Arithmetic as a Clock</h1>
        <p>59 / 69</p>
        <button onClick={() => setMenu((v) => !v)} aria-label="Lesson options">
          <MoreVertical />
        </button>
      </header>
      <section>
        <button
          className="mod-label"
          onClick={changeMod}
          aria-label={`Change modulus, currently ${mod}`}
        >
          mod {mod}
        </button>
        <svg
          viewBox="0 0 360 380"
          role="group"
          aria-label={`${start} plus ${add} modulo ${mod} equals ${result}`}
        >
          <circle cx={c} cy={c} r={r} className="clock-ring" />
          {points.map((p, i) => (
            <g key={i}>
              <line x1={c} y1={c} x2={p.x} y2={p.y} className="spoke" />
              <g
                role="button"
                tabIndex={0}
                onClick={() => {
                  setStart(i);
                  setShown(add);
                }}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    setStart(i);
                    setShown(add);
                  }
                }}
                aria-label={`Start at residue ${i}`}
              >
                <circle
                  cx={p.x}
                  cy={p.y}
                  r={i === start || i === result ? 25 : 21}
                  className={
                    i === start ? "start" : i === result ? "result" : "node"
                  }
                />
                <text x={p.x} y={p.y + 7}>
                  {i}
                </text>
              </g>
            </g>
          ))}
          {Array.from({ length: Math.min(shown, add) }, (_, i) => {
            const from = points[(start + i) % mod],
              to = points[(start + i + 1) % mod],
              mx =
                c +
                (r + 12) *
                  Math.cos(
                    -Math.PI / 2 + ((start + i + 0.5) * Math.PI * 2) / mod,
                  ),
              my =
                c +
                (r + 12) *
                  Math.sin(
                    -Math.PI / 2 + ((start + i + 0.5) * Math.PI * 2) / mod,
                  );
            return (
              <path
                key={i}
                d={`M${from.x} ${from.y} Q${mx} ${my} ${to.x} ${to.y}`}
                className="step-arc"
                markerEnd="url(#arrow)"
              />
            );
          })}
          <defs>
            <marker
              id="arrow"
              markerWidth="6"
              markerHeight="6"
              refX="5"
              refY="3"
              orient="auto"
            >
              <path d="M0 0L6 3L0 6z" />
            </marker>
          </defs>
        </svg>
        <div className="mod-equation">
          <span>{start}</span> + <em>{add}</em> ≡ <strong>{result}</strong>
        </div>
        <button
          className="mod-dial"
          onClick={changeMod}
          aria-label={`Cycle modulus from ${mod}`}
        >
          <i />
          {mod}
        </button>
      </section>
      {menu ? (
        <aside role="dialog">
          <button
            onClick={() => setMenu(false)}
            aria-label="Close lesson options"
          >
            <X />
          </button>
          <h2>Walk around the clock</h2>
          <p>
            Each step adds 1. After residue {mod - 1}, the next step wraps to 0.
          </p>
          <div>
            <button
              onClick={() => {
                setAdd((v) => Math.max(1, v - 1));
                setShown(Math.max(1, add - 1));
              }}
              aria-label="Decrease addend"
            >
              <Minus />
            </button>
            <strong>add {add}</strong>
            <button
              onClick={() => {
                setAdd((v) => Math.min(mod + 3, v + 1));
                setShown(add + 1);
              }}
              aria-label="Increase addend"
            >
              <Plus />
            </button>
          </div>
          <button
            onClick={() => setPlaying(true)}
            aria-label="Animate modular walk"
          >
            <Play /> Animate
          </button>
          <button onClick={reset} aria-label="Reset modular clock">
            <RefreshCcw /> Reset
          </button>
        </aside>
      ) : null}
    </main>
  );
}
