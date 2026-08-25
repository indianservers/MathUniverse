import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Languages,
  RotateCcw,
  Share2,
} from "lucide-react";
import { useEffect, useRef, useState, type DragEvent } from "react";
import type { LessonAdapterProps } from "../types";
import "./RealNumbersTargetLesson62.css";

type RealItem = {
  id: string;
  label: string;
  value: number;
  irrational: boolean;
};
const ITEMS: RealItem[] = [
  { id: "negative-five", label: "-5", value: -5, irrational: false },
  { id: "eleven", label: "11", value: 11, irrational: false },
  { id: "root-two", label: "√2", value: Math.sqrt(2), irrational: true },
  { id: "pi", label: "π", value: Math.PI, irrational: true },
  { id: "decimal", label: "0.75", value: 0.75, irrational: false },
];
const INITIAL_PLACEMENTS = Object.fromEntries(
  ITEMS.map((item) => [item.id, item.value]),
) as Record<string, number>;

export default function RealNumbersTargetLesson62({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [selectedId, setSelectedId] = useState("negative-five"),
    [placements, setPlacements] = useState(INITIAL_PLACEMENTS),
    [dragging, setDragging] = useState("");
  const [placementStatus, setPlacementStatus] = useState(
      "All cards are placed correctly.",
    ),
    [tab, setTab] = useState("Interaction + visualization"),
    [language, setLanguage] = useState("English (English)");
  const [workspace, setWorkspace] = useState(false),
    [shareState, setShareState] = useState("Share"),
    [actions, setActions] = useState(0);
  const axisRef = useRef<HTMLDivElement>(null),
    selected = ITEMS.find((item) => item.id === selectedId) ?? ITEMS[0];
  const isInteger = Number.isInteger(selected.value),
    isWhole = isInteger && selected.value >= 0,
    isNatural = isInteger && selected.value >= 1,
    isRational = !selected.irrational;
  const relation =
    selected.value === 11 ? "=" : selected.value < 11 ? "<" : ">";
  const placementCorrect = ITEMS.every(
    (item) => Math.abs(placements[item.id] - item.value) < 0.26,
  );
  const act = () => {
    setActions((value) => value + 1);
    onInteraction();
  };
  const select = (id: string) => {
    setSelectedId(id);
    act();
  };
  const reset = () => {
    setSelectedId("negative-five");
    setPlacements(INITIAL_PLACEMENTS);
    setDragging("");
    setPlacementStatus("All cards are placed correctly.");
    setTab("Interaction + visualization");
    setLanguage("English (English)");
    setWorkspace(false);
    setShareState("Share");
    setActions(0);
    onInteraction();
  };
  useEffect(() => {
    setSelectedId("negative-five");
    setPlacements(INITIAL_PLACEMENTS);
    setDragging("");
    setPlacementStatus("All cards are placed correctly.");
    setTab("Interaction + visualization");
    setLanguage("English (English)");
    setWorkspace(false);
    setShareState("Share");
    setActions(0);
  }, [resetToken]);
  const drop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const id = event.dataTransfer.getData("text/plain") || dragging,
      item = ITEMS.find((candidate) => candidate.id === id),
      rect = axisRef.current?.getBoundingClientRect();
    if (!item || !rect) return;
    const value =
      -6 +
      Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width)) * 18;
    setPlacements((current) => ({ ...current, [id]: value }));
    setSelectedId(id);
    const correct = Math.abs(value - item.value) < 0.26;
    setPlacementStatus(
      correct
        ? `${item.label} is placed correctly.`
        : `Move ${item.label} to ${formatValue(item.value)} on the number line.`,
    );
    setDragging("");
    act();
  };
  const share = async () => {
    try {
      await navigator.clipboard?.writeText(
        `${selected.label} is ${selected.irrational ? "irrational" : "rational"} and real.`,
      );
      setShareState("Copied");
    } catch {
      setShareState("Ready");
    }
    act();
  };
  return (
    <div
      className="real-page"
      data-testid="number-mockup-0044"
      data-dedicated-lesson="62"
      data-object-model="selected-real-number-hierarchy-classification-draggable-number-line-placement-comparison-model"
      data-selected={selected.label}
      data-selected-id={selectedId}
      data-natural={isNatural}
      data-whole={isWhole}
      data-integer={isInteger}
      data-rational={isRational}
      data-irrational={selected.irrational}
      data-real="true"
      data-relation={relation}
      data-placement-correct={placementCorrect}
      data-placements={ITEMS.map(
        (item) => `${item.id}:${placements[item.id].toFixed(2)}`,
      ).join(",")}
      data-tab={tab}
      data-language={language}
      data-workspace={workspace}
      data-actions={actions}
    >
      <span className="sr-only">
        Concept trace: Real number-line placement. Real numbers lie on the
        number line.
      </span>
      <nav className="real-breadcrumb">
        <a href="/">
          <ArrowLeft />
        </a>
        <a href="/">Home</a>
        <span>›</span>
        <a href="/lessons">Lessons</a>
        <span>›</span>
        <a href="/lessons/numbers-and-arithmetic">Numbers And Arithmetic</a>
        <span>›</span>
        <b>62 Real Numbers</b>
      </nav>
      <header className="real-hero">
        <nav>
          <b>NUMBERS AND ARITHMETIC</b>
          <b>NUMBERS AND NUMBER THEORY</b>
        </nav>
        <h1>Real Numbers</h1>
        <p>Unify rational and irrational numbers.</p>
        <div>
          <b>♙ Foundational-Intermediate</b>
          <b>ϟ Concept + Manipulative</b>
          <b>▣ Numbers and Number Theory</b>
          <b>◷ 6-10 min</b>
        </div>
        <aside>
          <button
            type="button"
            onClick={() => {
              setLanguage((value) =>
                value.startsWith("English")
                  ? "Hindi (हिन्दी)"
                  : "English (English)",
              );
              act();
            }}
          >
            <Languages />
            {language}
            <span>⌄</span>
          </button>
          <button type="button" onClick={reset}>
            <RotateCcw />
            Reset
          </button>
          <button type="button" onClick={() => void share()}>
            <Share2 />
            {shareState}
          </button>
          <button
            type="button"
            className={workspace ? "active" : ""}
            onClick={() => {
              setWorkspace((value) => !value);
              act();
            }}
          >
            ↗ Workspace
          </button>
        </aside>
      </header>
      <nav className="real-tabs">
        {[
          "Interaction + visualization",
          "Explain",
          "Examples",
          "Formulas",
          "Know more",
        ].map((label) => (
          <button
            type="button"
            className={tab === label ? "active" : ""}
            onClick={() => {
              setTab(label);
              act();
            }}
            key={label}
          >
            ⊙ {label}
          </button>
        ))}
      </nav>
      <main className="real-layout">
        <section className="real-work">
          <header>
            <small>THE REAL NUMBER SYSTEM</small>
            <p>
              Real numbers are the union of rational and irrational numbers.
            </p>
          </header>
          <section className="number-hierarchy">
            <article className="real-set">
              <h2>Real Numbers</h2>
              <p>Real = Rational ∪ Irrational</p>
            </article>
            <div className="hierarchy-arrows">
              <i />
              <i />
            </div>
            <article className="rational-set">
              <h2>Rational Numbers</h2>
              <p>
                Numbers that can be written as <i>p/q</i>,<br />
                where p, q are integers and q ≠ 0.
              </p>
              <section>
                <h3>
                  <button type="button" onClick={() => select("negative-five")}>
                    -5
                  </button>{" "}
                  Integers
                </h3>
                <p>..., -3, -2, -1, 0, 1, 2, 3, ...</p>
                <section>
                  <h3>Whole Numbers</h3>
                  <p>0, 1, 2, 3, ...</p>
                  <section>
                    <h3>Natural Numbers</h3>
                    <p>1, 2, 3, ...</p>
                  </section>
                </section>
              </section>
            </article>
            <article className="irrational-set">
              <h2>Irrational Numbers</h2>
              <p>
                Numbers that cannot be written as <i>p/q</i>.
              </p>
            </article>
          </section>
          <section className="real-number-line">
            <h2>Real Number Line</h2>
            <p>Every real number has a position on the number line.</p>
            <div
              className="real-axis"
              ref={axisRef}
              onDragOver={(event) => event.preventDefault()}
              onDrop={drop}
            >
              <i />
              {Array.from({ length: 19 }, (_, index) => index - 6).map(
                (value) => (
                  <span
                    style={{ left: `${((value + 6) / 18) * 100}%` }}
                    key={value}
                  >
                    {value}
                  </span>
                ),
              )}
              {ITEMS.map((item) => (
                <button
                  type="button"
                  className={item.irrational ? "irrational" : "rational"}
                  style={{ left: `${((placements[item.id] + 6) / 18) * 100}%` }}
                  onClick={() => select(item.id)}
                  key={item.id}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </section>
          <section className="real-sort">
            <h2>Sort these numbers on the real number line</h2>
            <p>Drag the cards to place each number at its correct position.</p>
            <nav>
              {ITEMS.map((item) => (
                <button
                  type="button"
                  draggable
                  className={selectedId === item.id ? "selected" : ""}
                  onClick={() => select(item.id)}
                  onDragStart={(event) => {
                    event.dataTransfer.setData("text/plain", item.id);
                    event.dataTransfer.effectAllowed = "move";
                    setDragging(item.id);
                  }}
                  key={item.id}
                >
                  <span>⠿</span>
                  {item.label}
                </button>
              ))}
            </nav>
            <output className={placementCorrect ? "correct" : "wrong"}>
              {placementStatus}
            </output>
          </section>
        </section>
        <aside className="real-side">
          <section className="selected-real">
            <h2>Selected value: {selected.label}</h2>
            <strong>{selected.label}</strong>
            <p>
              Every real number has a<br />
              position on the number line.
            </p>
          </section>
          <section className="real-compare">
            <h2>Compare</h2>
            <strong>
              {selected.label} {relation} 11
            </strong>
          </section>
          <section className="classification">
            <h2>Classification of {selected.label}</h2>
            {[
              ["Natural Numbers", isNatural],
              ["Whole Numbers", isWhole],
              ["Integers", isInteger],
              ["Rational Numbers", isRational],
              ["Irrational Numbers", selected.irrational],
              ["Real Numbers", true],
            ].map(([label, yes]) => (
              <p className={yes ? "yes" : "no"} key={label as string}>
                <span>{label as string}</span>
                <b>{yes ? "Yes" : "No"}</b>
              </p>
            ))}
          </section>
          <section className="real-fact">
            <h2>Did you know?</h2>
            <p>
              {selected.label} is {isInteger ? "integer, " : ""}
              {isRational ? "rational" : "irrational"}, and real
            </p>
            <p>
              √2 and π are irrational
              <br />
              real numbers
            </p>
          </section>
          <section className="real-practice">
            <h2>Try:</h2>
            <p>Is every rational number real?</p>
            <strong>Yes.</strong>
            <CheckCircle2 />
          </section>
        </aside>
      </main>
      <nav className="real-navigation">
        <a href="/lessons/numbers-and-arithmetic/61-irrational-numbers">
          <ArrowLeft />
          <span>
            PREVIOUS<b>Irrational Numbers</b>
          </span>
        </a>
        <a href="/lessons/numbers-and-arithmetic/63-complex-numbers">
          <span>
            NEXT<b>Complex Numbers</b>
          </span>
          <ArrowRight />
        </a>
      </nav>
      <footer className="real-footer">
        <h3>✧ Math Universe</h3>
        <p>
          Interactive math labs, visual proofs, NCERT explorations, graphing,
          CAS-style tools, and classroom-ready activities.
        </p>
        <nav>
          <button type="button">▣ Sitemap</button>
          <button type="button">⚑ Docs</button>
          <button type="button">✉ About</button>
        </nav>
        <hr />
        <small>
          © 2026 INDIAN SERVERS PRIVATE LIMITED. NO RIGHT TO REPRODUCE IT.
        </small>
        <small>www.IndianServers.com info@IndianServers.com</small>
      </footer>
    </div>
  );
}
function formatValue(value: number) {
  return Number.isInteger(value) ? `${value}` : value.toFixed(2);
}
