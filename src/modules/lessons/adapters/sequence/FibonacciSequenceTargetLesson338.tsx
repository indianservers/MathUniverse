import { Check, Pause, Play, RotateCcw, Share2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";
import type { LessonAdapterProps } from "../../types";
import "./FibonacciSequenceTargetLesson338.css";

const PHI = (1 + Math.sqrt(5)) / 2,
  clean = (v: number, d = 6) => Number(v.toFixed(d));
const tabs = [
  "Interaction + visualisation",
  "Explain",
  "Examples",
  "Formulas",
  "Know more",
];
export default function FibonacciSequenceTargetLesson338({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [first, setFirst] = useState(1),
    [second, setSecond] = useState(1),
    [built, setBuilt] = useState(6),
    [auto, setAuto] = useState(true),
    [speed, setSpeed] = useState(5),
    [playing, setPlaying] = useState(false),
    [tab, setTab] = useState(tabs[0]),
    [saved, setSaved] = useState(true),
    [quick, setQuick] = useState<"" | "correct" | "incorrect">(""),
    [actions, setActions] = useState(0);
  const terms = useMemo(() => {
      const values = [first, second];
      for (let i = 2; i < 12; i++) values.push(values[i - 1] + values[i - 2]);
      return values;
    }, [first, second]),
    ratios = terms.map((v, i) => (i ? v / terms[i - 1] : NaN)),
    phiErrors = ratios.map((v) => Math.abs(v - PHI));
  const reset = () => {
    setFirst(1);
    setSecond(1);
    setBuilt(6);
    setAuto(true);
    setSpeed(5);
    setPlaying(false);
    setTab(tabs[0]);
    setSaved(true);
    setQuick("");
    setActions(0);
  };
  useEffect(reset, [resetToken]);
  useEffect(() => {
    if (!playing || !auto) return;
    const timer = window.setInterval(
      () => setBuilt((v) => (v >= 12 ? 2 : v + 1)),
      Math.max(180, 1100 - speed * 130),
    );
    return () => window.clearInterval(timer);
  }, [playing, auto, speed]);
  const act = (run: () => void) => {
    run();
    setActions((v) => v + 1);
    onInteraction();
  };
  const seed = (which: "first" | "second", delta: number) =>
    act(() => {
      const setter = which === "first" ? setFirst : setSecond;
      setter((v) => Math.max(1, Math.min(20, Math.round(v + delta))));
      setBuilt(6);
      setQuick("");
    });
  const dragSeed = (event: ReactPointerEvent<SVGRectElement>) => {
    if (event.buttons !== 1) return;
    const rect = event.currentTarget.ownerSVGElement?.getBoundingClientRect();
    if (!rect) return;
    const value = Math.max(
      1,
      Math.min(
        20,
        Math.round(1 + ((event.clientX - rect.left) / rect.width) * 9),
      ),
    );
    act(() => {
      setSecond(value);
      setBuilt(12);
    });
  };
  const share = () =>
    act(() =>
      navigator.clipboard?.writeText(
        `${location.href}?f1=${first}&f2=${second}`,
      ),
    );
  const colors = [
    "#d7b7fa",
    "#b9dbff",
    "#b9edcf",
    "#f7e7a7",
    "#f8b6a9",
    "#e9b7fa",
    "#a9e8e5",
  ];
  return (
    <section
      className="seq338-page"
      data-testid="sequence-mockup-0523"
      data-object-model="two-positive-integer-seeds-pairwise-recurrence-auto-build-speed-generated-term-list-fibonacci-square-spiral-draggable-seed-ratio-phi-convergence-binet-practice"
      data-first={first}
      data-second={second}
      data-built={built}
      data-auto={auto}
      data-playing={playing}
      data-speed={speed}
      data-terms={terms.join(",")}
      data-ratios={ratios
        .slice(1)
        .map((v) => clean(v))
        .join(",")}
      data-tab={tab}
      data-saved={saved}
      data-quick-result={quick}
      data-actions={actions}
    >
      <header className="seq338-hero">
        <span>
          <b>ADVANCED MATHEMATICS</b>
          <b>SEQUENCES AND SERIES</b>
        </span>
        <h1>Fibonacci Sequence</h1>
        <p>Explore a famous recurrence.</p>
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
            Reset
          </button>
          <button onClick={share}>
            <Share2 />
            Share
          </button>
          <button onClick={() => act(() => setTab(tabs[0]))}>Workspace</button>
        </nav>
      </header>
      <nav className="seq338-tabs">
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
      <section className="seq338-build">
        <header>
          <div>
            <h2>Build, visualize, and discover the Fibonacci sequence</h2>
            <p>
              Change the seeds, watch the sequence grow, explore the spiral, and
              see ratios converge to φ.
            </p>
          </div>
          <button onClick={() => act(() => setSaved((v) => !v))}>
            {saved ? (
              <>
                <Check />
                Saved
              </>
            ) : (
              "Save"
            )}
          </button>
        </header>
        <main>
          <article className="seeds">
            <h3>
              <i>1</i> Choose two seeds
            </h3>
            <p>Start the sequence with any two positive integers.</p>
            {[
              ["First seed (F₁)", first, "first"],
              ["Second seed (F₂)", second, "second"],
            ].map(([label, value, id]) => (
              <label key={String(id)}>
                {label}
                <span>
                  <button onClick={() => seed(id as "first" | "second", -1)}>
                    −
                  </button>
                  <output>{value}</output>
                  <button onClick={() => seed(id as "first" | "second", 1)}>
                    +
                  </button>
                </span>
              </label>
            ))}
            <button
              onClick={() =>
                act(() => {
                  setFirst(1);
                  setSecond(1);
                  setBuilt(6);
                })
              }
            >
              <RotateCcw />
              Reset seeds
            </button>
          </article>
          <article className="chain">
            <h3>
              <i>2</i> Build the sequence (pairwise addition)
            </h3>
            <p>Each new term is the sum of the previous two.</p>
            <div>
              {terms
                .slice(0, Math.min(built, 7))
                .slice(2)
                .map((v, i) => (
                  <span key={i}>
                    {terms[i]} + {terms[i + 1]} = <b>{v}</b>
                  </span>
                ))}
            </div>
            <ol>
              {terms.slice(0, built).map((_, i) => (
                <li key={i}>F{i + 1}</li>
              ))}
            </ol>
            <footer>
              <label>
                Auto build{" "}
                <input
                  aria-label="Fibonacci auto build"
                  type="checkbox"
                  checked={auto}
                  onChange={(e) => act(() => setAuto(e.target.checked))}
                />
              </label>
              <label>
                Speed{" "}
                <input
                  aria-label="Fibonacci build speed"
                  type="range"
                  min="1"
                  max="7"
                  value={speed}
                  onChange={(e) => act(() => setSpeed(Number(e.target.value)))}
                />
              </label>
              <button
                title={playing ? "Pause" : "Play"}
                onClick={() => act(() => setPlaying((v) => !v))}
              >
                {playing ? <Pause /> : <Play />}
              </button>
            </footer>
          </article>
          <article className="term-list">
            <h3>
              <i>3</i> Sequence terms
            </h3>
            <p>First 12 terms</p>
            <ol>
              {terms.map((v, i) => (
                <li key={i}>
                  F<sub>{i + 1}</sub> = <b>{v}</b>
                </li>
              ))}
            </ol>
          </article>
        </main>
      </section>
      <section className="seq338-pair">
        <article className="spiral">
          <h2>
            <i>4</i> Square spiral from Fibonacci rectangles
          </h2>
          <p>Squares with side lengths Fₙ form a logarithmic spiral.</p>
          <svg viewBox="0 0 430 330">
            <rect x="4" y="4" width="238" height="238" fill={colors[0]} />
            <rect x="242" y="4" width="146" height="146" fill={colors[1]} />
            <rect x="298" y="150" width="90" height="90" fill={colors[2]} />
            <rect x="242" y="184" width="56" height="56" fill={colors[3]} />
            <rect x="242" y="150" width="34" height="34" fill={colors[4]} />
            <rect x="276" y="150" width="22" height="22" fill={colors[5]} />
            <rect
              data-drag="fibonacci-seed-square"
              x="276"
              y="172"
              width="22"
              height="12"
              fill={colors[6]}
              onPointerDown={(e) =>
                e.currentTarget.setPointerCapture(e.pointerId)
              }
              onPointerMove={dragSeed}
            />
            <path d="M4 242 A238 238 0 0 1 242 4 A146 146 0 0 1 388 150 A90 90 0 0 1 298 240 A56 56 0 0 1 242 184 A34 34 0 0 1 276 150 A22 22 0 0 1 298 172" />
            <text x="90" y="130">
              {terms[7]} × {terms[7]}
            </text>
            <text x="285" y="78">
              {terms[6]} × {terms[6]}
            </text>
          </svg>
          <p>
            Spiral approximates the golden spiral. Drag the smallest square to
            change F₂.
          </p>
        </article>
        <article className="ratios">
          <h2>
            <i>5</i> Ratios converge to φ (golden ratio)
          </h2>
          <p>Observe Fₙ/Fₙ₋₁ approach φ ≈ {PHI.toFixed(9)}.</p>
          <table>
            <thead>
              <tr>
                <th>n</th>
                <th>Fₙ</th>
                <th>Fₙ/Fₙ₋₁</th>
                <th>Difference from φ</th>
              </tr>
            </thead>
            <tbody>
              {terms.slice(1).map((v, i) => (
                <tr key={i}>
                  <td>{i + 2}</td>
                  <td>{v}</td>
                  <td>{ratios[i + 1].toFixed(6)}</td>
                  <td>{phiErrors[i + 1].toFixed(6)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <output>φ = (1 + √5) / 2 ≈ {PHI.toFixed(12)}</output>
        </article>
      </section>
      <section className="seq338-theory">
        <article>
          <h2>
            <i>6</i> Nth-term (Binet's formula)
          </h2>
          <p>Closed form for the standard Fibonacci numbers.</p>
          <strong>Fₙ = (φⁿ − ψⁿ) / √5</strong>
          <p>
            φ = (1 + √5)/2 ≈ {PHI.toFixed(9)}
            <br />ψ = (1 − √5)/2 ≈ {(1 - PHI).toFixed(9)}
          </p>
          <output>
            For n=10, Binet gives{" "}
            {Math.round((PHI ** 10 - (1 - PHI) ** 10) / Math.sqrt(5))}.
          </output>
        </article>
        <article className="insight">
          <h2>Key insight</h2>
          <p>
            The Fibonacci sequence arises from a simple rule, yet appears in
            nature, art, architecture, and finance. Its ratios approach φ.
          </p>
          <svg viewBox="0 0 180 160">
            <path d="M145 135C70 155 20 105 43 52C64 3 137 21 138 75C139 118 87 132 66 101C47 73 78 45 105 59C129 71 116 99 96 98C80 97 77 79 88 73" />
          </svg>
        </article>
        <aside>
          <article>
            <h2>Common misconception</h2>
            <p>
              Fibonacci numbers are not always even or always odd. Their parity
              alternates even, odd, odd.
            </p>
          </article>
          <article>
            <h2>Assumptions & constraints</h2>
            <p>
              ✓ Seeds are positive integers.
              <br />✓ Fₙ = Fₙ₋₁ + Fₙ₋₂ for n ≥ 3.
              <br />✓ The recurrence extends to real seeds.
            </p>
          </article>
        </aside>
      </section>
      <section className="seq338-bottom">
        <article>
          <h2>Guided explanation</h2>
          {[
            "Start with any two positive integer seeds.",
            "Generate each term by adding the previous two.",
            "Plot the terms as square sizes to build a spiral.",
            "Compute ratios; they approach φ for positive seeds.",
            "Use Binet's formula for standard Fibonacci terms.",
          ].map((x, i) => (
            <p key={x}>
              <i>{i + 1}</i>
              {x}
            </p>
          ))}
        </article>
        <article className="quick">
          <h2>Quick check</h2>
          <p>What is the 10th term when F₁=1 and F₂=1?</p>
          {[34, 55, 89, 144].map((v, i) => (
            <button
              key={v}
              className={quick && v === 55 ? "correct" : ""}
              onClick={() =>
                act(() => setQuick(v === 55 ? "correct" : "incorrect"))
              }
            >
              {String.fromCharCode(65 + i)} &nbsp; {v}
            </button>
          ))}
          <output className={quick}>
            {quick === "correct"
              ? "Correct! F₁₀ = 55."
              : quick === "incorrect"
                ? "Add the two preceding terms each time."
                : "Choose an answer."}
          </output>
        </article>
      </section>
    </section>
  );
}
