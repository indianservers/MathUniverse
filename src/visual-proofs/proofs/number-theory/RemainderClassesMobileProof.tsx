import { ArrowLeft, MoreVertical, RefreshCcw, X } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./remainder-classes-mobile.css";
const palette = [
  "#f35b55",
  "#efa91e",
  "#11b6c7",
  "#4675d9",
  "#8242d2",
  "#14a078",
];
export default function R() {
  const nav = useNavigate(),
    [mod, setMod] = useState(5),
    [selected, setSelected] = useState(7),
    [focus, setFocus] = useState<number | null>(2),
    [menu, setMenu] = useState(false),
    numbers = Array.from({ length: 21 }, (_, i) => i - 8),
    classes = Array.from({ length: mod }, (_, r) =>
      numbers.filter((n) => ((n % mod) + mod) % mod === r),
    ),
    res = ((selected % mod) + mod) % mod,
    reset = () => {
      setMod(5);
      setSelected(7);
      setFocus(2);
      setMenu(false);
    };
  return (
    <main className="remainder-classes">
      <header>
        <button onClick={() => nav(-1)} aria-label="Back to visual proofs">
          <ArrowLeft />
        </button>
        <h1>Remainder Classes</h1>
        <p>63 / 69</p>
        <button onClick={() => setMenu((v) => !v)} aria-label="Lesson options">
          <MoreVertical />
        </button>
      </header>
      <section>
        <button
          className="remainder-mod"
          onClick={() => {
            const n = mod === 5 ? 6 : mod === 6 ? 4 : 5;
            setMod(n);
            setFocus(null);
          }}
          aria-label={`Cycle modulus, currently ${mod}`}
        >
          mod {mod}
        </button>
        <div className="class-columns" style={{ "--class-count": mod } as React.CSSProperties}>
          {classes.map((values, r) => (
            <article
              key={r}
              className={focus === r ? "focused" : ""}
              style={{ "--class-color": palette[r] } as React.CSSProperties}
            >
              <button
                className="class-head"
                onClick={() => setFocus(focus === r ? null : r)}
                aria-label={`Highlight remainder class ${r}`}
                aria-pressed={focus === r}
              >
                {r}
              </button>
              <div>
                {values.map((n) => (
                  <button
                    key={n}
                    className={selected === n ? "selected" : ""}
                    onClick={() => {
                      setSelected(n);
                      setFocus(r);
                    }}
                    aria-label={`Select integer ${n}, remainder ${r}`}
                    style={{ top: `${((n + 8) / 20) * 100}%` }}
                  >
                    {n}
                  </button>
                ))}
              </div>
              <p>… {values.join(", ")} …</p>
            </article>
          ))}
        </div>
        <div className="class-equation">
          <span>{selected}</span> ≡ <strong>{res}</strong> (mod {mod})
        </div>
      </section>
      {menu ? (
        <aside role="dialog">
          <button
            onClick={() => setMenu(false)}
            aria-label="Close lesson options"
          >
            <X />
          </button>
          <h2>Same column, same remainder</h2>
          <p>
            Every pair in a column differs by a multiple of {mod}. Select a
            number or highlight a whole class.
          </p>
          <button onClick={reset} aria-label="Reset remainder classes">
            <RefreshCcw /> Reset
          </button>
        </aside>
      ) : null}
    </main>
  );
}
