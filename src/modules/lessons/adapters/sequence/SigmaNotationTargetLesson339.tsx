import { Copy, Pause, Play, RotateCcw, Share2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";
import type { LessonAdapterProps } from "../../types";
import "./SigmaNotationTargetLesson339.css";

type Coeff = {
  ii: number;
  jj: number;
  ij: number;
  i: number;
  j: number;
  c: number;
};
const clean = (v: number) => Number(v.toFixed(8));
function parse(source: string): Coeff | null {
  const text = source
    .toLowerCase()
    .replaceAll(" ", "")
    .replaceAll("²", "^2")
    .replaceAll("*", "")
    .replace(/−/g, "-")
    .replace(/(?<!^)-/g, "+-");
  if (!text || /[^0-9ij+\-.^]/.test(text)) return null;
  const out = { ii: 0, jj: 0, ij: 0, i: 0, j: 0, c: 0 };
  for (const raw of text.split("+").filter(Boolean)) {
    const term = raw;
    if (term.includes("i^2")) {
      const p = term.replace("i^2", "");
      out.ii += p === "" ? 1 : p === "-" ? -1 : Number(p);
    } else if (term.includes("j^2")) {
      const p = term.replace("j^2", "");
      out.jj += p === "" ? 1 : p === "-" ? -1 : Number(p);
    } else if (term.includes("ij")) {
      const p = term.replace("ij", "");
      out.ij += p === "" ? 1 : p === "-" ? -1 : Number(p);
    } else if (term.includes("i")) {
      const p = term.replace("i", "");
      out.i += p === "" ? 1 : p === "-" ? -1 : Number(p);
    } else if (term.includes("j")) {
      const p = term.replace("j", "");
      out.j += p === "" ? 1 : p === "-" ? -1 : Number(p);
    } else out.c += Number(term);
    if (Object.values(out).some((v) => !Number.isFinite(v))) return null;
  }
  return out;
}
const evaluate = (p: Coeff, i: number, j = 0) =>
  p.ii * i * i + p.jj * j * j + p.ij * i * j + p.i * i + p.j * j + p.c;
const tabs = [
  "Interaction + Visualisation",
  "Explain",
  "Examples",
  "Formulas",
  "Know more",
];
export default function SigmaNotationTargetLesson339({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [lower, setLower] = useState(1),
    [upper, setUpper] = useState(8),
    [source, setSource] = useState("i² + 1"),
    [coeff, setCoeff] = useState<Coeff>({
      ii: 1,
      jj: 0,
      ij: 0,
      i: 0,
      j: 0,
      c: 1,
    }),
    [nested, setNested] = useState(false),
    [current, setCurrent] = useState(5),
    [playing, setPlaying] = useState(false),
    [stepwise, setStepwise] = useState(true),
    [tab, setTab] = useState(tabs[0]),
    [answer, setAnswer] = useState(""),
    [result, setResult] = useState<"" | "correct" | "incorrect">(""),
    [copied, setCopied] = useState(false),
    [actions, setActions] = useState(0);
  const indexes = useMemo(
      () =>
        Array.from(
          { length: Math.max(0, upper - lower + 1) },
          (_, k) => lower + k,
        ),
      [lower, upper],
    ),
    terms = useMemo(
      () =>
        indexes.map((i) =>
          nested
            ? Array.from({ length: i }, (_, k) =>
                evaluate(coeff, i, k + 1),
              ).reduce((a, b) => a + b, 0)
            : evaluate(coeff, i),
        ),
      [indexes, nested, coeff],
    ),
    partials = terms.reduce<number[]>(
      (a, v) => [...a, v + (a.at(-1) ?? 0)],
      [],
    ),
    total = partials.at(-1) ?? 0;
  const reset = () => {
    setLower(1);
    setUpper(8);
    setSource("i² + 1");
    setCoeff({ ii: 1, jj: 0, ij: 0, i: 0, j: 0, c: 1 });
    setNested(false);
    setCurrent(5);
    setPlaying(false);
    setStepwise(true);
    setTab(tabs[0]);
    setAnswer("");
    setResult("");
    setCopied(false);
    setActions(0);
  };
  useEffect(reset, [resetToken]);
  useEffect(() => {
    if (!playing) return;
    const timer = window.setInterval(
      () => setCurrent((v) => (v >= upper ? lower : v + 1)),
      stepwise ? 700 : 260,
    );
    return () => window.clearInterval(timer);
  }, [playing, stepwise, lower, upper]);
  const act = (run: () => void) => {
    run();
    setActions((v) => v + 1);
    onInteraction();
  };
  const changeBound = (which: "lower" | "upper", value: number) =>
    act(() => {
      if (which === "lower") {
        const v = Math.min(Math.round(value), upper);
        setLower(v);
        setCurrent(v);
      } else {
        const v = Math.max(Math.round(value), lower);
        setUpper(v);
        setCurrent((c) => Math.min(c, v));
      }
      setResult("");
    });
  const updateSource = (v: string) => {
    setSource(v);
    const p = parse(v);
    if (p) act(() => setCoeff(p));
    setResult("");
  };
  const setPreset = (v: string) => {
    const p = parse(v);
    if (p)
      act(() => {
        setSource(v);
        setCoeff(p);
        setResult("");
      });
  };
  const dragPoint = (i: number, event: ReactPointerEvent<SVGCircleElement>) => {
    if (event.buttons !== 1) return;
    act(() => setCurrent(i));
  };
  const copy = () =>
    act(() => {
      navigator.clipboard?.writeText(
        `sum(i=${lower}..${upper}) ${source} = ${total}`,
      );
      setCopied(true);
    });
  const max = Math.max(...terms.map(Math.abs), 1),
    graphY = (v: number) => 170 - (v / max) * 135;
  return (
    <section
      className="seq339-page"
      data-testid="sequence-mockup-0524"
      data-object-model="polynomial-summand-parser-editable-bounds-presets-finite-nested-sum-term-expansion-partial-accumulator-animation-draggable-index-stem-index-substitution-copy-practice"
      data-lower={lower}
      data-upper={upper}
      data-source={source}
      data-nested={nested}
      data-current={current}
      data-playing={playing}
      data-stepwise={stepwise}
      data-terms={terms.map(clean).join(",")}
      data-partials={partials.map(clean).join(",")}
      data-total={clean(total)}
      data-tab={tab}
      data-result={result}
      data-copied={copied}
      data-actions={actions}
    >
      <header className="seq339-hero">
        <span>
          <b>ADVANCED MATHEMATICS</b>
          <b>SEQUENCES AND SERIES</b>
        </span>
        <h1>Sigma Notation</h1>
        <p>Understand compact summation.</p>
        <div>
          {[
            "Intermediate-Advanced",
            "Exploration Lab",
            "Sequence / CAS",
            "6-10 min",
          ].map((x) => (
            <b key={x}>{x}</b>
          ))}
        </div>
        <nav>
          <button>English (English)</button>
          <button onClick={() => act(reset)}>
            <RotateCcw />
            Reset lab
          </button>
          <button
            onClick={() =>
              act(() => navigator.clipboard?.writeText(location.href))
            }
          >
            <Share2 />
            Share
          </button>
          <button onClick={() => act(() => setTab(tabs[0]))}>Workspace</button>
        </nav>
      </header>
      <nav className="seq339-tabs">
        {tabs.map((name) => (
          <button
            key={name}
            className={tab === name ? "active" : ""}
            onClick={() => act(() => setTab(name))}
          >
            {name}
          </button>
        ))}
      </nav>
      <section className="seq339-lab">
        <header>
          <div>
            <b>SIGMA LAB</b>
            <p>Build, visualize and understand sigma notation.</p>
          </div>
          <button
            onClick={() =>
              act(() => {
                setPlaying(true);
                setCurrent(lower);
              })
            }
          >
            Animate terms
          </button>
          <label>
            Step by step{" "}
            <input
              aria-label="Sigma step by step"
              type="checkbox"
              checked={stepwise}
              onChange={(e) => act(() => setStepwise(e.target.checked))}
            />
          </label>
        </header>
        <main>
          <aside>
            <h2>1. Build your summation</h2>
            <label>
              Lower bound (i =)
              <span>
                <input
                  aria-label="Sigma lower bound"
                  type="number"
                  value={lower}
                  onChange={(e) => changeBound("lower", Number(e.target.value))}
                />
                <button onClick={() => changeBound("lower", lower - 1)}>
                  −
                </button>
                <button onClick={() => changeBound("lower", lower + 1)}>
                  +
                </button>
              </span>
            </label>
            <label>
              Upper bound
              <span>
                <input
                  aria-label="Sigma upper bound"
                  type="number"
                  value={upper}
                  onChange={(e) => changeBound("upper", Number(e.target.value))}
                />
                <button onClick={() => changeBound("upper", upper - 1)}>
                  −
                </button>
                <button onClick={() => changeBound("upper", upper + 1)}>
                  +
                </button>
              </span>
            </label>
            <label>
              Summand (aᵢ)
              <input
                aria-label="Sigma summand"
                value={source}
                onChange={(e) => updateSource(e.target.value)}
              />
            </label>
            <div className="presets">
              {["i", "i²", "2i", "i+1", "1"].map((x) => (
                <button key={x} onClick={() => setPreset(x)}>
                  {x}
                </button>
              ))}
            </div>
            <label className="nested">
              Nested sum (j=1..i)
              <input
                aria-label="Sigma nested sum"
                type="checkbox"
                checked={nested}
                onChange={(e) => act(() => setNested(e.target.checked))}
              />
            </label>
          </aside>
          <section className="sigma-stage">
            <div className="expression">
              <small>Your sigma expression</small>
              <strong>
                <span>{upper}</span>Σ<sub>i={lower}</sub> ({source})
              </strong>
            </div>
            <div className="animation">
              <header>
                <b>Term expansion (animation)</b>
                <span>
                  {playing ? "Playing..." : "Paused"}
                  <button
                    title={playing ? "Pause" : "Play"}
                    onClick={() => act(() => setPlaying((v) => !v))}
                  >
                    {playing ? <Pause /> : <Play />}
                  </button>
                </span>
              </header>
              <output>i = {current}</output>
              <h3>
                Current term: a<sub>{current}</sub> ={" "}
                {terms[indexes.indexOf(current)] ?? "—"}
              </h3>
              <div>
                {indexes.map((i, k) => (
                  <b key={i} className={i <= current ? "done" : ""}>
                    a{i}={clean(terms[k])}
                  </b>
                ))}
              </div>
              <footer>
                {partials.map((v, k) => (
                  <b key={k}>{clean(v)}</b>
                ))}
                <strong>Total = {clean(total)}</strong>
              </footer>
            </div>
          </section>
        </main>
        <section className="seq339-pair">
          <article>
            <h2>Table of terms</h2>
            <table>
              <thead>
                <tr>
                  <th>i</th>
                  <th>aᵢ = {source}</th>
                  <th>Partial Sum Sᵢ</th>
                </tr>
              </thead>
              <tbody>
                {indexes.map((i, k) => (
                  <tr key={i} className={i === current ? "active" : ""}>
                    <td>{i}</td>
                    <td>{clean(terms[k])}</td>
                    <td>{clean(partials[k])}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </article>
          <article className="sigma-graph">
            <h2>Graph of summand aᵢ</h2>
            <svg viewBox="0 0 330 210">
              <line x1="30" y1="175" x2="315" y2="175" className="axis" />
              {indexes.map((i, k) => {
                const x = 45 + k * 32,
                  y = graphY(terms[k]);
                return (
                  <g key={i}>
                    <line x1={x} y1="175" x2={x} y2={y} />
                    <circle
                      data-drag={`sigma-point-${i}`}
                      cx={x}
                      cy={y}
                      r="6"
                      onPointerDown={(e) =>
                        e.currentTarget.setPointerCapture(e.pointerId)
                      }
                      onPointerMove={(e) => dragPoint(i, e)}
                    />
                    <text x={x} y="194">
                      {i}
                    </text>
                  </g>
                );
              })}
            </svg>
            <output>
              Growth:{" "}
              {coeff.ii !== 0
                ? "Quadratic (∝ i²)"
                : coeff.i !== 0
                  ? "Linear (∝ i)"
                  : "Constant"}
            </output>
          </article>
        </section>
        <section className="substitution">
          <article>
            <h2>Index substitution (change variable)</h2>
            <p>
              Let j = i − {lower} ⟹ i = j + {lower}
            </p>
            <p>
              When i={lower}, j=0 &nbsp; When i={upper}, j={upper - lower}
            </p>
          </article>
          <article>
            <h2>Equivalent sigma form</h2>
            <strong>
              Σ j=0..{upper - lower} [{source.replaceAll("i", `(j+${lower})`)}]
            </strong>
            <button onClick={copy}>
              <Copy />
              {copied ? "Copied" : "Copy"}
            </button>
          </article>
        </section>
      </section>
      <section className="seq339-learning">
        <article>
          <h2>Learning objective</h2>
          <p>
            Use sigma notation to represent finite sums compactly and understand
            how bounds and summands affect the value.
          </p>
        </article>
        <article>
          <h2>Key insight</h2>
          <p>
            The index moves from the lower bound to the upper bound, and the
            accumulator adds each term.
          </p>
        </article>
        <article>
          <h2>Guided explanation</h2>
          <p>
            1. Define the summand.
            <br />
            2. Run the index through every integer bound.
            <br />
            3. Add each current term to the partial sum.
            <br />
            4. The final partial sum is the sigma value.
          </p>
        </article>
        <article>
          <h2>Common misconception</h2>
          <p>
            Off-by-one errors change the number of terms. Both lower and upper
            bounds are included.
          </p>
        </article>
        <article className="constraints">
          <h2>Assumptions & constraints</h2>
          <p>
            i is an integer index. Lower bound ≤ upper bound. The summand is
            defined for every integer in the interval.
          </p>
        </article>
      </section>
      <section className="seq339-check">
        <article>
          <h2>Quick check</h2>
          <p>Evaluate Σ from i=1 to 5 of (2i−1).</p>
          <input
            aria-label="Sigma quick answer"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
          />
          <button
            onClick={() =>
              act(() =>
                setResult(Number(answer) === 25 ? "correct" : "incorrect"),
              )
            }
          >
            Check
          </button>
          <output className={result}>
            {result === "correct"
              ? "Correct! The sum is 25."
              : result === "incorrect"
                ? "Expand 1+3+5+7+9."
                : ""}
          </output>
        </article>
        <article>
          <h2>Worked solution</h2>
          <p>Terms: 1, 3, 5, 7, 9</p>
          <p>Sum = 1 + 3 + 5 + 7 + 9 = 25</p>
          <strong>General formula: Σ(2i−1) = n²</strong>
        </article>
      </section>
    </section>
  );
}
