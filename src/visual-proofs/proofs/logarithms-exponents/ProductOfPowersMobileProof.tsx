import {
  ArrowLeft,
  Minus,
  MoreVertical,
  Plus,
  RefreshCcw,
  X,
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./product-of-powers-mobile.css";
const Block = ({ color }: { color: string }) => (
  <i style={{ background: color }}>x</i>
);
export default function P() {
  const nav = useNavigate(),
    [m, setM] = useState(3),
    [n, setN] = useState(2),
    [joined, setJoined] = useState(true),
    [menu, setMenu] = useState(false),
    reset = () => {
      setM(3);
      setN(2);
      setJoined(true);
      setMenu(false);
    };
  return (
    <main className="power-product">
      <header>
        <button onClick={() => nav(-1)} aria-label="Back to visual proofs">
          <ArrowLeft />
        </button>
        <h1>Product of Powers</h1>
        <p>64 / 69</p>
        <button onClick={() => setMenu((v) => !v)} aria-label="Lesson options">
          <MoreVertical />
        </button>
      </header>
      <section>
        <button
          className="power-law"
          onClick={() => setJoined((v) => !v)}
          aria-label="Join or separate factor stacks"
          aria-pressed={joined}
        >
          <span>
            x<sup>{m}</sup>
          </span>{" "}
          ·{" "}
          <em>
            x<sup>{n}</sup>
          </em>{" "}
          ={" "}
          <strong>
            x<sup>{m + n}</sup>
          </strong>
          <small>
            {m} + {n} = {m + n}
          </small>
        </button>
        <div className={joined ? "power-stacks joined" : "power-stacks"}>
          <div className="stack first">
            {Array.from({ length: m }, (_, i) => (
              <Block key={i} color="#0ba5c8" />
            ))}
            <b>{m}</b>
          </div>
          <span>·</span>
          <div className="stack second">
            {Array.from({ length: n }, (_, i) => (
              <Block key={i} color="#f27161" />
            ))}
            <b>{n}</b>
          </div>
          <button
            onClick={() => setJoined((v) => !v)}
            aria-label="Combine equal-base factors"
          >
            →
          </button>
          <div className="stack result">
            {Array.from({ length: m + n }, (_, i) => (
              <Block key={i} color="#5351a8" />
            ))}
            <b>{m + n}</b>
          </div>
        </div>
        <p className="power-caption">
          Multiplying joins the two lists of identical factors, so their counts
          add.
        </p>
      </section>
      {menu ? (
        <aside role="dialog">
          <button
            onClick={() => setMenu(false)}
            aria-label="Close lesson options"
          >
            <X />
          </button>
          <h2>Change the exponents</h2>
          <div>
            <button
              onClick={() => setM((v) => Math.max(1, v - 1))}
              aria-label="Decrease first exponent"
            >
              <Minus />
            </button>
            <strong>m = {m}</strong>
            <button
              onClick={() => setM((v) => Math.min(5, v + 1))}
              aria-label="Increase first exponent"
            >
              <Plus />
            </button>
            <button
              onClick={() => setN((v) => Math.max(1, v - 1))}
              aria-label="Decrease second exponent"
            >
              <Minus />
            </button>
            <strong>n = {n}</strong>
            <button
              onClick={() => setN((v) => Math.min(5, v + 1))}
              aria-label="Increase second exponent"
            >
              <Plus />
            </button>
          </div>
          <button onClick={reset} aria-label="Reset product of powers">
            <RefreshCcw /> Reset
          </button>
        </aside>
      ) : null}
    </main>
  );
}
