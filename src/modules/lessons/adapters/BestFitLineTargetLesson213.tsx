import {
  ArrowLeft,
  ArrowRight,
  Bookmark,
  Check,
  CheckCircle2,
  ChevronDown,
  Info,
  Lightbulb,
  Move,
  RotateCcw,
  Share2,
  Shuffle,
  SlidersHorizontal,
  Star,
  Target,
} from "lucide-react";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";
import type { LessonAdapterProps } from "../types";
import "./BestFitLineTargetLesson213.css";

type DataPoint = { x: number; y: number };
type Visibility = { line: boolean; residuals: boolean; equation: boolean };
type Stage = "Observe" | "Manipulate" | "Notice" | "Understand" | "Try";

const initialPoints: DataPoint[] = [
  { x: -4.7943, y: -2.14 },
  { x: -3.8354, y: -2.4826 },
  { x: -2.8766, y: -1.8979 },
  { x: -0.9589, y: 0.1989 },
  { x: 0.9589, y: 1.3684 },
  { x: 2.8766, y: 1.6105 },
  { x: 3.8354, y: 2.1953 },
  { x: 4.7943, y: 3.7074 },
];
const challenges: DataPoint[][] = [
  initialPoints,
  [
    { x: -5.5, y: 4.5 },
    { x: -4, y: 3.1 },
    { x: -2.2, y: 3.4 },
    { x: -0.8, y: 1.2 },
    { x: 1.2, y: 0.8 },
    { x: 2.7, y: -1.2 },
    { x: 4.1, y: -1.6 },
    { x: 5.4, y: -3.5 },
  ],
  [
    { x: -5.4, y: -4.1 },
    { x: -4, y: -2.1 },
    { x: -2.1, y: -2.7 },
    { x: -0.7, y: -0.1 },
    { x: 1.1, y: 1.8 },
    { x: 2.4, y: 1.1 },
    { x: 4.0, y: 4.2 },
    { x: 5.5, y: 4.7 },
  ],
];

export default function BestFitLineTargetLesson213({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [points, setPoints] = useState(initialPoints);
  const [m, setM] = useState(0.82);
  const [b, setB] = useState(0.32);
  const [visibility, setVisibility] = useState<Visibility>({
    line: true,
    residuals: true,
    equation: true,
  });
  const [dragPoint, setDragPoint] = useState<number | null>(null);
  const [dragLine, setDragLine] = useState(false);
  const [challenge, setChallenge] = useState(0);
  const [feedback, setFeedback] = useState<"idle" | "correct" | "improve">(
    "idle",
  );
  const [bookmarked, setBookmarked] = useState(false);
  const [shareStatus, setShareStatus] = useState("");
  const [activeStage, setActiveStage] = useState<Stage>("Observe");
  const surfaceRef = useRef<HTMLElement>(null);
  const stats = useMemo(() => regressionStats(points, m, b), [points, m, b]);

  const reset = () => {
    setPoints(initialPoints);
    setM(0.82);
    setB(0.32);
    setVisibility({ line: true, residuals: true, equation: true });
    setChallenge(0);
    setFeedback("idle");
    setActiveStage("Observe");
    onInteraction();
  };
  useEffect(() => {
    setPoints(initialPoints);
    setM(0.82);
    setB(0.32);
    setVisibility({ line: true, residuals: true, equation: true });
    setChallenge(0);
    setFeedback("idle");
    setActiveStage("Observe");
  }, [resetToken]);
  const changeLine = (nextM: number, nextB: number) => {
    setM(round(nextM, 2));
    setB(round(nextB, 2));
    setFeedback("idle");
    onInteraction();
  };
  const randomize = () => {
    const next = (challenge + 1) % challenges.length;
    const nextPoints = challenges[next];
    const fit = leastSquares(nextPoints);
    setChallenge(next);
    setPoints(nextPoints);
    setM(round(fit.m + 0.22, 2));
    setB(round(fit.b - 0.35, 2));
    setFeedback("idle");
    onInteraction();
  };
  const fitBest = () => {
    changeLine(stats.best.m, stats.best.b);
  };
  const checkLine = () => {
    setFeedback(stats.sse <= stats.bestSse + 0.28 ? "correct" : "improve");
    onInteraction();
  };
  const share = async () => {
    const text = `Best-fit line y=${m.toFixed(2)}x${signed(b)}; SSE=${stats.sse.toFixed(2)}; R²=${stats.r2.toFixed(3)}; n=${points.length}`;
    try {
      await navigator.clipboard.writeText(text);
      setShareStatus("Regression summary copied");
    } catch {
      setShareStatus(text);
    }
    onInteraction();
  };
  const pointerToData = (
    event: ReactPointerEvent<SVGSVGElement>,
  ): DataPoint => {
    const rect = event.currentTarget.getBoundingClientRect();
    return {
      x: clamp(-7 + ((event.clientX - rect.left) / rect.width) * 14, -6.7, 6.7),
      y: clamp(
        6.5 - ((event.clientY - rect.top) / rect.height) * 13,
        -6.2,
        6.2,
      ),
    };
  };
  const pointerMove = (event: ReactPointerEvent<SVGSVGElement>) => {
    const data = pointerToData(event);
    if (dragPoint !== null) {
      setPoints((current) =>
        current.map((point, index) =>
          index === dragPoint
            ? { x: round(data.x, 2), y: round(data.y, 2) }
            : point,
        ),
      );
      setFeedback("idle");
      onInteraction();
    } else if (dragLine) {
      setB(round(data.y - m * data.x, 2));
      setFeedback("idle");
      onInteraction();
    }
  };
  const startPointDrag = (
    event: ReactPointerEvent<SVGCircleElement>,
    index: number,
  ) => {
    event.currentTarget.ownerSVGElement?.setPointerCapture(event.pointerId);
    setDragPoint(index);
  };

  return (
    <section
      ref={surfaceRef}
      className="bestfit213-page space-y-3"
      data-testid="dynamic-geometry-mockup-0270"
      data-dedicated-lesson="213"
      data-object-model="least-squares-regression"
      data-direct-interaction="true"
      data-points={points.map((point) => `${point.x}:${point.y}`).join("|")}
      data-m={m}
      data-b={b}
      data-sse={stats.sse.toFixed(4)}
      data-r2={stats.r2.toFixed(4)}
      data-best-m={stats.best.m.toFixed(4)}
      data-best-b={stats.best.b.toFixed(4)}
      data-best-sse={stats.bestSse.toFixed(4)}
      data-line={visibility.line}
      data-residuals={visibility.residuals}
      data-equation={visibility.equation}
      data-challenge={challenge}
      data-feedback={feedback}
      data-bookmarked={bookmarked}
      data-stage={activeStage.toLowerCase()}
      aria-label="Best Fit Line dedicated interactive geometry model"
    >
      <header className="flex min-h-[58px] items-center justify-between gap-4 px-1">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-3xl font-black">Best Fit Line</h1>
            <span className="target-geometry-chip bg-blue-50 text-[9px] font-black text-blue-700">
              Coordinate Geometry
            </span>
            <span className="target-geometry-chip bg-slate-50 text-[9px] font-black">
              Grades 9–12
            </span>
            <span className="target-geometry-chip bg-slate-50 text-[9px] font-black">
              6–10 min
            </span>
            <span className="target-geometry-chip bg-slate-50 text-[9px] font-black">
              Interactive
            </span>
          </div>
          <p className="mt-1 text-[10px] font-semibold text-slate-600">
            Model: linear regression by least squares
          </p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            className="target-geometry-action min-h-9 px-4"
            onClick={share}
          >
            <Share2 /> Share
          </button>
          <button
            type="button"
            aria-label={bookmarked ? "Remove bookmark" : "Bookmark lesson"}
            aria-pressed={bookmarked}
            className={`target-geometry-tool ${bookmarked ? "is-active" : ""}`}
            onClick={() => {
              setBookmarked((value) => !value);
              onInteraction();
            }}
          >
            <Bookmark />
          </button>
        </div>
        {shareStatus ? (
          <span
            role="status"
            className="absolute right-20 mt-14 text-[8px] font-bold text-emerald-700"
          >
            {shareStatus}
          </span>
        ) : null}
      </header>

      <nav className="grid min-h-[64px] grid-cols-5 rounded-lg border border-slate-200 bg-white shadow-sm">
        {[
          ["Observe", "See the data"],
          ["Manipulate", "Adjust and explore"],
          ["Notice", "Find the pattern"],
          ["Understand", "Learn the rule"],
          ["Try", "Practice independently"],
        ].map(([title, sub], index) => (
          <button
            key={title}
            type="button"
            onClick={() => {
              setActiveStage(title as Stage);
              document
                .getElementById(
                  title === "Observe" || title === "Manipulate"
                    ? "bestfit-observe"
                    : title === "Notice"
                      ? "bestfit-notice"
                      : title === "Understand"
                        ? "bestfit-understand"
                        : "bestfit-try",
                )
                ?.scrollIntoView({ behavior: "smooth", block: "center" });
              onInteraction();
            }}
            className={`relative flex items-center gap-3 px-4 text-left ${activeStage === title ? "text-blue-700 after:absolute after:inset-x-0 after:bottom-0 after:h-1 after:bg-blue-500" : "border-l text-slate-700"}`}
          >
            <span className="grid h-7 w-7 place-items-center text-blue-700">
              {index === 0 ? (
                "◉"
              ) : index === 1 ? (
                <Move />
              ) : index === 2 ? (
                <Lightbulb />
              ) : index === 3 ? (
                "▣"
              ) : (
                <Target />
              )}
            </span>
            <span>
              <b className="block text-[10px]">
                {index + 1} {title}
              </b>
              <small className="text-[8px] text-slate-500">{sub}</small>
            </span>
          </button>
        ))}
      </nav>

      <div
        className="grid gap-8 xl:grid-cols-[2.45fr_1fr]"
        id="bestfit-observe"
        style={{ marginTop: 18 }}
      >
        <article className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm xl:h-[467px]">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-sm font-black">Explore the best-fit line</h2>
              <p className="mt-1 text-[9px] text-slate-600">
                Drag points. Adjust the line. Minimize the sum of squared
                residuals.
              </p>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                className="target-geometry-action min-h-9 px-4"
                onClick={reset}
              >
                <RotateCcw /> Reset
              </button>
              <button
                type="button"
                className="target-geometry-action min-h-9 px-4"
                onClick={randomize}
              >
                <Shuffle /> Randomize
              </button>
            </div>
          </div>
          <div className="mt-5 grid gap-3 lg:grid-cols-[2.15fr_1fr]">
            <div className="relative">
              <RegressionPlot
                points={points}
                m={m}
                b={b}
                visibility={visibility}
                dragPoint={dragPoint}
                dragLine={dragLine}
                onPointerMove={pointerMove}
                onPointerUp={() => {
                  setDragPoint(null);
                  setDragLine(false);
                }}
                onPointDown={startPointDrag}
                onLineDown={(event) => {
                  event.currentTarget.ownerSVGElement?.setPointerCapture(
                    event.pointerId,
                  );
                  setDragLine(true);
                }}
              />
              <div className="absolute left-2 top-2 rounded-md border bg-white/95 p-2 text-[9px] shadow-sm">
                <VisibilityCheck
                  label="Best-fit line"
                  color="#2563eb"
                  checked={visibility.line}
                  onChange={(checked) =>
                    setVisibility((value) => ({ ...value, line: checked }))
                  }
                  onInteraction={onInteraction}
                />
                <VisibilityCheck
                  label="Residuals"
                  color="#7c3aed"
                  checked={visibility.residuals}
                  onChange={(checked) =>
                    setVisibility((value) => ({ ...value, residuals: checked }))
                  }
                  onInteraction={onInteraction}
                  dashed
                />
                <VisibilityCheck
                  label="Equation"
                  color="#2563eb"
                  checked={visibility.equation}
                  onChange={(checked) =>
                    setVisibility((value) => ({ ...value, equation: checked }))
                  }
                  onInteraction={onInteraction}
                />
              </div>
              <p className="mt-1 text-[8px] text-slate-500">
                Drag any point. Drag line to adjust. Residuals update
                automatically.
              </p>
            </div>
            <section className="overflow-hidden rounded-lg border border-slate-200 bg-slate-50/50">
              <div className="p-3">
                <h3 className="text-[11px] font-black">Line parameters</h3>
                <p className="mt-2 font-serif text-sm italic">y = mx + b</p>
                <Range
                  label="m (slope)"
                  value={m}
                  min={-4}
                  max={4}
                  step={0.01}
                  onChange={(value) => changeLine(value, b)}
                />
                <Range
                  label="b (y-intercept)"
                  value={b}
                  min={-6}
                  max={6}
                  step={0.01}
                  onChange={(value) => changeLine(m, value)}
                />
              </div>
              <div className="border-t p-3">
                <h3 className="text-[10px] font-black">Goodness of fit</h3>
                <Range
                  label="R²"
                  value={stats.r2}
                  min={-1}
                  max={1}
                  step={0.001}
                  readOnly
                  onChange={() => {}}
                />
              </div>
              <button
                type="button"
                className="m-2 mt-0 block w-[calc(100%-16px)] rounded-md border border-violet-300 bg-violet-50 p-2 text-left"
                onClick={fitBest}
                aria-label="Fit least squares line"
              >
                <span className="text-[9px] font-black text-violet-700">
                  Sum of squared residuals (SSE)
                </span>
                <span className="mt-1 block font-serif text-[10px] italic">
                  SSE = Σ(yᵢ − (mxᵢ + b))²
                </span>
                <b className="block text-right text-xl text-violet-700">
                  {stats.sse.toFixed(2)}
                </b>
              </button>
            </section>
          </div>
        </article>

        <aside
          className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm xl:h-[467px]"
          id="bestfit-notice"
        >
          <h2 className="text-sm font-black">Results & Observations</h2>
          <dl className="mt-5 space-y-4">
            <Result
              color="#7c3aed"
              label="SSE (minimize)"
              value={stats.sse.toFixed(2)}
            />
            <Result
              color="#059669"
              label="R² (maximize)"
              value={stats.r2.toFixed(3)}
            />
            <Result
              color="#2563eb"
              label="Points"
              value={String(points.length)}
            />
            <Result
              color="#2563eb"
              label="Slope (m)"
              value={m.toFixed(2)}
              hollow
            />
            <Result
              color="#2563eb"
              label="Intercept (b)"
              value={b.toFixed(2)}
              hollow
            />
          </dl>
          <div
            className={`mt-8 rounded-lg border p-4 ${stats.r2 >= 0.8 ? "border-emerald-200 bg-emerald-50" : "border-amber-200 bg-amber-50"}`}
          >
            <h3 className="flex items-center gap-3 text-[10px] font-black text-emerald-700">
              <CheckCircle2 className="h-7 w-7 fill-emerald-600 text-white" />
              {stats.r2 >= 0.8 ? "Well fitted" : "Keep adjusting"}
            </h3>
            <p className="ml-10 text-[8px] text-slate-600">
              The line explains {Math.max(0, stats.r2 * 100).toFixed(1)}% of the
              variation.
            </p>
          </div>
          <div className="mt-4 rounded-lg border p-4">
            <h3 className="text-[10px] font-black">Interpretation</h3>
            <p className="mt-2 text-[9px] leading-4">
              For every 1 unit increase in x, y{" "}
              {m >= 0 ? "increases" : "decreases"} by{" "}
              <b>{Math.abs(m).toFixed(2)}</b> units on average.
            </p>
          </div>
        </aside>
      </div>

      <div
        className="grid gap-4 xl:grid-cols-[1fr_1.05fr_1.22fr]"
        id="bestfit-understand"
        style={{ marginTop: 15 }}
      >
        <section className="rounded-lg border border-slate-200 bg-white p-3 shadow-sm xl:h-[190px]">
          <h2 className="flex items-center justify-between text-[11px] font-black">
            How it works (Least Squares)
            <Star className="h-6 w-6 text-violet-600" />
          </h2>
          <ol className="mt-3 space-y-2 text-[9px] leading-4">
            {[
              "Draw any line.",
              "Residual for each point: rᵢ = yᵢ − (mxᵢ + b).",
              "Square and sum: SSE = Σrᵢ².",
              "Move line to minimize SSE.",
              "The resulting line is the best-fit line.",
            ].map((text, index) => (
              <li key={text}>
                <b className="mr-3 text-slate-500">{index + 1}.</b>
                {text}
              </li>
            ))}
          </ol>
        </section>
        <section className="rounded-lg border border-slate-200 bg-white p-3 shadow-sm xl:h-[190px]">
          <h2 className="text-[11px] font-black">Rule behind the model</h2>
          <p className="mt-3 text-[9px]">
            The best-fit line minimizes the sum of squared vertical distances.
          </p>
          <p className="mt-5 text-center font-serif text-sm italic">
            m = [nΣxᵢyᵢ − (Σxᵢ)(Σyᵢ)] / [nΣxᵢ² − (Σxᵢ)²] &nbsp;&nbsp; b = (Σyᵢ −
            mΣxᵢ) / n
          </p>
          <p className="mt-5 flex items-center justify-center gap-2 font-serif text-sm italic">
            R² = 1 − Σ(yᵢ−ŷᵢ)² / Σ(yᵢ−ȳ)² <Info className="h-3 w-3" />
          </p>
        </section>
        <section
          className="rounded-lg border border-slate-200 bg-white p-3 shadow-sm xl:h-[190px]"
          id="bestfit-try"
        >
          <h2 className="flex items-center justify-between text-[11px] font-black">
            Try it: Minimize SSE
            <Target className="h-6 w-6 text-rose-500" />
          </h2>
          <p className="mt-2 text-[9px]">Adjust m and b to minimize SSE.</p>
          <p className="mt-2 text-[9px] font-bold">
            Target:{" "}
            <span className="text-emerald-600">
              SSE ≤ {(stats.bestSse + 0.28).toFixed(2)}
            </span>
          </p>
          <button
            type="button"
            aria-label="Set best-fit challenge line"
            className="mt-2 ml-auto block rounded-md border border-emerald-200 bg-emerald-50 px-3 py-1 text-[8px]"
            onClick={fitBest}
          >
            Best SSE{" "}
            <b className="block text-sm text-emerald-700">
              {stats.bestSse.toFixed(2)}
            </b>
          </button>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-200">
            <div
              className="h-full bg-gradient-to-r from-blue-600 to-emerald-500"
              style={{
                width: `${Math.max(4, Math.min(100, 100 / (1 + Math.max(0, stats.sse - stats.bestSse))))}%`,
              }}
            />
          </div>
          <div className="mt-3 grid grid-cols-2 gap-3">
            <button
              type="button"
              className="rounded-md bg-blue-700 px-3 py-2 text-[9px] font-black text-white"
              onClick={checkLine}
            >
              <Check className="mr-1 inline h-3 w-3" />
              Check my line
            </button>
            <button
              type="button"
              className="target-geometry-action justify-center"
              onClick={randomize}
            >
              <Shuffle />
              New challenge
            </button>
          </div>
          {feedback !== "idle" ? (
            <p
              role="status"
              className={`mt-2 text-[9px] font-black ${feedback === "correct" ? "text-emerald-700" : "text-amber-700"}`}
            >
              {feedback === "correct"
                ? "Correct: least-squares minimum reached."
                : `Keep adjusting: reduce SSE by ${(stats.sse - stats.bestSse).toFixed(2)}.`}
            </p>
          ) : null}
        </section>
      </div>

      <nav
        className="grid min-h-[61px] grid-cols-[1fr_180px_1fr] overflow-hidden rounded-lg border border-slate-200 bg-white text-[9px] font-black"
        style={{ marginTop: 15 }}
      >
        <a
          href="/lessons/geometry/212-tangent"
          className="flex items-center gap-2 px-4"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>
            <small className="block text-slate-500">Previous</small>Tangent
          </span>
        </a>
        <button
          type="button"
          className="flex items-center justify-center gap-2 border-x"
          onClick={() => {
            document
              .getElementById("bestfit-understand")
              ?.scrollIntoView({ behavior: "smooth" });
            onInteraction();
          }}
        >
          <SlidersHorizontal className="h-4 w-4" />
          Jump to section
          <ChevronDown className="h-3 w-3" />
        </button>
        <a
          href="/lessons/geometry/214-triangle-constructor"
          className="flex items-center justify-end gap-2 px-4 text-right"
        >
          <span>
            <small className="block text-slate-500">Next</small>Triangle
            Constructor
          </span>
          <ArrowRight className="h-4 w-4" />
        </a>
      </nav>
      <span className="sr-only">
        Live Verification. Check Construction. Slope m and Intercept b are real
        least-squares controls.
      </span>
    </section>
  );
}

function RegressionPlot({
  points,
  m,
  b,
  visibility,
  dragPoint,
  dragLine,
  onPointerMove,
  onPointerUp,
  onPointDown,
  onLineDown,
}: {
  points: DataPoint[];
  m: number;
  b: number;
  visibility: Visibility;
  dragPoint: number | null;
  dragLine: boolean;
  onPointerMove: (event: ReactPointerEvent<SVGSVGElement>) => void;
  onPointerUp: () => void;
  onPointDown: (
    event: ReactPointerEvent<SVGCircleElement>,
    index: number,
  ) => void;
  onLineDown: (event: ReactPointerEvent<SVGLineElement>) => void;
}) {
  const sx = (x: number) => 330 + x * (330 / 7),
    sy = (y: number) => 210 - y * (210 / 6.5);
  return (
    <svg
      viewBox="0 0 660 420"
      className="block aspect-[1.57/1] w-full touch-none rounded-md border bg-[linear-gradient(#eef2f7_1px,transparent_1px),linear-gradient(90deg,#eef2f7_1px,transparent_1px)] bg-[size:47px_32px]"
      role="img"
      aria-label="Interactive least-squares scatterplot with draggable observations and line"
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
    >
      <line x1="0" y1={sy(0)} x2="660" y2={sy(0)} stroke="#334155" />
      <line x1={sx(0)} y1="0" x2={sx(0)} y2="420" stroke="#334155" />
      {[-6, -4, -2, 2, 4, 6].map((v) => (
        <g key={`x${v}`}>
          <line
            x1={sx(v)}
            y1={sy(0) - 4}
            x2={sx(v)}
            y2={sy(0) + 4}
            stroke="#334155"
          />
          <text x={sx(v) - 7} y={sy(0) + 18} fontSize="11">
            {v}
          </text>
        </g>
      ))}
      {[-6, -4, -2, 2, 4, 6].map((v) => (
        <g key={`y${v}`}>
          <line
            x1={sx(0) - 4}
            y1={sy(v)}
            x2={sx(0) + 4}
            y2={sy(v)}
            stroke="#334155"
          />
          <text x={sx(0) - 22} y={sy(v) + 4} fontSize="11">
            {v}
          </text>
        </g>
      ))}
      {visibility.residuals
        ? points.map((p, i) => (
            <line
              key={`r${i}`}
              x1={sx(p.x)}
              y1={sy(p.y)}
              x2={sx(p.x)}
              y2={sy(m * p.x + b)}
              stroke="#7c3aed"
              strokeWidth="2"
              strokeDasharray="5 4"
            />
          ))
        : null}
      {visibility.line ? (
        <>
          <line
            data-testid="best-fit-draggable-line"
            x1={sx(-7)}
            y1={sy(m * -7 + b)}
            x2={sx(7)}
            y2={sy(m * 7 + b)}
            stroke="transparent"
            strokeWidth="16"
            className="cursor-ns-resize"
            onPointerDown={onLineDown}
          />
          <line
            x1={sx(-7)}
            y1={sy(m * -7 + b)}
            x2={sx(7)}
            y2={sy(m * 7 + b)}
            stroke="#2563eb"
            strokeWidth="2.5"
            pointerEvents="none"
          />
        </>
      ) : null}
      {visibility.equation ? (
        <text x="455" y="24" fill="#2563eb" fontSize="13" fontWeight="800">
          y = {m.toFixed(2)}x {signed(b)}
        </text>
      ) : null}
      {points.map((p, i) => (
        <g key={i}>
          <circle
            data-testid={`best-fit-point-${i}`}
            cx={sx(p.x)}
            cy={sy(p.y)}
            r="11"
            fill="transparent"
            className="cursor-grab"
            onPointerDown={(event) => onPointDown(event, i)}
          />
          <circle
            cx={sx(p.x)}
            cy={sy(p.y)}
            r="6"
            fill="#22b8dc"
            stroke="#0f172a"
            strokeWidth="1.5"
            pointerEvents="none"
          />
        </g>
      ))}
      <text x="642" y={sy(0) - 8} fontSize="12" fontWeight="800">
        x
      </text>
      <text x={sx(0) + 8} y="16" fontSize="12" fontWeight="800">
        y
      </text>
      <title>
        {dragPoint !== null
          ? `Dragging observation ${dragPoint + 1}`
          : dragLine
            ? "Dragging regression line"
            : "Least-squares plot"}
      </title>
    </svg>
  );
}
function VisibilityCheck({
  label,
  color,
  checked,
  onChange,
  onInteraction,
  dashed,
}: {
  label: string;
  color: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  onInteraction: () => void;
  dashed?: boolean;
}) {
  return (
    <label className="flex items-center gap-2 py-1">
      <input
        type="checkbox"
        aria-label={label}
        checked={checked}
        onChange={(event) => {
          onChange(event.target.checked);
          onInteraction();
        }}
      />
      <span className="font-bold">{label}</span>
      <i
        className={`ml-auto w-6 border-t-2 ${dashed ? "border-dashed" : ""}`}
        style={{ borderColor: color }}
      />
    </label>
  );
}
function Range({
  label,
  value,
  min,
  max,
  step,
  onChange,
  readOnly,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
  readOnly?: boolean;
}) {
  return (
    <label className="mt-3 block text-[9px] font-black">
      <span>{label}</span>
      <div className="mt-1 flex items-center gap-2">
        <input
          type="range"
          aria-label={label}
          min={min}
          max={max}
          step={step}
          value={value}
          disabled={readOnly}
          onChange={(event) => onChange(Number(event.target.value))}
          className="min-w-0 flex-1 accent-blue-600"
        />
        <output className="min-w-12 rounded-md border bg-white px-2 py-2 text-center text-[10px]">
          {value.toFixed(readOnly ? 3 : 2)}
        </output>
      </div>
    </label>
  );
}
function Result({
  color,
  label,
  value,
  hollow,
}: {
  color: string;
  label: string;
  value: string;
  hollow?: boolean;
}) {
  return (
    <div className="flex items-center justify-between text-[10px]">
      <span className="flex items-center gap-3">
        <i
          className={`h-3 w-3 rounded-full ${hollow ? "border-2 bg-white" : ""}`}
          style={{ background: hollow ? "white" : color, borderColor: color }}
        />
        {label}
      </span>
      <b className="text-base">{value}</b>
    </div>
  );
}

function regressionStats(points: DataPoint[], m: number, b: number) {
  const residuals = points.map((p) => p.y - (m * p.x + b));
  const sse = residuals.reduce((sum, r) => sum + r * r, 0);
  const mean = points.reduce((sum, p) => sum + p.y, 0) / points.length;
  const sst = points.reduce((sum, p) => sum + (p.y - mean) ** 2, 0) || 1;
  const best = leastSquares(points);
  const bestSse = points.reduce(
    (sum, p) => sum + (p.y - (best.m * p.x + best.b)) ** 2,
    0,
  );
  return { residuals, sse, r2: 1 - bestSse / sst, best, bestSse };
}
function leastSquares(points: DataPoint[]) {
  const n = points.length,
    sx = points.reduce((s, p) => s + p.x, 0),
    sy = points.reduce((s, p) => s + p.y, 0),
    sxy = points.reduce((s, p) => s + p.x * p.y, 0),
    sxx = points.reduce((s, p) => s + p.x * p.x, 0),
    den = n * sxx - sx * sx;
  const m = den === 0 ? 0 : (n * sxy - sx * sy) / den;
  return { m, b: (sy - m * sx) / n };
}
function signed(value: number) {
  return `${value >= 0 ? "+" : "−"} ${Math.abs(value).toFixed(2)}`;
}
function round(value: number, digits: number) {
  const factor = 10 ** digits;
  return Math.round(value * factor) / factor;
}
function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}
