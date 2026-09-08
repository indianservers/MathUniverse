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
import "./euclid-infinite-primes-mobile.css";
const primes = [2, 3, 5, 7, 11];
export default function E() {
  const nav = useNavigate(),
    [count, setCount] = useState(4),
    [step, setStep] = useState(3),
    [playing, setPlaying] = useState(false),
    [menu, setMenu] = useState(false),
    [checked, setChecked] = useState<number | null>(null),
    list = primes.slice(0, count),
    product = list.reduce((a, b) => a * b, 1),
    N = product + 1;
  useEffect(() => {
    if (!playing) return;
    setStep(0);
    let s = 0;
    const id = window.setInterval(() => {
      s++;
      setStep(s);
      if (s >= 3) {
        clearInterval(id);
        setPlaying(false);
      }
    }, 650);
    return () => clearInterval(id);
  }, [playing, count]);
  const reset = () => {
    setCount(4);
    setStep(3);
    setPlaying(false);
    setMenu(false);
    setChecked(null);
  };
  return (
    <main className="euclid-primes">
      <header>
        <button onClick={() => nav(-1)} aria-label="Back to visual proofs">
          <ArrowLeft />
        </button>
        <h1>Infinitely Many Primes</h1>
        <p>58 / 69</p>
        <button onClick={() => setMenu((v) => !v)} aria-label="Lesson options">
          <MoreVertical />
        </button>
      </header>
      <section>
        <div className="prime-inputs">
          {list.map((p, i) => (
            <button
              key={p}
              onClick={() => setCount(Math.max(2, i + 1))}
              aria-label={`Use primes through ${p}`}
            >
              <i>
                p<sub>{i + 1}</sub>
              </i>
              <span>{p}</span>
            </button>
          ))}
        </div>
        <div className="machine">
          <div className="wires" />
          <strong>×</strong>
          <button
            className="crank"
            onClick={() => setStep((s) => Math.min(3, s + 1))}
            aria-label="Turn multiplication crank"
          >
            ↻
          </button>
          <output className={step >= 1 ? "show" : ""}>
            {list.join(" × ")} = {product}
          </output>
        </div>
        <button
          className={`plus-one ${step >= 2 ? "show" : ""}`}
          onClick={() => setStep(2)}
          aria-label="Add one to the product"
        >
          +1
        </button>
        <div className={`new-number ${step >= 2 ? "show" : ""}`}>
          <b>N</b>
          <span>
            {product} + 1 = <strong>{N}</strong>
          </span>
        </div>
        <div className={`remainders ${step >= 3 ? "show" : ""}`}>
          {list.map((p, i) => (
            <button
              key={p}
              onClick={() => setChecked(p)}
              className={checked === p ? "checked" : ""}
              aria-label={`Check ${N} divided by ${p}`}
              aria-pressed={checked === p}
              style={{ "--row": i } as React.CSSProperties}
            >
              <span>
                {N} ÷ {p}
              </span>
              <b>=</b>
              <em>{checked === p ? "✓ remainder 1" : "remainder 1"}</em>
            </button>
          ))}
        </div>
        <div className={`new-prime ${step >= 3 ? "show" : ""}`}>
          <span>therefore a prime outside the list divides N</span>
          <b>
            p<sub>{count + 1}</sub>
          </b>
          <em>{N}</em>
        </div>
      </section>
      <button
        className="euclid-play"
        onClick={() => setPlaying(true)}
        aria-label="Animate Euclid proof"
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
          <h2>Assume the list is complete</h2>
          <p>
            N leaves remainder 1 when divided by every listed prime. So N
            itself, or one of its prime factors, is missing from the list.
          </p>
          <div>
            <button
              onClick={() => {
                setCount((c) => Math.max(2, c - 1));
                setStep(3);
              }}
              aria-label="Use fewer assumed primes"
            >
              <Minus />
            </button>
            <strong>{count} assumed primes</strong>
            <button
              onClick={() => {
                setCount((c) => Math.min(5, c + 1));
                setStep(3);
              }}
              aria-label="Use more assumed primes"
            >
              <Plus />
            </button>
          </div>
          <button onClick={reset}>
            <RefreshCcw /> Reset proof
          </button>
        </aside>
      ) : null}
    </main>
  );
}
