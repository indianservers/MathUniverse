import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Check,
  Info,
  Lightbulb,
  RotateCcw,
  Share2,
} from "lucide-react";
import {
  useEffect,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";
import type { LessonAdapterProps } from "../../types";
import "./TypesOfDiscontinuityTargetLesson282.css";

type BreakType = "removable" | "jump" | "infinite";
type MarkerState = Record<BreakType, { left: number; right: number }>;

const labels: Record<BreakType, string> = {
  removable: "Removable discontinuity",
  jump: "Jump discontinuity",
  infinite: "Infinite discontinuity",
};

const initialMarkers: MarkerState = {
  removable: { left: -1.3, right: 1.3 },
  jump: { left: -1.35, right: 1.35 },
  infinite: { left: -0.65, right: 0.65 },
};

export default function TypesOfDiscontinuityTargetLesson282({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [selected, setSelected] = useState<BreakType>("removable");
  const [classification, setClassification] = useState<BreakType>("removable");
  const [markers, setMarkers] = useState<MarkerState>(initialMarkers);
  const [tab, setTab] = useState("Interaction + visualization");
  const [actions, setActions] = useState(0);

  const reset = () => {
    setSelected("removable");
    setClassification("removable");
    setMarkers(initialMarkers);
    setTab("Interaction + visualization");
    setActions(0);
  };
  useEffect(reset, [resetToken]);
  const act = (run: () => void) => {
    run();
    setActions((value) => value + 1);
    onInteraction();
  };
  const choose = (type: BreakType) =>
    act(() => {
      setSelected(type);
      setClassification(type);
    });
  const moveMarker = (type: BreakType, side: "left" | "right", value: number) =>
    act(() =>
      setMarkers((current) => ({
        ...current,
        [type]: { ...current[type], [side]: Number(value.toFixed(2)) },
      })),
    );

  return (
    <section
      className="td282-page"
      data-testid="calculus-mockup-0361"
      data-dedicated-lesson="282"
      data-object-model="three-break-graphs-six-draggable-approach-markers-derived-limits-classification"
      data-selected={selected}
      data-classification={classification}
      data-classification-correct={classification === selected}
      data-left-marker={markers[selected].left}
      data-right-marker={markers[selected].right}
      data-actions={actions}
    >
      <span className="sr-only">Types of discontinuity</span>
      <nav className="td282-breadcrumb" aria-label="Target breadcrumb">
        <span>Home</span><b>›</b><span>Lessons</span><b>›</b><span>Calculus</span><b>›</b><strong>282 Types of Discontinuity</strong>
      </nav>
      <header className="td282-title">
        <h1>Types of Discontinuity</h1>
        <p>
          Classify graph breaks <span>Calculus Lab</span>
        </p>
      </header>
      <nav className="td282-tabs" aria-label="Lesson views">
        {[
          "Interaction + visualization",
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
      <section className="td282-lab">
        <main>
          <header>
            <b>
              Explore the three types of discontinuities. Drag the approach
              markers on each graph.
            </b>
            <button data-lesson-control="reset" onClick={() => act(reset)}>
              <RotateCcw /> Reset all
            </button>
            <button
              data-lesson-control="share"
              onClick={() =>
                act(() =>
                  navigator.clipboard?.writeText(
                    `${labels[selected]}: left=${markers[selected].left}, right=${markers[selected].right}`,
                  ),
                )
              }
            >
              <Share2 /> Share
            </button>
          </header>
          <div className="td282-graphs">
            {(["removable", "jump", "infinite"] as BreakType[]).map(
              (type, index) => (
                <BreakCard
                  key={type}
                  index={index + 1}
                  type={type}
                  selected={selected === type}
                  markers={markers[type]}
                  onSelect={() => choose(type)}
                  onMove={(side, value) => moveMarker(type, side, value)}
                />
              ),
            )}
          </div>
        </main>
        <AnalysisPanel
          selected={selected}
          classification={classification}
          setClassification={(value) => act(() => setClassification(value))}
        />
      </section>
      <section className="td282-rules">
        <RuleCard type="removable" />
        <RuleCard type="jump" />
        <RuleCard type="infinite" />
        <div className="td282-takeaways">
          <article>
            <h3>
              <Lightbulb /> Key takeaway
            </h3>
            <p>
              A function is continuous at <i>a</i> only when
            </p>
            <output>lim x→a⁻ f(x) = lim x→a⁺ f(x) = f(a)</output>
          </article>
          <article>
            <Info /> <b>Tip:</b> Use the approach markers to explore one-sided
            limits and classify each break.
          </article>
        </div>
      </section>
      <nav className="td282-nav">
        <a href="/lessons/calculus/281-continuity-at-a-point">
          <ArrowLeft />
          <span>
            <small>Previous</small>Continuity at a Point
          </span>
        </a>
        <div>
          <small>Lesson progress</small>
          <span>
            <i />
          </span>
          <b>40%</b>
        </div>
        <a href="/lessons/calculus/283-epsilondelta-visualiser">
          <span>
            <small>Next</small>Epsilon-Delta Visualiser
          </span>
          <ArrowRight />
        </a>
      </nav>
    </section>
  );
}

function BreakCard({
  type,
  index,
  selected,
  markers,
  onSelect,
  onMove,
}: {
  type: BreakType;
  index: number;
  selected: boolean;
  markers: { left: number; right: number };
  onSelect: () => void;
  onMove: (side: "left" | "right", value: number) => void;
}) {
  return (
    <article
      className={`td282-card ${selected ? "selected" : ""}`}
      onClick={onSelect}
    >
      <header>
        <b>{index}</b>
        <div>
          <h2>{labels[type]}</h2>
          <p>
            {type === "removable"
              ? "A hole with a defined value"
              : type === "jump"
                ? "Left and right limits are finite but unequal"
                : "Vertical asymptote"}
          </p>
        </div>
      </header>
      <BreakGraph type={type} markers={markers} onMove={onMove} />
      <div className="approach">
        <span>Drag to approach</span>
        <button onClick={(event) => event.stopPropagation()}>x → a⁻</button>
        <button onClick={(event) => event.stopPropagation()}>x → a⁺</button>
      </div>
    </article>
  );
}

function BreakGraph({
  type,
  markers,
  onMove,
}: {
  type: BreakType;
  markers: { left: number; right: number };
  onMove: (side: "left" | "right", value: number) => void;
}) {
  const sx = (x: number) => 145 + x * 56;
  const drag =
    (side: "left" | "right") =>
    (event: ReactPointerEvent<SVGCircleElement>) => {
      if (event.buttons !== 1 && event.type === "pointermove") return;
      const box = event.currentTarget.ownerSVGElement?.getBoundingClientRect();
      if (!box) return;
      const x = ((event.clientX - box.left) / box.width) * 290;
      const value = (x - 145) / 56;
      onMove(
        side,
        side === "left" ? Math.min(-0.15, value) : Math.max(0.15, value),
      );
    };
  const leftT = Math.max(0, Math.min(1, (sx(markers.left) - 15) / 130));
  const rightT = Math.max(0, Math.min(1, (sx(markers.right) - 145) / 130));
  const leftY =
    type === "removable"
      ? 189 - 26.4 * markers.left * markers.left
      : type === "jump"
        ? 135 - 47 * leftT * leftT
        : 145 - 45 / Math.abs(markers.left);
  const rightY =
    type === "removable"
      ? 189 - 26.4 * markers.right * markers.right
      : type === "jump"
        ? 190 * (1 - rightT) * (1 - rightT) +
          290 * rightT * (1 - rightT) +
          140 * rightT * rightT
        : 145 - 45 / Math.abs(markers.right);
  return (
    <svg
      viewBox="0 0 290 280"
      role="img"
      aria-label={`${labels[type]} graph with draggable approach markers`}
    >
      <defs>
        <pattern
          id={`grid-${type}`}
          width="28"
          height="28"
          patternUnits="userSpaceOnUse"
        >
          <path d="M28 0H0V28" fill="none" stroke="#e8edf4" />
        </pattern>
      </defs>
      <rect width="290" height="280" fill={`url(#grid-${type})`} />
      <line className="axis" x1="10" y1="230" x2="280" y2="230" />
      <line className="axis" x1="145" y1="18" x2="145" y2="255" />
      <line className="guide" x1="145" y1="25" x2="145" y2="250" />
      {type === "removable" && (
        <>
          <path className="blue" d="M20 58 Q145 320 270 58" />
          <circle className="hole" cx="145" cy="189" r="7" />
          <circle className="filled" cx="145" cy="85" r="6" />
        </>
      )}
      {type === "jump" && (
        <>
          <path className="blue" d="M15 135 Q80 135 145 88" />
          <path className="purple" d="M145 190 Q205 145 275 140" />
          <circle className="filled" cx="145" cy="88" r="6" />
          <circle className="hole purple-hole" cx="145" cy="190" r="7" />
        </>
      )}
      {type === "infinite" && (
        <>
          <path className="blue" d="M18 145 C95 130 125 98 140 25" />
          <path className="purple" d="M150 25 C160 105 190 132 272 145" />
          <text className="infinity" x="108" y="40">
            +∞
          </text>
          <text className="infinity purple-text" x="215" y="40">
            +∞
          </text>
          <text className="infinity" x="108" y="250">
            −∞
          </text>
          <text className="infinity purple-text" x="215" y="250">
            −∞
          </text>
        </>
      )}
      <circle
        data-drag={`${type}-left`}
        className="marker left"
        cx={sx(markers.left)}
        cy={leftY}
        r="7"
        onPointerDown={drag("left")}
        onPointerMove={drag("left")}
      />
      <circle
        data-drag={`${type}-right`}
        className="marker right"
        cx={sx(markers.right)}
        cy={rightY}
        r="7"
        onPointerDown={drag("right")}
        onPointerMove={drag("right")}
      />
      <text x="276" y="222">
        x
      </text>
      <text x="155" y="20">
        y
      </text>
      <text x="141" y="248">
        a
      </text>
    </svg>
  );
}

function AnalysisPanel({
  selected,
  classification,
  setClassification,
}: {
  selected: BreakType;
  classification: BreakType;
  setClassification: (value: BreakType) => void;
}) {
  const values =
    selected === "removable"
      ? ["2", "2", "3"]
      : selected === "jump"
        ? ["2", "−1", "2"]
        : ["+∞", "+∞", "undefined"];
  const continuous = false;
  return (
    <aside className="td282-analysis">
      <h3>Selected type</h3>
      <strong>{labels[selected]}</strong>
      <div className="limits">
        <p>
          lim x→a⁻ f(x) <b>= {values[0]}</b>
        </p>
        <p>
          lim x→a⁺ f(x) <b>= {values[1]}</b>
        </p>
        <p>
          f(a) <b>= {values[2]}</b>
        </p>
      </div>
      <article>
        <h3>Continuity verdict</h3>
        <b>
          <AlertTriangle /> {continuous ? "Continuous" : "Not continuous"}
        </b>
        <p>
          {selected === "removable"
            ? "Limit exists but lim f(x) ≠ f(a)"
            : selected === "jump"
              ? "One-sided limits are unequal"
              : "At least one one-sided limit is infinite"}
        </p>
      </article>
      <section>
        <h3>Classify this break</h3>
        <p>Choose the type that matches the graph.</p>
        {(["removable", "jump", "infinite"] as BreakType[]).map((type) => (
          <label key={type} className={classification === type ? "chosen" : ""}>
            <input
              type="radio"
              name="break-classification"
              checked={classification === type}
              onChange={() => setClassification(type)}
            />
            {classification === type && classification === selected ? (
              <Check />
            ) : null}
            {type[0].toUpperCase() + type.slice(1)}
          </label>
        ))}
      </section>
      <footer>
        <b>Continuity test</b>
        <p>f is continuous at a only when</p>
        <output>lim x→a⁻ f(x) = lim x→a⁺ f(x) = f(a)</output>
      </footer>
    </aside>
  );
}

function RuleCard({ type }: { type: BreakType }) {
  const data =
    type === "removable"
      ? [
          "Hole (Removable)",
          "The two-sided limit exists, but the function value at a is missing or different.",
          "lim x→a⁻ f(x) = lim x→a⁺ f(x) = L",
          "Removable by redefining f(a) = L.",
        ]
      : type === "jump"
        ? [
            "Jump",
            "Left and right limits exist but are not equal.",
            "lim x→a⁻ f(x) = L₁ ≠ L₂ = lim x→a⁺ f(x)",
            "Not removable; true jump in value.",
          ]
        : [
            "Asymptote (Infinite)",
            "At least one one-sided limit is infinite.",
            "lim x→a⁻ f(x) = ±∞ or lim x→a⁺ f(x) = ±∞",
            "Vertical asymptote at x = a.",
          ];
  return (
    <article className={type}>
      <h2>{data[0]}</h2>
      <p>{data[1]}</p>
      <output>{data[2]}</output>
      <b>{data[3]}</b>
    </article>
  );
}
