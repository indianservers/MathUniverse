import { Check, RotateCcw, ShieldCheck, X } from "lucide-react";
import { useMemo, useState } from "react";
import type { SchoolSyllabusLesson } from "../syllabus/lessonSyllabusTypes";
import "./BinomialExpansionTargetLesson10134.css";

type View = "studio" | "triangle" | "table";
const choose = (n: number, r: number) => {
  let value = 1;
  for (let i = 1; i <= r; i += 1) value = (value * (n - i + 1)) / i;
  return Math.round(value);
};
const superscript = (value: number) =>
  String(value)
    .replace(/0/g, "⁰")
    .replace(/1/g, "¹")
    .replace(/2/g, "²")
    .replace(/3/g, "³")
    .replace(/4/g, "⁴")
    .replace(/5/g, "⁵")
    .replace(/6/g, "⁶")
    .replace(/7/g, "⁷")
    .replace(/8/g, "⁸");
const termLabel = (n: number, r: number, coefficient = choose(n, r)) => {
  const parts = [coefficient === 1 ? "" : String(coefficient)];
  if (n - r > 0) parts.push(`a${n - r === 1 ? "" : superscript(n - r)}`);
  if (r > 0) parts.push(`b${r === 1 ? "" : superscript(r)}`);
  return parts.join("") || "1";
};

export default function BinomialExpansionTargetLesson10134({
  lesson: _lesson,
}: {
  lesson: SchoolSyllabusLesson;
}) {
  const [n, setN] = useState(4);
  const [selectedR, setSelectedR] = useState(2);
  const [view, setView] = useState<View>("studio");
  const [inspector, setInspector] = useState(true);
  const [actions, setActions] = useState(0);
  const coefficients = useMemo(
    () => Array.from({ length: n + 1 }, (_, r) => choose(n, r)),
    [n],
  );
  const selectedCoefficient = coefficients[selectedR];
  const expansion = coefficients
    .map((coefficient, r) => termLabel(n, r, coefficient))
    .join(" + ");
  const act = () => setActions((value) => value + 1);
  const changeN = (value: number) => {
    setN(value);
    setSelectedR(Math.min(Math.floor(value / 2), value));
    act();
  };
  const reset = () => {
    setN(4);
    setSelectedR(2);
    setView("studio");
    setInspector(true);
    act();
  };

  return (
    <section
      className="be10134-page"
      data-testid="school-mockup-0808"
      data-object-model="dedicated-binomial-coefficient-term-engine"
      data-n={n}
      data-r={selectedR}
      data-coefficient={selectedCoefficient}
      data-power-a={n - selectedR}
      data-power-b={selectedR}
      data-term={termLabel(n, selectedR)}
      data-coefficient-sum={coefficients.reduce((sum, value) => sum + value, 0)}
      data-view={view}
      data-inspector={String(inspector)}
      data-actions={actions}
    >
      <header>
        <div>
          <small>Class 11 &nbsp;›&nbsp; Binomial Theorem</small>
          <h1>
            Binomial Expansion <span>Expansion Studio</span>
          </h1>
          <p>Explore (a+b)ⁿ using coefficients, terms, and geometric models.</p>
        </div>
        <button onClick={reset}>
          <RotateCcw /> Reset studio
        </button>
      </header>
      <main>
        <section className="be10134-studio">
          <h2>EXPANSION STUDIO FOR &nbsp; (a+b)ⁿ</h2>
          <div className="be10134-control">
            <label>
              Choose n{" "}
              <input
                aria-label="Binomial exponent n"
                type="range"
                min="0"
                max="8"
                value={n}
                onChange={(event) => changeN(Number(event.target.value))}
              />
              <output>{n}</output>
            </label>
            <aside>
              <h3>GENERAL EXPANSION</h3>
              <strong>(a+b)ⁿ = Σ C(n,r) aⁿ⁻ʳ bʳ</strong>
            </aside>
          </div>
          {view === "studio" && (
            <>
              <section className="be10134-row">
                <header>
                  <h3>PASCAL ROW (n = {n})</h3>
                  <span>C(n,r) = n! / r!(n-r)!</span>
                </header>
                <div>
                  <b>r</b>
                  {coefficients.map((_, r) => (
                    <button
                      key={r}
                      onClick={() => {
                        setSelectedR(r);
                        setInspector(true);
                        act();
                      }}
                      className={r === selectedR ? "active" : ""}
                    >
                      <small>{r}</small>
                      <strong>{coefficients[r]}</strong>
                    </button>
                  ))}
                </div>
              </section>
              <h2>EXPANSION FOR (a+b){superscript(n)}</h2>
              <div className="be10134-terms">
                {coefficients.map((coefficient, r) => (
                  <button
                    key={r}
                    className={`c${r % 5} ${r === selectedR ? "active" : ""}`}
                    onClick={() => {
                      setSelectedR(r);
                      setInspector(true);
                      act();
                    }}
                  >
                    <small>r = {r}</small>
                    <span>
                      {coefficient} · a{superscript(n - r)} b{superscript(r)}
                    </span>
                    <strong>= {termLabel(n, r, coefficient)}</strong>
                  </button>
                ))}
              </div>
              <p className="be10134-expansion">
                (a+b){superscript(n)} = {expansion}
              </p>
              <footer>
                <ShieldCheck />
                <b>VALIDATION</b>
                <span>Exponents sum to n for every term.</span>
                {coefficients.map((_, r) => (
                  <i key={r}>
                    {n - r} + {r} = {n} <Check />
                  </i>
                ))}
              </footer>
            </>
          )}
          {view === "triangle" && (
            <section className="be10134-triangle">
              <h2>PASCAL TRIANGLE</h2>
              {Array.from({ length: n + 1 }, (_, row) => (
                <div key={row}>
                  {Array.from({ length: row + 1 }, (__, r) => (
                    <button
                      key={r}
                      onClick={() => {
                        changeN(row);
                        setSelectedR(r);
                        setView("studio");
                      }}
                    >
                      {choose(row, r)}
                    </button>
                  ))}
                </div>
              ))}
            </section>
          )}
          {view === "table" && (
            <section className="be10134-table">
              <h2>COEFFICIENT TABLE</h2>
              <table>
                <thead>
                  <tr>
                    <th>n</th>
                    {Array.from({ length: 9 }, (_, r) => (
                      <th key={r}>r={r}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {Array.from({ length: 9 }, (_, row) => (
                    <tr key={row}>
                      <th>{row}</th>
                      {Array.from({ length: 9 }, (__, r) => (
                        <td key={r}>{r <= row ? choose(row, r) : "—"}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>
          )}
          <nav>
            <button
              className={view === "studio" ? "active" : ""}
              onClick={() => {
                setView("studio");
                act();
              }}
            >
              Expansion Studio
            </button>
            <button
              className={view === "triangle" ? "active" : ""}
              onClick={() => {
                setView("triangle");
                act();
              }}
            >
              Pascal Triangle
            </button>
            <button
              className={view === "table" ? "active" : ""}
              onClick={() => {
                setView("table");
                act();
              }}
            >
              Coefficient Table
            </button>
          </nav>
        </section>
        <aside className="be10134-side">
          {inspector ? (
            <section>
              <header>
                <h2>TERM INSPECTOR</h2>
                <button
                  aria-label="Close term inspector"
                  onClick={() => {
                    setInspector(false);
                    act();
                  }}
                >
                  <X />
                </button>
              </header>
              <p>
                Selected term: &nbsp; r = {selectedR}{" "}
                <strong>{termLabel(n, selectedR)}</strong>
              </p>
              <dl>
                <div>
                  <dt>Coefficient</dt>
                  <dd>
                    C({n},{selectedR}) = {selectedCoefficient}
                  </dd>
                </div>
                <div>
                  <dt>Power of a</dt>
                  <dd>
                    n-r = {n}-{selectedR} = {n - selectedR}
                  </dd>
                </div>
                <div>
                  <dt>Power of b</dt>
                  <dd>r = {selectedR}</dd>
                </div>
                <div>
                  <dt>Exponent check</dt>
                  <dd>
                    {n - selectedR}+{selectedR}={n} <Check />
                  </dd>
                </div>
              </dl>
              <footer>
                <b>Rule:</b> In the r-th term, a has power n-r and b has power
                r. The exponents sum to n.
              </footer>
            </section>
          ) : (
            <button
              className="be10134-open"
              onClick={() => {
                setInspector(true);
                act();
              }}
            >
              Open term inspector
            </button>
          )}
          <section>
            <h2>GEOMETRIC VIEW (Area Model)</h2>
            <p>n = {n}</p>
            <div className={`be10134-geometry n${n}`}>
              {coefficients.map((coefficient, r) => (
                <button
                  key={r}
                  className={`c${r % 5}`}
                  style={{ flexGrow: coefficient }}
                  onClick={() => {
                    setSelectedR(r);
                    setInspector(true);
                    act();
                  }}
                >
                  {termLabel(n, r, coefficient)}
                </button>
              ))}
            </div>
            <div className="be10134-key">
              {coefficients.map((coefficient, r) => (
                <span className={`c${r % 5}`} key={r}>
                  ■ {termLabel(n, r, coefficient)}
                </span>
              ))}
            </div>
            <strong>Total area = (a+b){superscript(n)}</strong>
          </section>
        </aside>
      </main>
    </section>
  );
}
