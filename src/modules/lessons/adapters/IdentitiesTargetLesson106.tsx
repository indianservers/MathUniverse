import { useEffect, useMemo, useState, type DragEvent } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CircleAlert,
  ExternalLink,
  Grid3X3,
  Languages,
  RotateCcw,
  Share2,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import type { LessonAdapterProps } from "../types";
import {
  IDENTITY_PRACTICES_106 as practices,
  IDENTITY_TILES_106 as tiles,
  calculateSquareIdentity106,
  identityPracticeExpansion106,
  isIdentityPracticeCorrect106,
  isIdentityTileDrop106,
  sampleSquareIdentity106,
  type IdentityTile106 as Tile,
} from "./identitiesLesson106Model";
import "./IdentitiesTargetLesson106.css";
import { LessonTopicStudyBoard } from "../components/LessonTopicStudyBoard";

type IdentityTab106 =
  | "Interaction + visualization"
  | "Explain"
  | "Examples"
  | "Formulas"
  | "Know more";

export default function IdentitiesTargetLesson106({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [xValue, setXValue] = useState(5);
  const [showParts, setShowParts] = useState(true);
  const [combineTerms, setCombineTerms] = useState(true);
  const [testSamples, setTestSamples] = useState(true);
  const [tab, setTab] = useState<IdentityTab106>("Interaction + visualization");
  const [language, setLanguage] = useState("en");
  const [shareCount, setShareCount] = useState(0);
  const [whyOpen, setWhyOpen] = useState(false);
  const [dragging, setDragging] = useState("");
  const [partDrops, setPartDrops] = useState<string[]>([]);
  const [invalidDrop, setInvalidDrop] = useState("");
  const [practiceIndex, setPracticeIndex] = useState(0);
  const [practiceAnswer, setPracticeAnswer] = useState(practices[0].answer);
  const [practiceChecked, setPracticeChecked] = useState(true);
  const [practiceArea, setPracticeArea] = useState(false);
  const [actions, setActions] = useState(0);
  const sampleValues = useMemo(() => [0, 3, xValue], [xValue]);
  const area = calculateSquareIdentity106(xValue);
  const sampleResults = sampleSquareIdentity106(sampleValues);
  const samplesMatch = sampleResults.every((result) => result.matches);
  const practice = practices[practiceIndex];
  const practiceExpansion = identityPracticeExpansion106(practice);
  const practiceCorrect = isIdentityPracticeCorrect106(
    practiceAnswer,
    practice,
  );
  const copy =
    language === "hi"
      ? {
          title: "सर्वसमिकाएँ",
          description: "सर्वसमिका हर अनुमत मान के लिए सत्य होती है।",
          lab: "क्षेत्रफल मॉडल से सर्वसमिका सिद्ध करें",
          practice: "अभ्यास",
        }
      : {
          title: "Identities",
          description:
            "An identity is true for every allowed value, not just one solution.",
          lab: "Prove the identity with an area model",
          practice: "Practice",
        };
  const act = () => {
    setActions((count) => count + 1);
    onInteraction();
  };
  const reset = (notify = true) => {
    setXValue(5);
    setShowParts(true);
    setCombineTerms(true);
    setTestSamples(true);
    setTab("Interaction + visualization");
    setLanguage("en");
    setShareCount(0);
    setWhyOpen(false);
    setDragging("");
    setPartDrops([]);
    setInvalidDrop("");
    setPracticeIndex(0);
    setPracticeAnswer(practices[0].answer);
    setPracticeChecked(true);
    setPracticeArea(false);
    setActions(0);
    if (notify) onInteraction();
  };
  useEffect(() => reset(false), [resetToken]); // eslint-disable-line react-hooks/exhaustive-deps
  const startDrag = (event: DragEvent<HTMLButtonElement>, tile: Tile) => {
    event.dataTransfer.setData("text/identity-area-tile", tile.id);
    setDragging(tile.id);
    setInvalidDrop("");
    act();
  };
  const dropPart = (event: DragEvent<HTMLElement>) => {
    event.preventDefault();
    const id = event.dataTransfer.getData("text/identity-area-tile");
    if (isIdentityTileDrop106(id)) {
      setPartDrops((current) =>
        current.includes(id) ? current : [...current, id],
      );
      setInvalidDrop("");
    } else setInvalidDrop(id || "unknown");
    setDragging("");
    act();
  };
  const movePractice = (direction: number) => {
    const next =
      (practiceIndex + direction + practices.length) % practices.length;
    setPracticeIndex(next);
    setPracticeAnswer("");
    setPracticeChecked(false);
    setPracticeArea(false);
    act();
  };
  const shareLesson = async () => {
    const shareData = {
      title: "Identities",
      text: "Explore (x + 2)² = x² + 4x + 4 with an area model.",
      url: window.location.href,
    };
    try {
      if (navigator.share) await navigator.share(shareData);
      else
        await navigator.clipboard?.writeText(
          `${shareData.text} ${shareData.url}`,
        );
      setShareCount((count) => count + 1);
      act();
    } catch {
      // Dismissing the native share sheet leaves the lesson unchanged.
    }
  };

  return (
    <div
      className="identity106-page"
      data-testid="algebra-mockup-0163"
      data-dedicated-lesson="106"
      data-object-model="dedicated-tested-dynamic-square-area-partition-validated-draggable-region-symbolic-combination-sample-equivalence-calculated-graded-practice-functional-tabs-language-and-native-sharing-model"
      data-x-value={xValue}
      data-side={area.side}
      data-area-x2={area.xSquared}
      data-area-2x={area.rectangle}
      data-area-four={area.constantSquared}
      data-area-total={area.squareTotal}
      data-uncombined="x² + 2x + 2x + 4"
      data-combined="x² + 4x + 4"
      data-samples={sampleResults
        .map((result) => `${result.value}:${result.left}:${result.right}`)
        .join(",")}
      data-samples-match={samplesMatch}
      data-show-parts={showParts}
      data-combine-terms={combineTerms}
      data-test-samples={testSamples}
      data-tab={tab}
      data-language={language}
      data-share-count={shareCount}
      data-why-open={whyOpen}
      data-dragging={dragging}
      data-part-drops={partDrops.join(",")}
      data-invalid-drop={invalidDrop}
      data-practice-index={practiceIndex}
      data-practice-expected={practiceExpansion}
      data-practice-answer={practiceAnswer}
      data-practice-correct={practiceChecked && practiceCorrect}
      data-practice-area={practiceArea}
      data-actions={actions}
    >
      <nav className="identity106-breadcrumb">
        <a href="/">Home</a>
        <span>&gt;</span>
        <a href="/lessons">Lessons</a>
        <span>&gt;</span>
        <a href="/lessons/algebra">Algebra</a>
        <span>&gt;</span>
        <b>106 Identities</b>
      </nav>
      <header className="identity106-intro">
        <section>
          <small>
            <b>ALGEBRA</b>
            <b>EXPRESSIONS AND MANIPULATION</b>
          </small>
          <h1>{copy.title}</h1>
          <p>{copy.description}</p>
          <nav>
            <b>Intermediate Algebra</b>
            <b>Proof diagram</b>
            <b>6-10 min</b>
          </nav>
          <aside>
            <label>
              <Languages />
              <select
                aria-label="Lesson language"
                value={language}
                onChange={(event) => {
                  setLanguage(event.target.value);
                  act();
                }}
              >
                <option value="en">English (English)</option>
                <option value="hi">Hindi (हिन्दी)</option>
              </select>
            </label>
            <button type="button" onClick={() => reset()}>
              <RotateCcw />
              Reset
            </button>
            <button type="button" onClick={() => void shareLesson()}>
              <Share2 />
              Share
            </button>
            <a href="/workspace">
              <ExternalLink />
              Workspace
            </a>
          </aside>
        </section>
        <article>
          <h3>Key idea</h3>
          <p>We use an area model to show</p>
          <strong>(x + 2)² = x² + 4x + 4</strong>
          <p>
            The diagram proves the identity for all x ≥ 0 in this model. Algebra
            then extends it to all real x.
          </p>
          <b>
            <Grid3X3 />
            Proof diagram
          </b>
        </article>
      </header>
      <nav className="identity106-tabs">
        {(
          [
            "Interaction + visualization",
            "Explain",
            "Examples",
            "Formulas",
            "Know more",
          ] as IdentityTab106[]
        ).map((name) => (
          <button
            type="button"
            className={tab === name ? "active" : ""}
            onClick={() => {
              setTab(name);
              act();
            }}
            key={name}
          >
            {name}
          </button>
        ))}
      </nav>
      {tab !== "Interaction + visualization" && (
        <IdentityTabPanel106 tab={tab} />
      )}
      <main
        className={`identity106-lab ${tab !== "Interaction + visualization" ? "hidden" : ""}`}
      >
        <header>
          <small>IDENTITY PROOF LAB</small>
          <h2>{copy.lab}</h2>
          <div>
            <Switch
              label="Show area parts"
              value={showParts}
              onToggle={() => {
                setShowParts((value) => !value);
                act();
              }}
            />
            <Switch
              label="Combine like terms"
              value={combineTerms}
              onToggle={() => {
                setCombineTerms((value) => !value);
                act();
              }}
            />
            <Switch
              label="Test sample values"
              value={testSamples}
              onToggle={() => {
                setTestSamples((value) => !value);
                act();
              }}
            />
            <button type="button" onClick={() => reset()}>
              <RotateCcw />
              Reset lab
            </button>
          </div>
        </header>
        <section className="identity106-columns">
          <article className="identity106-area">
            <h3>
              Area model: square of side <i>x + 2</i>
            </h3>
            <p>Move the slider or enter a value to test.</p>
            <label>
              x = {xValue}
              <input
                aria-label="Area model x value"
                type="range"
                min="1"
                max="8"
                value={xValue}
                onChange={(event) => {
                  setXValue(Number(event.target.value));
                  act();
                }}
              />
              <input
                aria-label="Direct area x value"
                type="number"
                min="1"
                max="8"
                value={xValue}
                onChange={(event) => {
                  setXValue(
                    Math.max(1, Math.min(8, Number(event.target.value))),
                  );
                  act();
                }}
              />
            </label>
            <div className="identity106-dimensions">
              <div className="identity106-dimension-top">
                <span>x</span>
                <span>2</span>
              </div>
              <div className="identity106-dimension-left">
                <span>x</span>
                <span>2</span>
              </div>
              <div
                className="identity106-square"
                style={{
                  gridTemplateColumns: `${xValue}fr 2fr`,
                  gridTemplateRows: `${xValue}fr 2fr`,
                }}
              >
                <span className="x2">
                  {showParts && (
                    <>
                      x²<small>{area.xSquared}</small>
                    </>
                  )}
                </span>
                <span className="top">
                  {showParts && (
                    <>
                      2x<small>{area.rectangle}</small>
                    </>
                  )}
                </span>
                <span className="left">
                  {showParts && (
                    <>
                      2x<small>{area.rectangle}</small>
                    </>
                  )}
                </span>
                <span className="four">{showParts && <>4</>}</span>
              </div>
            </div>
            <section>
              {tiles.map((tile) => (
                <button
                  type="button"
                  draggable
                  aria-label={`Drag area tile ${tile.id}`}
                  onDragStart={(event) => startDrag(event, tile)}
                  onDragEnd={() => setDragging("")}
                  key={tile.id}
                >
                  <b className={tile.className}>{tile.label}</b>
                  <span>{tile.detail}</span>
                </button>
              ))}
            </section>
            <button
              type="button"
              className="why"
              onClick={() => {
                setWhyOpen((value) => !value);
                act();
              }}
            >
              ⓘ Why this works <ChevronDown />
              {whyOpen && (
                <span>
                  The same square is partitioned without gaps or overlaps, so
                  its total area equals the sum of all four regions.
                </span>
              )}
            </button>
          </article>
          <article className="identity106-transform">
            <h3>Expression transformation</h3>
            <ol>
              <li>
                <i>1</i>
                <p>Start with the square of the side.</p>
                <strong>(x + 2)²</strong>
              </li>
              <li
                className="drop"
                aria-label="Area parts drop target"
                onDragOver={(event) => event.preventDefault()}
                onDrop={dropPart}
              >
                <i>2</i>
                <p>Split into area parts.</p>
                <strong>x² + 2x + 2x + 4</strong>
              </li>
              <li>
                <i>3</i>
                <p>Combine like terms.</p>
                <strong>
                  {combineTerms ? "x² + 4x + 4" : "x² + 2x + 2x + 4"}
                </strong>
              </li>
              <li>
                <i>4</i>
                <p>Result (proved by the diagram)</p>
                <strong>
                  (x + 2)² = {combineTerms ? "x² + 4x + 4" : "x² + 2x + 2x + 4"}
                </strong>
              </li>
            </ol>
            <aside>
              <ShieldCheck />
              <h3>Proof complete!</h3>
              <p>
                The diagram proves this identity for all x ≥ 0 in this model.
              </p>
              <p>Algebra extends the identity to all real x.</p>
            </aside>
            {invalidDrop && (
              <p className="invalid">Use one of the four area tiles.</p>
            )}
          </article>
          <article className="identity106-evidence">
            <h3>Test sample values (evidence)</h3>
            <p>
              Substitute different values to see both sides are always equal.
            </p>
            {testSamples ? (
              <table>
                <thead>
                  <tr>
                    <th>x value</th>
                    <th>
                      Left side
                      <br />
                      (x + 2)²
                    </th>
                    <th>
                      Right side
                      <br />
                      x² + 4x + 4
                    </th>
                    <th>Match?</th>
                  </tr>
                </thead>
                <tbody>
                  {sampleResults.map((result, index) => (
                    <tr key={`${result.value}-${index}`}>
                      <th>{result.value}</th>
                      <td>
                        ({result.value} + 2)²
                        <br />= {result.left}
                      </td>
                      <td>
                        {result.value}² + 4({result.value}) + 4<br />={" "}
                        {result.right}
                      </td>
                      <td>
                        <Check />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="hidden-evidence">Sample testing hidden</div>
            )}
            <aside>
              <CircleAlert />
              <h3>Important</h3>
              <p>
                Finding one value that works does not prove an identity. A proof
                works for all allowed values.
              </p>
            </aside>
          </article>
        </section>
      </main>
      <section className="identity106-practice">
        <header>
          <h2>{copy.practice}</h2>
          <p>Expand each square using an area model (like above) or algebra.</p>
          <span>
            {practiceIndex + 1} of {practices.length}
            <button
              type="button"
              aria-label="Previous practice"
              onClick={() => movePractice(-1)}
            >
              <ChevronLeft />
            </button>
            <button
              type="button"
              aria-label="Next practice"
              onClick={() => movePractice(1)}
            >
              <ChevronRight />
            </button>
          </span>
        </header>
        <article>
          <i>1</i>
          <p>Expand the identity.</p>
          <strong>
            ({practice.variable} + {practice.constant})²
          </strong>
          <label>
            Your answer
            <input
              aria-label="Identity practice answer"
              value={practiceAnswer}
              onChange={(event) => {
                setPracticeAnswer(event.target.value);
                setPracticeChecked(false);
                act();
              }}
              onBlur={() => setPracticeChecked(true)}
            />
          </label>
          {practiceChecked && (
            <b className={practiceCorrect ? "correct" : "wrong"}>
              {practiceCorrect ? (
                <>
                  <Check />
                  Correct!
                </>
              ) : (
                "Check the middle term."
              )}
            </b>
          )}
          <footer>
            <h3>Explanation</h3>
            <p>
              ({practice.variable} + {practice.constant})² = {practice.variable}
              ² + {practice.constant}
              {practice.variable} + {practice.constant}
              {practice.variable} + {practice.constant ** 2} ={" "}
              {practiceExpansion}
            </p>
            <button
              type="button"
              onClick={() => {
                setPracticeArea((value) => !value);
                act();
              }}
            >
              <Grid3X3 />
              {practiceArea ? "Hide area model" : "Show area model"}
            </button>
            {practiceArea && (
              <div className="mini-area">
                <span>{practice.variable}²</span>
                <span>
                  {practice.constant}
                  {practice.variable}
                </span>
                <span>
                  {practice.constant}
                  {practice.variable}
                </span>
                <span>{practice.constant ** 2}</span>
              </div>
            )}
          </footer>
        </article>
      </section>
      <nav className="identity106-navigation">
        <a href="/lessons/algebra/105-factor-theorem">
          <ArrowLeft />
          <span>
            Previous<b>Factor Theorem</b>
          </span>
        </a>
        <a href="/lessons/algebra/107-one-step-equations">
          <span>
            Next<b>One-Step Equations</b>
          </span>
          <ArrowRight />
        </a>
      </nav>
      <footer className="identity106-footer">
        <h3>
          <Sparkles />
          Math Universe
        </h3>
        <p>
          Interactive math labs, visual proofs, NCERT explorations, graphing,
          CAS-style tools, and classroom-ready activities.
        </p>
        <nav>
          <a href="/sitemap">Sitemap</a>
          <a href="/docs">Docs</a>
          <a href="/about">About</a>
        </nav>
        <hr />
        <small>
          © 2026 INDIAN SERVERS PRIVATE LIMITED. NO RIGHT TO REPRODUCE IT.
        </small>
        <p>www.IndianServers.com info@IndianServers.com</p>
      </footer>
      <LessonTopicStudyBoard lessonId={106} view={tab} onInteraction={onInteraction} />

    </div>
  );
}
function IdentityTabPanel106({
  tab,
}: {
  tab: Exclude<IdentityTab106, "Interaction + visualization">;
}) {
  const content = {
    Explain: {
      title: "One square, two expressions",
      body: "The large square has side x + 2, so its area is (x + 2)². Its four regions have areas x², 2x, 2x, and 4. Their sum is x² + 4x + 4.",
    },
    Examples: {
      title: "The pattern works for any term",
      body: "Replacing 2 by 3 gives (x + 3)² = x² + 6x + 9. The two rectangles each contribute 3x.",
    },
    Formulas: {
      title: "Square identities",
      body: "(a + b)² = a² + 2ab + b² and (a − b)² = a² − 2ab + b².",
    },
    "Know more": {
      title: "Evidence is not the proof",
      body: "Checking sample values can reveal mistakes, but the area partition or an algebraic expansion proves the identity for every allowed value.",
    },
  }[tab];
  return (
    <section className="identity106-tab-panel" aria-live="polite">
      <small>{tab}</small>
      <h2>{content.title}</h2>
      <p>{content.body}</p>
    </section>
  );
}
function Switch({
  label,
  value,
  onToggle,
}: {
  label: string;
  value: boolean;
  onToggle: () => void;
}) {
  return (
    <button type="button" role="switch" aria-checked={value} onClick={onToggle}>
      <span>{label}</span>
      <i className={value ? "on" : ""}>
        <b />
      </i>
    </button>
  );
}
