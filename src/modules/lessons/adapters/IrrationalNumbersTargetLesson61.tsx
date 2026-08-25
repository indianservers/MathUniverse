import {
  ArrowLeft,
  ArrowRight,
  Languages,
  Lightbulb,
  RotateCcw,
  Share2,
  TriangleAlert,
} from "lucide-react";
import { useEffect, useMemo, useState, type DragEvent } from "react";
import type { LessonAdapterProps } from "../types";
import "./IrrationalNumbersTargetLesson61.css";

type SortItem = { id: string; label: string; irrational: boolean };
const BASE_ITEMS: SortItem[] = [
  { id: "three-halves", label: "3/2", irrational: false },
  { id: "decimal", label: "0.75", irrational: false },
  { id: "negative", label: "-4", irrational: false },
  { id: "selected-root", label: "√2", irrational: true },
  { id: "pi", label: "π", irrational: true },
  { id: "root-five", label: "√5", irrational: true },
];

export default function IrrationalNumbersTargetLesson61({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [radicand, setRadicand] = useState(2),
    [tab, setTab] = useState("Interaction + visualization"),
    [language, setLanguage] = useState("English (English)");
  const [workspace, setWorkspace] = useState(false),
    [shareState, setShareState] = useState("Share"),
    [actions, setActions] = useState(0);
  const [assignments, setAssignments] = useState<
    Record<string, "rational" | "irrational">
  >(() =>
    Object.fromEntries(
      BASE_ITEMS.map((item) => [
        item.id,
        item.irrational ? "irrational" : "rational",
      ]),
    ),
  );
  const [dragging, setDragging] = useState(""),
    [sortStatus, setSortStatus] = useState("All values are sorted correctly."),
    [practice, setPractice] = useState<"" | "yes" | "no">("");
  const root = Math.sqrt(radicand),
    lower = Math.floor(root),
    upper = Math.ceil(root),
    lowerSquare = lower * lower,
    upperSquare = upper * upper;
  const items = useMemo(
    () =>
      BASE_ITEMS.map((item) =>
        item.id === "selected-root"
          ? {
              ...item,
              label: `√${radicand}`,
              irrational: !Number.isInteger(root),
            }
          : item,
      ),
    [radicand, root],
  );
  const rationalItems = items.filter(
      (item) => assignments[item.id] === "rational",
    ),
    irrationalItems = items.filter(
      (item) => assignments[item.id] === "irrational",
    );
  const sortCorrect = items.every(
    (item) =>
      assignments[item.id] === (item.irrational ? "irrational" : "rational"),
  );
  const act = () => {
    setActions((value) => value + 1);
    onInteraction();
  };
  const choose = (value: number) => {
    setRadicand(value);
    setAssignments((current) => ({
      ...current,
      "selected-root": Number.isInteger(Math.sqrt(value))
        ? "rational"
        : "irrational",
    }));
    setSortStatus(
      `√${value} is ${Number.isInteger(Math.sqrt(value)) ? "rational" : "irrational"}.`,
    );
    act();
  };
  const reset = () => {
    setRadicand(2);
    setTab("Interaction + visualization");
    setLanguage("English (English)");
    setWorkspace(false);
    setShareState("Share");
    setAssignments(
      Object.fromEntries(
        BASE_ITEMS.map((item) => [
          item.id,
          item.irrational ? "irrational" : "rational",
        ]),
      ),
    );
    setDragging("");
    setSortStatus("All values are sorted correctly.");
    setPractice("");
    setActions(0);
    onInteraction();
  };
  useEffect(() => {
    setRadicand(2);
    setTab("Interaction + visualization");
    setLanguage("English (English)");
    setWorkspace(false);
    setShareState("Share");
    setAssignments(
      Object.fromEntries(
        BASE_ITEMS.map((item) => [
          item.id,
          item.irrational ? "irrational" : "rational",
        ]),
      ),
    );
    setDragging("");
    setSortStatus("All values are sorted correctly.");
    setPractice("");
    setActions(0);
  }, [resetToken]);
  const drop = (zone: "rational" | "irrational", id = dragging) => {
    const item = items.find((candidate) => candidate.id === id);
    if (!item) return;
    setAssignments((current) => ({ ...current, [id]: zone }));
    const correct = zone === (item.irrational ? "irrational" : "rational");
    setSortStatus(
      correct
        ? `${item.label} is sorted correctly.`
        : `Try again: ${item.label} does not belong with ${zone} numbers.`,
    );
    setDragging("");
    act();
  };
  const share = async () => {
    try {
      await navigator.clipboard?.writeText(
        `√${radicand} ≈ ${root.toFixed(10)}`,
      );
      setShareState("Copied");
    } catch {
      setShareState("Ready");
    }
    act();
  };
  return (
    <div
      className="irrational-page"
      data-testid="number-mockup-0043"
      data-dedicated-lesson="61"
      data-object-model="radicand-perfect-square-bounds-geometric-diagonal-number-line-decimal-sort-comparison-model"
      data-radicand={radicand}
      data-root={root}
      data-lower={lower}
      data-upper={upper}
      data-lower-square={lowerSquare}
      data-upper-square={upperSquare}
      data-sort-correct={sortCorrect}
      data-rational={rationalItems.map((item) => item.label).join(",")}
      data-irrational={irrationalItems.map((item) => item.label).join(",")}
      data-tab={tab}
      data-language={language}
      data-workspace={workspace}
      data-practice={practice}
      data-actions={actions}
    >
      <span className="sr-only">
        Concept trace: Irrational square-root check. Non-ending, non-repeating
        decimals are irrational.
      </span>
      <nav className="irrational-breadcrumb">
        <a href="/">
          <ArrowLeft />
        </a>
        <a href="/">Home</a>
        <span>›</span>
        <a href="/lessons">Lessons</a>
        <span>›</span>
        <a href="/lessons/numbers-and-arithmetic">Numbers And Arithmetic</a>
        <span>›</span>
        <b>61 Irrational Numbers</b>
      </nav>
      <header className="irrational-hero">
        <nav>
          <b>NUMBERS AND ARITHMETIC</b>
          <b>NUMBERS AND NUMBER THEORY</b>
        </nav>
        <h1>Irrational Numbers</h1>
        <p>Visualise non-terminating, non-repeating values.</p>
        <h2>
          Selected value: <span>√{radicand}</span>
        </h2>
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
      <nav className="irrational-tabs">
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
      <main className="irrational-shell">
        <header>
          <small>INTERACTION • VISUALIZATION</small>
          <h2>Explore √{radicand}</h2>
        </header>
        <div className="irrational-layout">
          <section className="irrational-work">
            <section className="irrational-top">
              <article className="geometry-model">
                <h3>1. Geometric construction</h3>
                <p>Diagonal of a unit square.</p>
                <svg
                  viewBox="0 0 250 230"
                  role="img"
                  aria-label={`Geometric construction for square root of ${radicand}`}
                >
                    <rect x="19" y="17" width="170" height="170" />
                    <line x1="19" y1="187" x2="189" y2="17" />
                    <circle cx="19" cy="17" r="3" />
                    <circle cx="189" cy="17" r="3" />
                    <circle cx="19" cy="187" r="3" />
                    <circle cx="189" cy="187" r="3" />
                  <text x="7" y="124">
                    1
                  </text>
                  <text x="116" y="235">
                    1
                  </text>
                    <text x="108" y="135">
                    √{radicand}
                  </text>
                </svg>
              </article>
              <article className="root-line-model">
                <h3>2. Place √{radicand} on the number line</h3>
                <p>
                  √{radicand} lies between {lower} and {upper}.
                </p>
                <svg viewBox="0 0 310 210">
                      <path d="M-47 95 Q23 25 93 95 M83 88 L93 95 L87 84" />
                  <line x1="25" y1="145" x2="290" y2="145" />
                  {[
                    0, 0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2, 2.25, 2.5, 2.75,
                    3,
                  ].map((value) => (
                    <line
                      key={value}
                      x1={25 + (value / 3) * 265}
                      x2={25 + (value / 3) * 265}
                      y1="139"
                      y2="151"
                    />
                  ))}
                  <line
                    className="root-marker"
                    x1={25 + (Math.min(3, root) / 3) * 265}
                    x2={25 + (Math.min(3, root) / 3) * 265}
                    y1="88"
                    y2="145"
                  />
                  <circle
                    className="root-dot"
                    cx={25 + (Math.min(3, root) / 3) * 265}
                    cy="145"
                    r="5"
                  />
                  <text x={18 + (Math.min(3, root) / 3) * 265} y="78">
                    √{radicand}
                  </text>
                  <text x="22" y="173">
                    0
                  </text>
                  <text x="108" y="173">
                    1
                  </text>
                  <text x="197" y="173">
                    2
                  </text>
                  <text x="285" y="173">
                    3
                  </text>
                  <text x={10 + (Math.min(3, root) / 3) * 265} y="195">
                    {root.toFixed(2)}
                  </text>
                </svg>
              </article>
            </section>
            <section className="decimal-zoom">
              <h3>3. Decimal zoom</h3>
              <p>
                √{radicand} ≈ {root.toFixed(10)}...
              </p>
              <div>
                {root
                  .toFixed(10)
                  .split("")
                  .map((digit, index) => (
                    <b key={`${digit}-${index}`}>{digit}</b>
                  ))}
                <b>...</b>
                <button
                  type="button"
                  onClick={() => {
                    choose(radicand === 2 ? 5 : 2);
                  }}
                >
                  ⌕
                </button>
              </div>
              <footer>
                <span>ⓧ Not a ratio of two integers</span>
                <span>∞ No repeating block</span>
              </footer>
            </section>
            <section className="root-compare">
              <h3>4. Compare</h3>
              <div>
                {root.toFixed(2)} <strong>&lt;</strong> <b>√{radicand}</b>{" "}
                <strong>&lt;</strong> {(root + 0.01).toFixed(2)}
              </div>
            </section>
            <section className="root-sort">
              <h3>5. Sort into Rational vs Irrational</h3>
              <div>
                <SortZone
                  kind="rational"
                  items={rationalItems}
                  dragging={dragging}
                  setDragging={setDragging}
                  onDrop={(id) => drop("rational", id)}
                />
                <SortZone
                  kind="irrational"
                  items={irrationalItems}
                  dragging={dragging}
                  setDragging={setDragging}
                  onDrop={(id) => drop("irrational", id)}
                />
              </div>
              <output className={sortCorrect ? "correct" : "wrong"}>
                {sortStatus}
              </output>
              <footer>
                ⓘ Rational numbers are fractions or integers. Irrational numbers
                have non-terminating, non-repeating decimals.
              </footer>
            </section>
          </section>
          <aside className="irrational-side">
            <section className="radicand-select">
              <h2>Select radicand</h2>
              <select
                aria-label="Select radicand"
                value={radicand}
                onChange={(event) => choose(Number(event.target.value))}
              >
                {[2, 3, 5, 7, 8, 9, 10].map((value) => (
                  <option key={value}>{value}</option>
                ))}
              </select>
            </section>
            <section className="square-bounds">
              <h2>Nearest perfect squares</h2>
              <div>
                <article>
                  <span>
                    {lower}² = {lowerSquare}
                  </span>
                  <b>{lower}</b>
                </article>
                <article>
                  <span>
                    {upper}² = {upperSquare}
                  </span>
                  <b>{upper}</b>
                </article>
              </div>
              <strong>
                {lowerSquare} &lt; {radicand} &lt; {upperSquare}
              </strong>
            </section>
            <section className="root-approx">
              <h2>Approximation</h2>
              <strong>
                √{radicand} ≈ {root.toFixed(10)}...
              </strong>
              <p>(correct to 10 d.p.)</p>
            </section>
            <section className="rounding-warning">
              <TriangleAlert />
              <div>
                <h2>
                  Decimal rounding
                  <br />
                  misconception
                </h2>
                <p>
                  Rounding does not make an irrational number rational.
                  <br />
                  No fraction equals √{radicand}.
                </p>
                <footer>
                  Example: {root.toFixed(3)} ≠ √{radicand}
                </footer>
              </div>
            </section>
            <section className="root-practice">
              <Lightbulb />
              <p>
                Perfect squares give exact roots; non-perfect squares usually do
                not.
              </p>
              <h3>Try: Is √9 irrational?</h3>
              <div>
                <button
                  className={practice === "yes" ? "wrong" : ""}
                  type="button"
                  onClick={() => {
                    setPractice("yes");
                    act();
                  }}
                >
                  Yes
                </button>
                <button
                  className={practice === "no" ? "active" : ""}
                  type="button"
                  onClick={() => {
                    setPractice("no");
                    act();
                  }}
                >
                  No.
                </button>
              </div>
            </section>
          </aside>
        </div>
        <footer className="irrational-tags">
          <span>☷ primary-control</span>
          <span>▣ number</span>
        </footer>
      </main>
      <nav className="irrational-navigation">
        <a href="/lessons/numbers-and-arithmetic/60-rational-numbers">
          <ArrowLeft />
          <span>
            PREVIOUS<b>Rational Numbers</b>
          </span>
        </a>
        <a href="/lessons/numbers-and-arithmetic/62-real-numbers">
          <span>
            NEXT<b>Real Numbers</b>
          </span>
          <ArrowRight />
        </a>
      </nav>
      <footer className="irrational-footer">
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
function startDrag(
  event: DragEvent<HTMLButtonElement>,
  id: string,
  setDragging: (id: string) => void,
) {
  event.dataTransfer.setData("text/plain", id);
  event.dataTransfer.effectAllowed = "move";
  setDragging(id);
}
function SortZone({
  kind,
  items,
  dragging,
  setDragging,
  onDrop,
}: {
  kind: "rational" | "irrational";
  items: SortItem[];
  dragging: string;
  setDragging: (id: string) => void;
  onDrop: (id: string) => void;
}) {
  return (
    <section
      className={`${kind}-sort-zone`}
      data-drop-active={Boolean(dragging)}
      onDragOver={(event) => event.preventDefault()}
      onDrop={(event) => {
        event.preventDefault();
        onDrop(event.dataTransfer.getData("text/plain"));
      }}
    >
      <h4>{kind === "rational" ? "Rational Numbers" : "Irrational Numbers"}</h4>
      <p>
        {kind === "rational"
          ? "Can be written as a ratio a/b."
          : "Cannot be written as a ratio a/b."}
      </p>
      <nav>
        {items.map((item) => (
          <button
            type="button"
            draggable
            onDragStart={(event) => startDrag(event, item.id, setDragging)}
            key={item.id}
          >
            {item.label}
          </button>
        ))}
      </nav>
    </section>
  );
}
