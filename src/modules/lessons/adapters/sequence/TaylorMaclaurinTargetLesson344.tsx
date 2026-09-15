import {
  Maximize2,
  Pause,
  Play,
  RotateCcw,
  Share2,
  StepForward,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";
import type { LessonAdapterProps } from "../../types";
import {
  factorial,
  taylorDerivativeText,
  taylorFunctionValue,
  taylorMaclaurinAnalysis,
} from "./taylorMaclaurinLessonModel";
import type { TaylorFunction } from "./taylorMaclaurinLessonModel";
import "./TaylorMaclaurinTargetLesson344.css";
import { LessonTopicStudyBoard } from "../../components/LessonTopicStudyBoard";
const tabs = [
  "Interactive Lab",
  "Guided Explanation",
  "Worked Solution",
  "Key Insights",
  "Quick Check",
];
const clean = (v: number) => Number(v.toFixed(7));
export default function TaylorMaclaurinTargetLesson344({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [fn, setFn] = useState<TaylorFunction>("e^x"),
    [center, setCenter] = useState(0),
    [order, setOrder] = useState(4),
    [low, setLow] = useState(-3),
    [high, setHigh] = useState(3),
    [shownOrder, setShownOrder] = useState(4),
    [playing, setPlaying] = useState(false),
    [speed, setSpeed] = useState(5),
    [tab, setTab] = useState(tabs[0]),
    [language, setLanguage] = useState<"en" | "hi">("en"),
    [question, setQuestion] = useState(0),
    [quick, setQuick] = useState<"" | "correct" | "incorrect">(""),
    [fullscreen, setFullscreen] = useState(false),
    [actions, setActions] = useState(0);
  const analysis = useMemo(
      () =>
        taylorMaclaurinAnalysis({
          fn,
          center,
          order,
          shownOrder,
          low,
          high,
        }),
      [fn, center, order, shownOrder, low, high],
    ),
    {
      valid,
      coefficients: coeffs,
      samples,
      maxError,
      orderErrors,
      expanded,
    } = analysis;
  const yMin = Math.min(-2, ...samples.flatMap((p) => [p.f, p.p])),
    yMax = Math.max(2, ...samples.flatMap((p) => [p.f, p.p])),
    gx = (x: number) => 35 + ((x - low) / Math.max(0.001, high - low)) * 525,
    gy = (y: number) => 195 - ((y - yMin) / Math.max(0.01, yMax - yMin)) * 165;
  const path = (key: "f" | "p") =>
    samples
      .map(
        (p, i) =>
          `${i ? "L" : "M"}${gx(p.x).toFixed(2)} ${gy(p[key]).toFixed(2)}`,
      )
      .join(" ");
  const reset = () => {
    setFn("e^x");
    setCenter(0);
    setOrder(4);
    setLow(-3);
    setHigh(3);
    setShownOrder(4);
    setPlaying(false);
    setSpeed(5);
    setTab(tabs[0]);
    setLanguage("en");
    setQuestion(0);
    setQuick("");
    setFullscreen(false);
    setActions(0);
  };
  useEffect(reset, [resetToken]);
  useEffect(() => {
    if (!playing) return;
    const id = setInterval(
      () => setShownOrder((n) => (n >= order ? 0 : n + 1)),
      Math.max(180, 1100 - speed * 90),
    );
    return () => clearInterval(id);
  }, [playing, speed, order]);
  const act = (run: () => void) => {
      run();
      setActions((v) => v + 1);
      onInteraction();
    },
    setN = (n: number) =>
      act(() => {
        const next = Math.max(0, Math.min(10, Math.round(n)));
        setOrder(next);
        setShownOrder(next);
        setQuick("");
      });
  const dragCenter = (e: ReactPointerEvent<SVGCircleElement>) => {
    if (e.buttons !== 1) return;
    const rect = e.currentTarget.ownerSVGElement?.getBoundingClientRect();
    if (!rect) return;
    const x =
      low +
      Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width)) *
        (high - low);
    act(() => {
      setCenter(clean(x));
      setQuick("");
    });
  };
  const challenges = [
    {
      label: "Find the fourth-order Maclaurin polynomial of e^x.",
      choices: [
        "1+x+x^2/2+x^3/6+x^4/24",
        "x+x^2/2+x^3/6+x^4/24",
        "1+x^2/2+x^4/24",
        "1+x+x^2/2+x^3/3+x^4/4",
      ],
      correct: 0,
    },
    {
      label: "The Maclaurin center is:",
      choices: ["a=0", "a=1", "a=-1", "any a"],
      correct: 0,
    },
  ];
  return (
    <section
      className={`seq344-page${fullscreen ? " fullscreen" : ""}`}
      data-testid="sequence-mockup-0529"
      data-object-model="five-function-taylor-coefficients-expansion-center-order-target-interval-function-polynomial-graph-draggable-center-animation-remainder-error-convergence-bars-derivative-table-expanded-form-multi-question-practice"
      data-function={fn}
      data-center={center}
      data-order={order}
      data-shown-order={shownOrder}
      data-interval={`${low},${high}`}
      data-coefficients={coeffs.map(clean).join(",")}
      data-error={clean(maxError)}
      data-valid={valid}
      data-playing={playing}
      data-tab={tab}
      data-language={language}
      data-question={question}
      data-quick-result={quick}
      data-actions={actions}
    >
      <header className="seq344-hero">
        <div>
          <span>
            <b>ADVANCED MATHEMATICS</b>
            <b>SEQUENCES AND SERIES</b>
          </span>
          <h1>
            {language === "en"
              ? "Taylor and Maclaurin Series"
              : "टेलर और मैक्लॉरिन श्रेणी"}
          </h1>
          <p>
            {language === "en"
              ? "Approximate functions using derivatives at a chosen center."
              : "चुने हुए केंद्र पर अवकलजों से फलनों का सन्निकटन करें।"}
          </p>
          <div>
            {[
              "Intermediate-Advanced",
              "Sequences & Series",
              "Interactive",
              "20-30 min",
            ].map((x) => (
              <b key={x}>{x}</b>
            ))}
          </div>
          <nav>
            <select
              aria-label="Language"
              value={language}
              onChange={(event) =>
                act(() => setLanguage(event.target.value as "en" | "hi"))
              }
            >
              <option value="en">English (English)</option>
              <option value="hi">हिन्दी (Hindi)</option>
            </select>
            <button onClick={() => act(reset)}>
              <RotateCcw />
              Reset Lab
            </button>
            <button
              onClick={() =>
                act(() => navigator.clipboard?.writeText(location.href))
              }
            >
              <Share2 />
              Share
            </button>
          </nav>
        </div>
        <aside>
          <b>Learning Objective</b>
          <p>
            Understand and visualize how Taylor and Maclaurin series approximate
            functions using derivatives at a chosen center, and how accuracy
            improves with higher order.
          </p>
        </aside>
      </header>
      <nav className="seq344-tabs">
        {tabs.map((x) => (
          <button
            className={tab === x ? "active" : ""}
            key={x}
            onClick={() => {
              act(() => setTab(x));
              document
                .getElementById(
                  x === tabs[0]
                    ? "seq344-lab"
                    : x === "Quick Check"
                      ? "seq344-check"
                      : "seq344-insights",
                )
                ?.scrollIntoView({ behavior: "smooth" });
            }}
          >
            {x}
          </button>
        ))}
      </nav>
      <section className="seq344-lab" id="seq344-lab">
        <header>
          <div>
            <small>INTERACTIVE LAB</small>
            <h2>Explore Taylor & Maclaurin Series</h2>
          </div>
          <span>Controls</span>
          <button onClick={() => act(reset)}>Reset All</button>
          <button
            title="Fullscreen"
            onClick={() => act(() => setFullscreen((v) => !v))}
          >
            <Maximize2 />
          </button>
        </header>
        <section className="seq344-controls">
          <label>
            Function f(x)
            <select
              aria-label="Taylor function"
              value={fn}
              onChange={(e) =>
                act(() => {
                  setFn(e.target.value as TaylorFunction);
                  setQuick("");
                })
              }
            >
              {["e^x", "sin x", "cos x", "ln(1+x)", "1/(1-x)"].map((x) => (
                <option key={x}>{x}</option>
              ))}
            </select>
          </label>
          <label>
            Expansion center a
            <input
              aria-label="Expansion center"
              type="range"
              min={-2}
              max={2}
              step={0.1}
              value={center}
              onChange={(e) => act(() => setCenter(Number(e.target.value)))}
            />
            <input
              aria-label="Expansion center number"
              type="number"
              step={0.1}
              value={center}
              onChange={(e) => act(() => setCenter(Number(e.target.value)))}
            />
          </label>
          <label>
            Order n
            <input
              aria-label="Taylor order"
              type="range"
              min={0}
              max={10}
              value={order}
              onChange={(e) => setN(Number(e.target.value))}
            />
            <input
              aria-label="Taylor order number"
              type="number"
              min={0}
              max={10}
              value={order}
              onChange={(e) => setN(Number(e.target.value))}
            />
          </label>
          <label>
            Target interval [x]
            <span>
              <input
                aria-label="Interval low"
                type="number"
                value={low}
                onChange={(e) => act(() => setLow(Number(e.target.value)))}
              />
              <input
                aria-label="Interval high"
                type="number"
                value={high}
                onChange={(e) => act(() => setHigh(Number(e.target.value)))}
              />
            </span>
          </label>
          <div>
            <b>Target f(x)</b>
            <b>Taylor Tn(x)</b>
            <b>Center a</b>
          </div>
        </section>
        <div className="seq344-main">
          <article className="seq344-graph">
            <header>
              <b>f(x) = {fn}</b>
              <span>
                Center a = {center} | Order n = {shownOrder}
              </span>
            </header>
            <svg
              viewBox="0 0 600 240"
              role="img"
              aria-label="Taylor approximation graph"
            >
              <path className="axis" d="M30 195H580M300 15V220" />
              <path className="function" d={path("f")} />
              <path className="polynomial" d={path("p")} />
              <circle
                data-drag="taylor-center"
                cx={gx(center)}
                cy={gy(taylorFunctionValue(fn, center))}
                r="7"
                onPointerDown={(e) =>
                  e.currentTarget.setPointerCapture(e.pointerId)
                }
                onPointerMove={dragCenter}
              />
            </svg>
            <footer>
              <b>Animation</b>
              <button onClick={() => act(() => setPlaying(false))}>
                <Pause />
                Pause
              </button>
              <button onClick={() => act(() => setPlaying(true))}>
                <Play />
                Play
              </button>
              <button
                onClick={() =>
                  act(() => setShownOrder((n) => (n >= order ? 0 : n + 1)))
                }
              >
                <StepForward />
                Step
              </button>
              <label>
                Speed
                <input
                  aria-label="Animation speed"
                  type="range"
                  min={1}
                  max={10}
                  value={speed}
                  onChange={(e) => act(() => setSpeed(Number(e.target.value)))}
                />
              </label>
            </footer>
          </article>
          <aside className="seq344-builder">
            <h2>Series Builder</h2>
            <p>Taylor series about a:</p>
            <strong>Tn(x) = sum f^(k)(a)(x-a)^k/k!</strong>
            <h3>Derivative coefficients at a = {center}</h3>
            <table>
              <thead>
                <tr>
                  <th>k</th>
                  <th>f^(k)(x)</th>
                  <th>f^(k)(a)</th>
                  <th>Term</th>
                </tr>
              </thead>
              <tbody>
                {coeffs.map((c, k) => (
                  <tr key={k}>
                    <td>{k}</td>
                    <td>{taylorDerivativeText(fn, k)}</td>
                    <td>{clean(c * factorial(k))}</td>
                    <td>
                      {clean(c)}(x-a)^{k}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <output>
              T{shownOrder}(x) = {expanded}
            </output>
          </aside>
        </div>
        <section className="seq344-analysis">
          <article>
            <h2>Remainder / Error</h2>
            <b>Rn(x) = f(x) - Tn(x)</b>
            <svg viewBox="0 0 220 110">
              <path d="M10 55H210" />
              {samples.map((p, i) => (
                <circle
                  key={i}
                  cx={10 + i * 2.5}
                  cy={55 - ((p.f - p.p) * 20) / Math.max(1, maxError)}
                  r="1"
                />
              ))}
            </svg>
            <strong>
              Max |Rn(x)| on [{low},{high}]: {clean(maxError)}
            </strong>
            <p>Error grows away from the center.</p>
          </article>
          <article>
            <h2>Convergence Visualizer</h2>
            <p>Increase order n to see the approximation improve.</p>
            <div className="seq344-bars">
              {orderErrors.map((error, n) => (
                <span
                  key={n}
                  style={{
                    height: `${Math.max(3, 90 - 12 * Math.log10(1 + 1 / Math.max(error, 1e-8)))}px`,
                  }}
                >
                  <i>{n}</i>
                </span>
              ))}
            </div>
          </article>
          <article>
            <h2>Try Other Centers</h2>
            <p>Move the center a to see local approximation.</p>
            <label>
              a ={" "}
              <input
                aria-label="Try center"
                type="range"
                min={-2}
                max={2}
                step={0.1}
                value={center}
                onChange={(e) => act(() => setCenter(Number(e.target.value)))}
              />
              <b>{center}</b>
            </label>
            <p>Best accuracy near the center.</p>
            <aside>
              For e^x, all derivatives equal e^x, so Maclaurin coefficients are
              1/k!.
            </aside>
          </article>
        </section>
      </section>
      <section className="seq344-insights" id="seq344-insights">
        <article>
          <b>Key Insight</b>
          <p>
            Taylor polynomials match the function and its first n derivatives at
            x=a. Increasing n reduces the remainder near a.
          </p>
        </article>
        <article>
          <b>Common Misconception</b>
          <p>
            Taylor series do not always converge to the function everywhere.
          </p>
        </article>
        <article>
          <b>Assumptions / Constraints</b>
          <p>
            f must be n+1 times differentiable near the center. Approximation is
            local.
          </p>
        </article>
        <article>
          <b>Notation Reference</b>
          <p>
            Tn(x): polynomial
            <br />
            a: expansion center
            <br />
            Rn(x): remainder
          </p>
        </article>
      </section>
      <section className="seq344-check" id="seq344-check">
        <article>
          <small>QUICK CHECK ({question + 1} of 2)</small>
          <h2>{challenges[question].label}</h2>
          {challenges[question].choices.map((x, i) => (
            <button
              className={
                quick && i === challenges[question].correct ? "correct" : ""
              }
              key={x}
              onClick={() =>
                act(() =>
                  setQuick(
                    i === challenges[question].correct
                      ? "correct"
                      : "incorrect",
                  ),
                )
              }
            >
              {String.fromCharCode(65 + i)}) {x}
            </button>
          ))}
        </article>
        <aside className={quick}>
          <b>
            {quick === "correct"
              ? "Correct!"
              : quick === "incorrect"
                ? "Try again"
                : "Choose an answer."}
          </b>
          {quick === "correct" && (
            <>
              <p>
                The derivative coefficients determine every polynomial term.
              </p>
              <button
                onClick={() =>
                  act(() => {
                    setQuestion((v) => (v + 1) % 2);
                    setQuick("");
                  })
                }
              >
                Next Question
              </button>
            </>
          )}
        </aside>
      </section>
      <LessonTopicStudyBoard lessonId={344} view={tab} onInteraction={onInteraction} />

    </section>
  );
}
