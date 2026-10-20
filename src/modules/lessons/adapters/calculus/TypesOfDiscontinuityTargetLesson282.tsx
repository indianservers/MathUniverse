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
import { LessonTopicStudyBoard } from "../../components/LessonTopicStudyBoard";

import {discontinuityValue,type BreakType} from "./discontinuityModel";
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
      data-left-value={discontinuityValue(selected,markers[selected].left)!}
      data-right-value={discontinuityValue(selected,markers[selected].right)!}
      data-actions={actions}
    >
      <span className="sr-only">Types of discontinuity</span>
      <nav className="td282-breadcrumb" aria-label="Target breadcrumb">
        <span>Home</span>
        <b>›</b>
        <span>Lessons</span>
        <b>›</b>
        <span>Calculus</span>
        <b>›</b>
        <strong>282 Types of Discontinuity</strong>
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
      <LessonTopicStudyBoard lessonId={282} view={tab} onInteraction={onInteraction} />

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
      <p>{type==='removable'?'f(x) = 2 + x²/4 for x ≠ 0; f(0) = 3':type==='jump'?'f(x) = 2 + x²/4 for x ≤ 0; −1 + x/4 for x > 0':'f(x) = 1/x²; f(0) is undefined'}</p><output aria-label={`${type} left value`}>Left: x = {markers.left}, f(x) = {discontinuityValue(type,markers.left)!.toFixed(3)}</output><output aria-label={`${type} right value`}>Right: x = {markers.right}, f(x) = {discontinuityValue(type,markers.right)!.toFixed(3)}</output>
      {type==='infinite'&&<p>Markers at the top edge indicate values above the visible y-range.</p>}
      <div className="approach">
        <span>Drag to approach</span>
        <button aria-label={`Approach ${type} from left`} onClick={event=>{event.stopPropagation();onSelect();onMove("left",Math.min(-.15,markers.left/2));}}>x → a⁻</button>
        <button aria-label={`Approach ${type} from right`} onClick={event=>{event.stopPropagation();onSelect();onMove("right",Math.max(.15,markers.right/2));}}>x → a⁺</button>
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
      const matrix = event.currentTarget.ownerSVGElement?.getScreenCTM();
      if (!matrix) return;
      const x = new DOMPoint(event.clientX,event.clientY).matrixTransform(matrix.inverse()).x;
      const value = (x - 145) / 56;
      onMove(
        side,
        side === "left" ? Math.max(-2.3,Math.min(-0.15, value)) : Math.min(2.3,Math.max(0.15, value)),
      );
    };
  const sy=(value:number)=>230-40*value;
  const valueAt=(x:number)=>discontinuityValue(type,x)!;
  const curve=(from:number,to:number)=>Array.from({length:81},(_,index)=>{const x=from+(to-from)*index/80;return `${sx(x)},${sy(valueAt(x))}`;}).join(' ');
  const leftY=Math.max(15,Math.min(270,sy(valueAt(markers.left))));
  const rightY=Math.max(15,Math.min(270,sy(valueAt(markers.right))));
  return (
    <svg
      viewBox="0 0 290 280"
      role="group"
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
      <polyline points={curve(-2.3,-.05)} fill="none" stroke="#187ac5" strokeWidth="3"/>
      <polyline points={curve(.05,2.3)} fill="none" stroke="#884ac9" strokeWidth="3"/>
      {type==='removable'&&<><circle className="hole" cx="145" cy={sy(2)} r="7"/><circle className="filled" cx="145" cy={sy(3)} r="6"/></>}
      {type==='jump'&&<><circle className="filled" cx="145" cy={sy(2)} r="6"/><circle className="hole purple-hole" cx="145" cy={sy(-1)} r="7"/></>}
      {type==='infinite'&&<><text x="105" y="20">+∞</text><text x="175" y="20">+∞</text></>}
      {[0,1,2,3,4].map(value=><text key={value} x="150" y={sy(value)-4} fontSize="10">{value}</text>)}
      <circle
        data-drag={`${type}-left`} role="button" tabIndex={0} aria-label={`Move ${type} left approach marker. Use arrow keys.`} onKeyDown={event=>{if(event.key==='ArrowLeft'||event.key==='ArrowRight'){event.preventDefault();const next=markers.left+(event.key==='ArrowRight' ? .1 : -.1);onMove('left',Math.max(-2.3,Math.min(-.15,next)));}}}
        className="marker left"
        cx={sx(markers.left)}
        cy={leftY}
        r="7"
        onPointerDown={event=>{event.preventDefault();event.currentTarget.focus();event.currentTarget.setPointerCapture(event.pointerId);drag("left")(event);}}
        onPointerMove={drag("left")}
      />
      <circle
        data-drag={`${type}-right`} role="button" tabIndex={0} aria-label={`Move ${type} right approach marker. Use arrow keys.`} onKeyDown={event=>{if(event.key==='ArrowLeft'||event.key==='ArrowRight'){event.preventDefault();const next=markers.right+(event.key==='ArrowRight' ? .1 : -.1);onMove('right',Math.min(2.3,Math.max(.15,next)));}}}
        className="marker right"
        cx={sx(markers.right)}
        cy={rightY}
        r="7"
        onPointerDown={event=>{event.preventDefault();event.currentTarget.focus();event.currentTarget.setPointerCapture(event.pointerId);drag("right")(event);}}
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
        <h3>Classify this break</h3><p role="status">{classification===selected ? "Correct classification." : "Try again: compare the one-sided limits."}</p>
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
