import { Check, Download, Play, RotateCcw, Share2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";
import type { LessonAdapterProps } from "../../types";
import {
  formatSequencePolynomial,
  generateSequence,
  parseSequencePolynomial,
  type SequenceCoefficients,
} from "./sequenceGeneratorLessonModel";
import "./SequenceGeneratorTargetLesson334.css";

const clean = (v: number) => Number(v.toFixed(8));

export default function SequenceGeneratorTargetLesson334({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [type, setType] = useState<"explicit" | "recursive">("explicit"),
    [formula, setFormula] = useState("3n² + 2n + 1"),
    [coeff, setCoeff] = useState<SequenceCoefficients>({ a: 3, b: 2, c: 1 }),
    [first, setFirst] = useState(1),
    [last, setLast] = useState(10),
    [step, setStep] = useState(1),
    [recursiveStart, setRecursiveStart] = useState(6),
    [recursiveDiff, setRecursiveDiff] = useState(11),
    [differences, setDifferences] = useState(true),
    [ratios, setRatios] = useState(false),
    [sums, setSums] = useState(false),
    [chartMode, setChartMode] = useState<"line" | "points">("line"),
    [tab, setTab] = useState("Interaction + Visualisation"),
    [quick, setQuick] = useState(""),
    [quickResult, setQuickResult] = useState<"" | "correct" | "incorrect">(""),
    [turn15, setTurn15] = useState(""),
    [turn20, setTurn20] = useState(""),
    [turnResult, setTurnResult] = useState<"" | "correct" | "incorrect">(""),
    [generatedRevision, setGeneratedRevision] = useState(1),
    [actions, setActions] = useState(0);
  const analysis = useMemo(
      () =>
        generateSequence(
          type === "explicit"
            ? { type, coefficients: coeff }
            : { type, start: recursiveStart, difference: recursiveDiff },
          first,
          last,
          step,
        ),
      [type, coeff, recursiveStart, recursiveDiff, first, last, step],
    ),
    {
      indexes,
      terms,
      firstDifferences: firstDiff,
      secondDifferences: secondDiff,
      ratios: ratio,
      cumulativeSums: cumulative,
      classification,
      constantFirst,
      constantSecond,
      constantRatio,
    } = analysis;
  const reset = () => {
    setType("explicit");
    setFormula("3n² + 2n + 1");
    setCoeff({ a: 3, b: 2, c: 1 });
    setFirst(1);
    setLast(10);
    setStep(1);
    setRecursiveStart(6);
    setRecursiveDiff(11);
    setDifferences(true);
    setRatios(false);
    setSums(false);
    setChartMode("line");
    setTab("Interaction + Visualisation");
    setQuick("");
    setQuickResult("");
    setTurn15("");
    setTurn20("");
    setTurnResult("");
    setGeneratedRevision(1);
    setActions(0);
  };
  useEffect(reset, [resetToken]);
  const act = (run: () => void) => {
    run();
    setActions((v) => v + 1);
    onInteraction();
  };
  const openTab = (name: string) => {
    const target =
      name === "Interaction + Visualisation"
        ? "seq334-workspace"
        : name === "Guided Practice"
          ? "seq334-your-turn"
          : name === "Quick Check"
            ? "seq334-quick-check"
            : "seq334-learning";
    act(() => {
      setTab(name);
      document.getElementById(target)?.scrollIntoView({ behavior: "smooth" });
    });
  };
  const updateFormula = (value: string) => {
    setFormula(value);
    const parsed = parseSequencePolynomial(value);
    if (parsed) setCoeff(parsed);
  };
  const exportCsv = () =>
    act(() => {
      const rows = [
        "n,a_n,first_difference,second_difference,ratio,cumulative_sum",
        ...indexes.map((n, i) =>
          [
            n,
            terms[i],
            firstDiff[i],
            secondDiff[i],
            ratio[i],
            cumulative[i],
          ].join(","),
        ),
      ];
      const link = document.createElement("a");
      link.href = URL.createObjectURL(
        new Blob([rows.join("\n")], { type: "text/csv" }),
      );
      link.download = "sequence-generator.csv";
      link.click();
      URL.revokeObjectURL(link.href);
    });
  const dragPoint = (
    index: number,
    event: ReactPointerEvent<SVGSVGElement>,
  ) => {
    if (event.buttons !== 1 || type !== "explicit") return;
    const rect = event.currentTarget.getBoundingClientRect(),
      max = Math.max(...terms, 1),
      desired = (1 - (event.clientY - rect.top) / rect.height) * max * 1.15,
      delta = desired - terms[index];
    act(() => {
      const next = { ...coeff, c: clean(coeff.c + delta) };
      setCoeff(next);
      setFormula(formatSequencePolynomial(next));
    });
  };
  return (
    <section
      className="seq334-page"
      data-testid="sequence-mockup-0519"
      data-object-model="editable-polynomial-parser-explicit-recursive-range-generator-differences-ratios-cumulative-sums-pattern-detector-draggable-constant-export-practice"
      data-type={type}
      data-a={clean(coeff.a)}
      data-b={clean(coeff.b)}
      data-c={clean(coeff.c)}
      data-first={first}
      data-last={last}
      data-step={step}
      data-terms={terms.map(clean).join(",")}
      data-first-difference={firstDiff.slice(1).map(clean).join(",")}
      data-second-difference={secondDiff.slice(2).map(clean).join(",")}
      data-classification={classification}
      data-chart={chartMode}
      data-differences={differences}
      data-ratios={ratios}
      data-sums={sums}
      data-tab={tab}
      data-quick-result={quickResult}
      data-turn-result={turnResult}
      data-actions={actions}
      data-generated-revision={generatedRevision}
    >
      <header className="seq334-hero">
        <span>
          <b>ADVANCED MATHEMATICS</b>
          <b>SEQUENCES AND SERIES</b>
        </span>
        <h1>Sequence Generator</h1>
        <p>Explore sequences using explicit and recursive definitions.</p>
        <div>
          <article>
            <h3>Learning objective</h3>
            <p>
              Generate terms, identify patterns, and compare explicit and
              recursive definitions of sequences.
            </p>
          </article>
          <article>
            <h3>You'll learn</h3>
            <p>
              ✓ Explicit vs Recursive | ✓ Term generation | ✓ Pattern detection
              <br />✓ Graphing sequences | ✓ Common pitfalls
            </p>
          </article>
        </div>
        <svg viewBox="0 0 170 110">
          <path d="M8 92L42 84 72 68 102 45 138 15" />
          <rect x="18" y="84" width="10" height="12" />
          <rect x="42" y="75" width="10" height="21" />
          <rect x="67" y="61" width="10" height="35" />
          <rect x="92" y="43" width="10" height="53" />
          <rect x="117" y="20" width="10" height="76" />
          <text x="3" y="28">
            Σ
          </text>
          <text x="135" y="10">
            aₙ
          </text>
        </svg>
      </header>
      <nav className="seq334-tabs">
        {[
          "Interaction + Visualisation",
          "Explain",
          "Examples",
          "Guided Practice",
          "Quick Check",
          "Know More",
        ].map((name) => (
          <button
            key={name}
            className={tab === name ? "active" : ""}
            onClick={() => openTab(name)}
          >
            {name}
          </button>
        ))}
      </nav>
      <section className="seq334-lab">
        <header>
          <div>
            <h2>Build and explore your sequence</h2>
            <p>
              Choose a definition, set the rules, and watch terms, table, and
              graph update in real time.
            </p>
          </div>
          <button onClick={() => act(reset)}>
            <RotateCcw />
            Reset
          </button>
          <button onClick={exportCsv}>
            <Download />
            Export
          </button>
          <button
            onClick={() =>
              act(() => void navigator.clipboard?.writeText(location.href))
            }
          >
            <Share2 />
            Share
          </button>
        </header>
        <div className="seq334-workspace" id="seq334-workspace">
          <aside>
            <h3>Definition type</h3>
            <div className="segmented">
              <button
                className={type === "explicit" ? "active" : ""}
                onClick={() => act(() => setType("explicit"))}
              >
                Explicit (formula)
              </button>
              <button
                className={type === "recursive" ? "active" : ""}
                onClick={() => act(() => setType("recursive"))}
              >
                Recursive
              </button>
            </div>
            {type === "explicit" ? (
              <>
                <label>
                  Explicit formula aₙ =
                  <input
                    aria-label="Sequence explicit formula"
                    value={formula}
                    onChange={(e) => act(() => updateFormula(e.target.value))}
                  />
                  <span>
                    {parseSequencePolynomial(formula) ? (
                      <Check />
                    ) : (
                      "Invalid polynomial"
                    )}
                  </span>
                </label>
                <div className="presets">
                  <button
                    onClick={() => act(() => updateFormula("n² + n + 1"))}
                  >
                    aₙ=n²+n+1
                  </button>
                  <button onClick={() => act(() => updateFormula("4n − 1"))}>
                    aₙ=4n−1
                  </button>
                  <button
                    onClick={() => act(() => updateFormula("2n² − n + 4"))}
                  >
                    Custom
                  </button>
                </div>
              </>
            ) : (
              <>
                <label>
                  Starting term
                  <input
                    aria-label="Sequence recursive start"
                    type="number"
                    value={recursiveStart}
                    onChange={(e) =>
                      act(() => setRecursiveStart(Number(e.target.value)))
                    }
                  />
                </label>
                <label>
                  Common difference
                  <input
                    aria-label="Sequence recursive difference"
                    type="number"
                    value={recursiveDiff}
                    onChange={(e) =>
                      act(() => setRecursiveDiff(Number(e.target.value)))
                    }
                  />
                </label>
              </>
            )}
            <h3>Index (n) range</h3>
            <div className="range">
              <label>
                From
                <input
                  aria-label="Sequence range from"
                  type="number"
                  value={first}
                  onChange={(e) => act(() => setFirst(Number(e.target.value)))}
                />
              </label>
              <label>
                to
                <input
                  aria-label="Sequence range to"
                  type="number"
                  value={last}
                  onChange={(e) => act(() => setLast(Number(e.target.value)))}
                />
              </label>
              <label>
                step
                <input
                  aria-label="Sequence range step"
                  type="number"
                  min="1"
                  value={step}
                  onChange={(e) =>
                    act(() => setStep(Math.max(1, Number(e.target.value))))
                  }
                />
              </label>
            </div>
            <h3>Starting value (first term)</h3>
            <output>{terms[0]?.toFixed(2)}</output>
            <h3>Options</h3>
            <CheckBox
              label="Show differences (Δ)"
              checked={differences}
              set={() => act(() => setDifferences(!differences))}
            />
            <CheckBox
              label="Show ratios (r)"
              checked={ratios}
              set={() => act(() => setRatios(!ratios))}
            />
            <CheckBox
              label="Show cumulative sum (Sₙ)"
              checked={sums}
              set={() => act(() => setSums(!sums))}
            />
            <button
              className="generate"
              onClick={() =>
                act(() => setGeneratedRevision((value) => value + 1))
              }
            >
              <Play />
              Generate Sequence
            </button>
            <p className="success">◇ Sequence generated successfully.</p>
          </aside>
          <main>
            <header>
              <h3>Plot of sequence (n vs aₙ)</h3>
              <div>
                <button
                  className={chartMode === "line" ? "active" : ""}
                  onClick={() => act(() => setChartMode("line"))}
                >
                  Line
                </button>
                <button
                  className={chartMode === "points" ? "active" : ""}
                  onClick={() => act(() => setChartMode("points"))}
                >
                  Points
                </button>
              </div>
            </header>
            <SequenceChart
              indexes={indexes}
              terms={terms}
              mode={chartMode}
              drag={dragPoint}
            />
            <article>
              <b>Sequence insight</b>
              <p>
                {classification}.{" "}
                {classification === "Quadratic sequence"
                  ? `The second differences are constant (${secondDiff[2]?.toFixed(3)}).`
                  : "Change the rule to compare its pattern."}
              </p>
            </article>
          </main>
        </div>
        <section className="seq334-table">
          <div>
            <h3>Generated terms</h3>
            <table>
              <tbody>
                <tr>
                  <th>n</th>
                  {indexes.map((n) => (
                    <td key={n}>{n}</td>
                  ))}
                </tr>
                <tr>
                  <th>aₙ</th>
                  {terms.map((v, i) => (
                    <td key={i}>{v.toFixed(3)}</td>
                  ))}
                </tr>
                {differences && (
                  <>
                    <tr>
                      <th>First difference Δaₙ</th>
                      {firstDiff.map((v, i) => (
                        <td key={i}>
                          {Number.isFinite(v) ? v.toFixed(3) : "—"}
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <th>Second difference Δ²aₙ</th>
                      {secondDiff.map((v, i) => (
                        <td key={i}>
                          {Number.isFinite(v) ? v.toFixed(3) : "—"}
                        </td>
                      ))}
                    </tr>
                  </>
                )}
                {ratios && (
                  <tr>
                    <th>Ratio</th>
                    {ratio.map((v, i) => (
                      <td key={i}>{Number.isFinite(v) ? v.toFixed(3) : "—"}</td>
                    ))}
                  </tr>
                )}
                {sums && (
                  <tr>
                    <th>Cumulative sum</th>
                    {cumulative.map((v, i) => (
                      <td key={i}>{v.toFixed(2)}</td>
                    ))}
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <aside>
            <h3>Pattern detector</h3>
            <p>
              First differences{" "}
              <b>{constantFirst ? "Constant ✓" : "Not constant"}</b>
            </p>
            <p>
              Second differences{" "}
              <b>{constantSecond ? "Constant ✓" : "Not constant"}</b>
            </p>
            <p>
              Ratios <b>{constantRatio ? "Constant ✓" : "Not constant"}</b>
            </p>
            <article>
              <b>Conclusion</b>
              <p>{classification}</p>
            </article>
          </aside>
        </section>
        <section className="seq334-learning" id="seq334-learning">
          <article>
            <h3>How we got the terms</h3>
            <p>We used the {type} definition.</p>
            <strong>
              {type === "explicit"
                ? formatSequencePolynomial(coeff)
                : `aₙ=aₙ₋₁+${recursiveDiff}`}
            </strong>
            <p>
              For n={indexes[3]}: aₙ={terms[3]?.toFixed(3)}
            </p>
          </article>
          <article>
            <h3>Key insight</h3>
            <p>
              A constant second difference means a quadratic sequence. In
              general, for aₙ=an²+bn+c, Δ²aₙ=2a.
            </p>
          </article>
          <article>
            <h3>Common misconception</h3>
            <p>
              The first difference need not be constant. That is true only for
              linear sequences.
            </p>
          </article>
          <article>
            <h3>Assumptions & cautions</h3>
            <p>
              n is a positive integer. Changing the formula or range updates
              every result.
            </p>
          </article>
        </section>
      </section>
      <section className="seq334-checks">
        <article id="seq334-quick-check">
          <h2>Quick check</h2>
          <p>Using aₙ=3n²+2n+1, what is a₁₂?</p>
          <div>
            {[418, 457, 474, 486].map((v) => (
              <button
                key={v}
                className={quick === String(v) ? "selected" : ""}
                onClick={() =>
                  act(() => {
                    setQuick(String(v));
                    setQuickResult(v === 457 ? "correct" : "incorrect");
                  })
                }
              >
                {v}
              </button>
            ))}
          </div>
          <output className={quickResult}>
            {quickResult === "correct"
              ? "Correct: 3(12²)+2(12)+1=457."
              : quickResult === "incorrect"
                ? "Recalculate 3×144+24+1."
                : ""}
          </output>
        </article>
        <article id="seq334-your-turn">
          <h2>Your turn</h2>
          <p>Find a₁₅ and a₂₀.</p>
          <div>
            <label>
              a₁₅=
              <input
                aria-label="Sequence practice a15"
                value={turn15}
                onChange={(e) => setTurn15(e.target.value)}
              />
            </label>
            <label>
              a₂₀=
              <input
                aria-label="Sequence practice a20"
                value={turn20}
                onChange={(e) => setTurn20(e.target.value)}
              />
            </label>
          </div>
          <button
            onClick={() =>
              act(() =>
                setTurnResult(
                  Number(turn15) === 706 && Number(turn20) === 1241
                    ? "correct"
                    : "incorrect",
                ),
              )
            }
          >
            Check my answer
          </button>
          <output className={turnResult}>
            {turnResult === "correct"
              ? "Great job! Both answers are correct."
              : turnResult === "incorrect"
                ? "Use the same explicit rule for each index."
                : ""}
          </output>
        </article>
      </section>
    </section>
  );
}
function CheckBox({
  label,
  checked,
  set,
}: {
  label: string;
  checked: boolean;
  set: () => void;
}) {
  return (
    <label className="seq334-check">
      <input type="checkbox" checked={checked} onChange={set} />
      {label}
    </label>
  );
}
function SequenceChart({
  indexes,
  terms,
  mode,
  drag,
}: {
  indexes: number[];
  terms: number[];
  mode: "line" | "points";
  drag: (i: number, e: ReactPointerEvent<SVGSVGElement>) => void;
}) {
  const max = Math.max(...terms, 1),
    sx = (i: number) => 38 + (i / Math.max(1, terms.length - 1)) * 420,
    sy = (v: number) => 260 - (v / max) * 220,
    points = terms.map((v, i) => `${sx(i)},${sy(v)}`).join(" ");
  return (
    <svg
      className="seq334-chart"
      viewBox="0 0 480 290"
      onPointerMove={(e) => {
        const index = Number(e.currentTarget.dataset.dragIndex);
        if (Number.isInteger(index)) drag(index, e);
      }}
      onPointerUp={(e) => delete e.currentTarget.dataset.dragIndex}
    >
      <line x1="32" x2="465" y1="260" y2="260" />
      <line x1="32" x2="32" y1="20" y2="260" />
      {mode === "line" && <polyline points={points} />}{" "}
      {terms.map((v, i) => (
        <g key={indexes[i]}>
          <circle
            data-drag={`sequence-point-${i}`}
            cx={sx(i)}
            cy={sy(v)}
            r="5"
            onPointerDown={(e) => {
              e.currentTarget.ownerSVGElement!.dataset.dragIndex = String(i);
              e.currentTarget.setPointerCapture(e.pointerId);
            }}
          />
          <text x={sx(i)} y={sy(v) - 10}>
            {v.toFixed(0)}
          </text>
          <text x={sx(i)} y="278">
            {indexes[i]}
          </text>
        </g>
      ))}
    </svg>
  );
}
