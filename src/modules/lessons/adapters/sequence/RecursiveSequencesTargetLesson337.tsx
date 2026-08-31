import { Check, Download, RotateCcw } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";
import type { LessonAdapterProps } from "../../types";
import "./RecursiveSequencesTargetLesson337.css";

type Rule =
  { kind: "affine"; m: number; b: number } | { kind: "logistic"; r: number };
const presets = {
  "Linear growth": {
    source: "a + 2",
    rule: { kind: "affine", m: 1, b: 2 } as Rule,
  },
  "Linear decay": {
    source: "0.6a + 4",
    rule: { kind: "affine", m: 0.6, b: 4 } as Rule,
  },
  Doubling: { source: "2a", rule: { kind: "affine", m: 2, b: 0 } as Rule },
  Logistic: { source: "3.2a(1-a)", rule: { kind: "logistic", r: 3.2 } as Rule },
};
const clean = (v: number, precision = 6) => Number(v.toFixed(precision));
function parseRule(source: string): Rule | null {
  const text = source
    .toLowerCase()
    .replaceAll(" ", "")
    .replaceAll("aₙ₋₁", "a")
    .replaceAll("a_n-1", "a")
    .replaceAll("*", "");
  const logistic = text.match(/^([+-]?\d*\.?\d+)a\(1-a\)$/);
  if (logistic) return { kind: "logistic", r: Number(logistic[1]) };
  const affine = text.match(/^([+-]?\d*\.?\d*)a(?:([+-]\d*\.?\d+))?$/);
  if (!affine) return null;
  const m =
      affine[1] === "" || affine[1] === "+"
        ? 1
        : affine[1] === "-"
          ? -1
          : Number(affine[1]),
    b = Number(affine[2] ?? 0);
  return Number.isFinite(m) && Number.isFinite(b)
    ? { kind: "affine", m, b }
    : null;
}
const applyRule = (rule: Rule, value: number) =>
  rule.kind === "affine"
    ? rule.m * value + rule.b
    : rule.r * value * (1 - value);
const ruleLabel = (rule: Rule) =>
  rule.kind === "affine"
    ? `${rule.m}aₙ₋₁ ${rule.b < 0 ? "−" : "+"} ${Math.abs(rule.b)}`
    : `${rule.r}aₙ₋₁(1−aₙ₋₁)`;

export default function RecursiveSequencesTargetLesson337({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [preset, setPreset] = useState<keyof typeof presets>("Linear decay"),
    [custom, setCustom] = useState(true),
    [source, setSource] = useState("0.6a + 4"),
    [rule, setRule] = useState<Rule>(presets["Linear decay"].rule),
    [initial, setInitial] = useState(2),
    [precision, setPrecision] = useState(6),
    [shown, setShown] = useState(5),
    [tab, setTab] = useState("Define & Visualisation"),
    [quick, setQuick] = useState<"" | "correct" | "incorrect">(""),
    [actions, setActions] = useState(0);
  const terms = useMemo(() => {
    const values = [initial];
    for (let i = 1; i < 10; i++) values.push(applyRule(rule, values[i - 1]));
    return values;
  }, [initial, rule]);
  const fixed =
      rule.kind === "affine" && Math.abs(1 - rule.m) > 1e-10
        ? rule.b / (1 - rule.m)
        : null,
    errors = terms.map((v) => (fixed === null ? NaN : Math.abs(v - fixed))),
    stable = rule.kind === "affine" && Math.abs(rule.m) < 1,
    behavior = stable
      ? "Convergent"
      : rule.kind === "affine" && Math.abs(rule.m) === 1
        ? "Neutral"
        : "Nonlinear / divergent";
  const reset = () => {
    setPreset("Linear decay");
    setCustom(true);
    setSource("0.6a + 4");
    setRule(presets["Linear decay"].rule);
    setInitial(2);
    setPrecision(6);
    setShown(5);
    setTab("Define & Visualisation");
    setQuick("");
    setActions(0);
  };
  useEffect(reset, [resetToken]);
  const act = (run: () => void) => {
    run();
    setActions((v) => v + 1);
    onInteraction();
  };
  const choosePreset = (name: keyof typeof presets) =>
    act(() => {
      setPreset(name);
      setCustom(false);
      setSource(presets[name].source);
      setRule(presets[name].rule);
      setInitial(name === "Logistic" ? 0.2 : 2);
      setQuick("");
    });
  const updateSource = (value: string) => {
    setSource(value);
    const parsed = parseRule(value);
    if (parsed) act(() => setRule(parsed));
  };
  const changeInitial = (value: number) =>
    act(() => setInitial(clean(value, 6)));
  const exportCsv = () =>
    act(() => {
      const rows = [
        "n,a_n,absolute_error",
        ...terms.map((v, i) => `${i + 1},${v},${errors[i]}`),
      ];
      const link = document.createElement("a");
      link.href = URL.createObjectURL(
        new Blob([rows.join("\n")], { type: "text/csv" }),
      );
      link.download = "recursive-sequence.csv";
      link.click();
      URL.revokeObjectURL(link.href);
    });
  const dragInitial = (
    event: ReactPointerEvent<SVGCircleElement>,
    min: number,
    max: number,
  ) => {
    if (event.buttons !== 1) return;
    const rect = event.currentTarget.ownerSVGElement?.getBoundingClientRect();
    if (!rect) return;
    changeInitial(
      max -
        ((event.clientY - rect.top - 20) / (rect.height - 40)) * (max - min),
    );
  };
  const plotMin = Math.min(...terms, 0, fixed ?? 0) - 1,
    plotMax = Math.max(...terms, 10, fixed ?? 0) + 1,
    plotY = (v: number) => 20 + ((plotMax - v) / (plotMax - plotMin)) * 145;
  return (
    <section
      className="seq337-page"
      data-testid="sequence-mockup-0522"
      data-object-model="editable-affine-logistic-recurrence-parser-presets-initial-condition-dependency-chain-memoized-table-cobweb-draggable-seed-time-series-fixed-point-error-export-practice"
      data-preset={preset}
      data-custom={custom}
      data-rule={ruleLabel(rule)}
      data-initial={initial}
      data-terms={terms.map((v) => clean(v, precision)).join(",")}
      data-fixed={fixed === null ? "none" : clean(fixed, precision)}
      data-behavior={behavior}
      data-precision={precision}
      data-shown={shown}
      data-tab={tab}
      data-quick-result={quick}
      data-actions={actions}
    >
      <nav className="seq337-tabs">
        {[
          "Define & Visualisation",
          "Explain",
          "Examples",
          "Formulas",
          "Know more",
        ].map((name) => (
          <button
            key={name}
            className={tab === name ? "active" : ""}
            onClick={() => act(() => setTab(name))}
          >
            {name}
          </button>
        ))}
      </nav>
      <header className="seq337-hero">
        <h1>Recursive Sequences</h1>
        <div>
          <b>ADVANCED MATHEMATICS</b>
          <span>Level: Advanced</span>
          <span>Duration: ~40 min</span>
          <span>Topic: Recurrence Relations</span>
        </div>
        <p>
          <strong>Learning objective:</strong> Understand and analyze
          recursively defined sequences using recurrence relations, initial
          conditions, dependency chains, and graphical insight.
        </p>
      </header>
      <section className="seq337-config">
        <article>
          <header>
            <h2>1. Define the recurrence</h2>
            <label>
              Custom{" "}
              <input
                type="checkbox"
                checked={custom}
                onChange={(event) => act(() => setCustom(event.target.checked))}
              />
            </label>
          </header>
          <label>
            Recurrence relation
            <input
              aria-label="Recursive relation"
              value={source}
              disabled={!custom}
              onChange={(e) => updateSource(e.target.value)}
            />
          </label>
          <p>for n ≥ 2</p>
          <label>
            Initial conditions
            <input
              aria-label="Recursive initial value"
              type="number"
              value={initial}
              step="0.1"
              onChange={(e) => changeInitial(Number(e.target.value))}
            />
          </label>
          <small>Real numbers</small>
        </article>
        <article>
          <h2>Quick presets</h2>
          {(Object.keys(presets) as (keyof typeof presets)[]).map((name) => (
            <button
              key={name}
              className={preset === name ? "active" : ""}
              onClick={() => choosePreset(name)}
            >
              <b>{name}</b>
              <span>aₙ = {ruleLabel(presets[name].rule)}</span>
              {preset === name && <Check />}
            </button>
          ))}
        </article>
        <article className="settings">
          <h2>Active settings</h2>
          <p>
            Recurrence: <b>aₙ = {ruleLabel(rule)}</b>
          </p>
          <p>
            Initial: <b>a₁ = {initial}</b>
          </p>
          <p>Domain: n ∈ N, n ≥ 1</p>
          <p>Metric: Absolute error</p>
          <label>
            Precision:{" "}
            <select
              aria-label="Recursive precision"
              value={precision}
              onChange={(e) => act(() => setPrecision(Number(e.target.value)))}
            >
              {[2, 4, 6, 8].map((v) => (
                <option key={v} value={v}>
                  {v} decimal places
                </option>
              ))}
            </select>
          </label>
          <div>
            <button onClick={() => act(reset)}>
              <RotateCcw />
              Reset
            </button>
            <button onClick={() => act(() => setShown(10))}>
              Compute sequence
            </button>
          </div>
        </article>
      </section>
      <section className="seq337-three">
        <article>
          <h2>2. Dependency chain</h2>
          <p>Each term depends on the previous one.</p>
          <div className="chain">
            {terms.slice(0, shown).map((v, i) => (
              <span key={i}>
                <b>a{i + 1}</b>
                <em>↓</em>
                <output>{clean(v, precision)}</output>
              </span>
            ))}
          </div>
          <footer>
            <i /> Computed &nbsp;&nbsp; ○ Pending
          </footer>
        </article>
        <article className="evaluation">
          <h2>3. Step-by-step evaluation</h2>
          <p>Follow how each term is computed.</p>
          {terms.slice(0, shown).map((v, i) => (
            <div key={i}>
              <span>a{i + 1}</span>
              <b>
                {i
                  ? `${ruleLabel(rule).replaceAll("aₙ₋₁", `(${clean(terms[i - 1], precision)})`)} = ${clean(v, precision)}`
                  : clean(v, precision)}
              </b>
              <Check />
            </div>
          ))}
          <button onClick={() => act(() => setShown(Math.min(10, shown + 4)))}>
            Show next 4 steps
          </button>
        </article>
        <article className="cobweb">
          <h2>4. Cobweb diagram</h2>
          <p>Visualize iteration on y = f(x).</p>
          <svg viewBox="0 0 280 205">
            <line x1="28" y1="178" x2="265" y2="178" className="axis" />
            <line x1="28" y1="178" x2="28" y2="15" className="axis" />
            <line x1="28" y1="178" x2="260" y2="28" className="identity" />
            <polyline
              points={Array.from({ length: 70 }, (_, i) => {
                const x = plotMin + ((plotMax - plotMin) * i) / 69;
                return `${28 + i * 3.32},${plotY(applyRule(rule, x))}`;
              }).join(" ")}
              className="function"
            />
            <polyline
              points={terms
                .slice(0, 7)
                .flatMap((v, i) =>
                  i
                    ? [
                        `${28 + ((terms[i - 1] - plotMin) / (plotMax - plotMin)) * 232},${plotY(v)}`,
                        `${28 + ((v - plotMin) / (plotMax - plotMin)) * 232},${plotY(v)}`,
                      ]
                    : [],
                )
                .join(" ")}
              className="web"
            />
            <circle
              data-drag="recursive-cobweb-seed"
              cx={28 + ((initial - plotMin) / (plotMax - plotMin)) * 232}
              cy={plotY(initial)}
              r="6"
              onPointerDown={(e) =>
                e.currentTarget.setPointerCapture(e.pointerId)
              }
              onPointerMove={(e) => dragInitial(e, plotMin, plotMax)}
            />
          </svg>
          <p>
            The steps{" "}
            {stable
              ? `converge to the fixed point (${clean(fixed!)}, ${clean(fixed!)}).`
              : "show the recurrence orbit."}
          </p>
        </article>
      </section>
      <section className="seq337-data">
        <article>
          <header>
            <h2>5. Memoized terms table</h2>
            <button onClick={exportCsv}>
              <Download />
              Export
            </button>
          </header>
          <p>Computed terms are cached for instant access.</p>
          <table>
            <thead>
              <tr>
                <th>n</th>
                <th>aₙ</th>
                <th>Absolute error |aₙ − L|</th>
              </tr>
            </thead>
            <tbody>
              {terms.map((v, i) => (
                <tr key={i}>
                  <td>{i + 1}</td>
                  <td>{v.toFixed(precision)}</td>
                  <td>{fixed === null ? "—" : errors[i].toFixed(precision)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p>
            <b>
              Limit L ={" "}
              {fixed === null ? "not finite" : clean(fixed, precision)}
            </b>
          </p>
          <output>
            {stable
              ? `Error changes by a factor of ${Math.abs((rule as { m: number }).m)} each step.`
              : "Inspect the orbit for cycles or divergence."}
          </output>
        </article>
        <article className="timeplot">
          <h2>6. Time-series plot</h2>
          <p>Sequence values across n.</p>
          <svg viewBox="0 0 330 240">
            <g>
              {[0, 1, 2, 3, 4].map((i) => (
                <line
                  key={i}
                  x1="35"
                  y1={25 + i * 40}
                  x2="315"
                  y2={25 + i * 40}
                />
              ))}
            </g>
            {fixed !== null && (
              <line
                x1="35"
                y1={plotY(fixed)}
                x2="315"
                y2={plotY(fixed)}
                className="limit"
              />
            )}
            <polyline
              points={terms
                .map((v, i) => `${45 + i * 28},${plotY(v)}`)
                .join(" ")}
            />
            {terms.map((v, i) => (
              <circle
                key={i}
                data-drag={i === 0 ? "recursive-time-seed" : undefined}
                cx={45 + i * 28}
                cy={plotY(v)}
                r={i ? 4 : 6}
                onPointerDown={
                  i
                    ? undefined
                    : (e) => e.currentTarget.setPointerCapture(e.pointerId)
                }
                onPointerMove={
                  i ? undefined : (e) => dragInitial(e, plotMin, plotMax)
                }
              />
            ))}
          </svg>
          <div>
            <b>
              Initial value
              <br />
              a₁ = {initial}
            </b>
            <b>
              Limit
              <br />L = {fixed === null ? "—" : clean(fixed)}
            </b>
            <b>
              Rate factor
              <br />
              {rule.kind === "affine" ? `r = ${rule.m}` : "nonlinear"}
            </b>
            <b>
              Monotonic?
              <br />
              {terms.every((v, i) => !i || v >= terms[i - 1])
                ? "Increasing"
                : "No"}
            </b>
          </div>
        </article>
        <aside>
          {[
            [
              "7. Key insight",
              stable
                ? `The sequence converges to the fixed point L = ${clean(fixed!)} because |${(rule as { m: number }).m}| < 1.`
                : "The orbit's behavior depends on the recurrence.",
            ],
            [
              "8. Common misconception",
              "Not all recursive sequences grow without bound. Many converge to a finite limit or cycle.",
            ],
            [
              "9. Assumptions & cautions",
              "Convergence conditions depend on the recurrence. Floating-point rounding causes tiny errors for large n.",
            ],
          ].map(([a, b]) => (
            <article key={a}>
              <h2>{a}</h2>
              <p>{b}</p>
            </article>
          ))}
        </aside>
      </section>
      <section className="seq337-quick">
        <div>
          <h2>10. Quick check</h2>
          <p>Compute the 6th term for aₙ = 0.6aₙ₋₁ + 4 with a₁ = 2.</p>
          {[9.2, 9.37792, 9.7632, 10].map((v, i) => (
            <button
              key={v}
              className={quick && v === 9.37792 ? "correct" : ""}
              onClick={() =>
                act(() => setQuick(v === 9.37792 ? "correct" : "incorrect"))
              }
            >
              {String.fromCharCode(65 + i)} &nbsp; {v.toFixed(6)}
            </button>
          ))}
        </div>
        <output className={quick}>
          {quick === "correct" ? (
            <>
              <b>Correct!</b>
              <p>a₆ = 0.6(8.9632) + 4 = 9.37792</p>
            </>
          ) : quick === "incorrect" ? (
            "Recompute each preceding term first."
          ) : (
            "Choose an answer."
          )}
        </output>
      </section>
    </section>
  );
}
