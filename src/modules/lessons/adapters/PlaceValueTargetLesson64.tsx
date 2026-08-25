import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Calculator,
  Eye,
  Languages,
  Lightbulb,
  RotateCcw,
  Share2,
  Sparkles,
} from "lucide-react";
import { useEffect, useState, type DragEvent } from "react";
import type { LessonAdapterProps } from "../types";
import "./PlaceValueTargetLesson64.css";

type Place = {
  key: "thousands" | "hundreds" | "tens" | "ones";
  label: string;
  multiplier: number;
  color: string;
};

const PLACES: Place[] = [
  { key: "thousands", label: "Thousands", multiplier: 1000, color: "teal" },
  { key: "hundreds", label: "Hundreds", multiplier: 100, color: "blue" },
  { key: "tens", label: "Tens", multiplier: 10, color: "purple" },
  { key: "ones", label: "Ones", multiplier: 1, color: "orange" },
];
const INITIAL_DIGITS = "5381";
const PRACTICE_DIGITS = [2, 1, 0];

function normalizeDigits(raw: string) {
  const digits = raw.replace(/\D/g, "").slice(-4);
  if (!digits) return "0000";
  return digits.padStart(4, "0");
}

function expandedParts(digits: string) {
  return PLACES.map((place, index) => Number(digits[index]) * place.multiplier);
}

function placeName(index: number) {
  return PLACES[index].key;
}

export default function PlaceValueTargetLesson64({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [digits, setDigits] = useState(INITIAL_DIGITS);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [tab, setTab] = useState("Interaction + visualization");
  const [language, setLanguage] = useState("English (English)");
  const [workspace, setWorkspace] = useState(false);
  const [shareState, setShareState] = useState("Share");
  const [practiceIndex, setPracticeIndex] = useState(0);
  const [actions, setActions] = useState(0);
  const parts = expandedParts(digits);
  const number = Number(digits);
  const selectedDigit = Number(digits[selectedIndex]);
  const selectedPlace = PLACES[selectedIndex];
  const selectedValue = selectedDigit * selectedPlace.multiplier;
  const practiceDigitIndex = PRACTICE_DIGITS[practiceIndex];
  const practiceDigit = Number(digits[practiceDigitIndex]);
  const practiceValue = practiceDigit * PLACES[practiceDigitIndex].multiplier;

  const act = () => {
    setActions((value) => value + 1);
    onInteraction();
  };
  const selectDigit = (index: number) => {
    setSelectedIndex(index);
    act();
  };
  const changeNumber = (raw: string) => {
    setDigits(normalizeDigits(raw));
    act();
  };
  const dropDigit = (event: DragEvent<HTMLElement>, targetIndex: number) => {
    event.preventDefault();
    const transferredIndex = event.dataTransfer.getData("text/place-index");
    const sourceIndex = transferredIndex === "" ? dragIndex : Number(transferredIndex);
    if (
      sourceIndex === null ||
      !Number.isInteger(sourceIndex) ||
      sourceIndex === targetIndex
    ) {
      setDragIndex(null);
      return;
    }
    const next = [...digits];
    [next[sourceIndex], next[targetIndex]] = [
      next[targetIndex],
      next[sourceIndex],
    ];
    setDigits(next.join(""));
    setSelectedIndex(targetIndex);
    setDragIndex(null);
    act();
  };
  const reset = () => {
    setDigits(INITIAL_DIGITS);
    setSelectedIndex(0);
    setDragIndex(null);
    setTab("Interaction + visualization");
    setLanguage("English (English)");
    setWorkspace(false);
    setShareState("Share");
    setPracticeIndex(0);
    setActions(0);
    onInteraction();
  };
  useEffect(() => {
    setDigits(INITIAL_DIGITS);
    setSelectedIndex(0);
    setDragIndex(null);
    setTab("Interaction + visualization");
    setLanguage("English (English)");
    setWorkspace(false);
    setShareState("Share");
    setPracticeIndex(0);
    setActions(0);
  }, [resetToken]);
  const share = async () => {
    try {
      await navigator.clipboard?.writeText(
        `${number} = ${parts.join(" + ")}. The digit ${selectedDigit} in the ${placeName(selectedIndex)} place has value ${selectedValue}.`,
      );
      setShareState("Copied");
    } catch {
      setShareState("Ready");
    }
    act();
  };

  return (
    <div
      className="place64-page"
      data-testid="number-mockup-0046"
      data-dedicated-lesson="64"
      data-object-model="editable-four-digit-place-columns-draggable-digit-swap-exact-base-ten-block-expanded-form-practice-model"
      data-number={digits}
      data-selected-index={selectedIndex}
      data-selected-digit={selectedDigit}
      data-selected-place={selectedPlace.key}
      data-selected-value={selectedValue}
      data-expanded={parts.join("+")}
      data-block-counts={digits.split("").join(",")}
      data-drag-index={dragIndex ?? ""}
      data-tab={tab}
      data-language={language}
      data-workspace={workspace}
      data-practice-index={practiceIndex}
      data-practice-value={practiceValue}
      data-actions={actions}
    >
      <span className="sr-only">
        Concept trace: Place-value expansion shows that each digit&apos;s place
        changes its value. Base-ten place value uses exact thousands, hundreds,
        tens, and ones blocks.
      </span>
      <nav className="place64-breadcrumb">
        <a href="/" aria-label="Back">
          <ArrowLeft />
        </a>
        <a href="/">Home</a>
        <span>›</span>
        <a href="/lessons">Lessons</a>
        <span>›</span>
        <a href="/lessons/numbers-and-arithmetic">Numbers And Arithmetic</a>
        <span>›</span>
        <b>64 Place Value</b>
      </nav>

      <header className="place64-hero">
        <nav>
          <b>NUMBERS AND ARITHMETIC</b>
          <b>NUMBERS AND NUMBER THEORY</b>
        </nav>
        <h1>Place Value</h1>
        <p>Understand positional notation.</p>
        <div className="place64-badges">
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
            <span>{language}</span>
            <i>⌄</i>
          </button>
          <button type="button" onClick={reset}>
            <RotateCcw /> Reset
          </button>
          <button type="button" onClick={() => void share()}>
            <Share2 /> {shareState}
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

      <nav className="place64-tabs" aria-label="Place value lesson sections">
        {[
          ["Interaction + visualization", "⊙"],
          ["Explain", "▣"],
          ["Examples", "♧"],
          ["Formulas", "Σ"],
          ["Know more", "✧"],
        ].map(([label, icon]) => (
          <button
            type="button"
            className={tab === label ? "active" : ""}
            onClick={() => {
              setTab(label);
              act();
            }}
            key={label}
          >
            <span>{icon}</span>
            {label}
          </button>
        ))}
      </nav>

      <main className="place64-layout">
        <section className="place64-work">
          <header>
            <small>INTERACTION + VISUALIZATION</small>
            <h2>Explore place value with exact base-ten blocks</h2>
            <p>
              Each column shows the exact number of base-ten blocks for {number}
              .
            </p>
          </header>
          <section className="place64-columns" aria-label="Place value columns">
            {PLACES.map((place, index) => {
              const digit = Number(digits[index]);
              return (
                <article
                  className={`place64-column ${place.color} ${selectedIndex === index ? "selected" : ""}`}
                  data-place={place.key}
                  onDragOver={(event) => event.preventDefault()}
                  onDrop={(event) => dropDigit(event, index)}
                  onClick={() => selectDigit(index)}
                  key={place.key}
                >
                  <h3>{place.label}</h3>
                  <button
                    type="button"
                    draggable
                    aria-label={`${digit} in the ${place.key} place`}
                    onClick={(event) => {
                      event.stopPropagation();
                      selectDigit(index);
                    }}
                    onDragStart={(event) => {
                      event.dataTransfer.setData(
                        "text/place-index",
                        String(index),
                      );
                      event.dataTransfer.effectAllowed = "move";
                      setDragIndex(index);
                    }}
                    onDragEnd={() => setDragIndex(null)}
                  >
                    {digit}
                  </button>
                  <div
                    className={`place64-blocks ${place.key}`}
                    aria-label={`${digit} ${place.key} blocks`}
                  >
                    {Array.from({ length: digit }, (_, blockIndex) => (
                      <i
                        className={`base-block ${place.key}`}
                        key={blockIndex}
                      />
                    ))}
                    {digit === 0 ? <em>0 blocks</em> : null}
                  </div>
                </article>
              );
            })}
          </section>
        </section>

        <aside className="place64-side">
          <section className="place64-number-card">
            <label htmlFor="place64-number">Number:</label>
            <input
              id="place64-number"
              aria-label="Four digit number"
              inputMode="numeric"
              value={digits}
              onChange={(event) => changeNumber(event.target.value)}
              onFocus={(event) => event.currentTarget.select()}
            />
          </section>
          <section className="place64-chosen">
            <h2>
              Chosen digit: <b>{selectedDigit}</b>
            </h2>
            <p>
              {selectedDigit} in the {selectedPlace.key} place
            </p>
            <strong>
              means <b>{selectedValue}</b>
            </strong>
          </section>
          <section className="place64-expanded">
            <h2>Expanded form</h2>
            <p>
              <b>{digits}</b> ={" "}
              {parts.map((part, index) => (
                <span className={PLACES[index].color} key={PLACES[index].key}>
                  {part}
                  {index < parts.length - 1 ? <i> + </i> : null}
                </span>
              ))}
            </p>
          </section>
          <p className="place64-tip">
            <Lightbulb /> A digit&apos;s place changes its value.
          </p>
          <section className="place64-insight">
            <h2>Key insight</h2>
            <strong>
              1 thousand equals
              <br />
              10 hundreds
            </strong>
          </section>
          <button
            type="button"
            className="place64-practice"
            onClick={() => {
              setPracticeIndex((value) => (value + 1) % PRACTICE_DIGITS.length);
              act();
            }}
          >
            <span>
              Try: What is the value of {practiceDigit} in {digits}?
            </span>
            {" "}<b>{practiceValue}</b>
            <Eye />
          </button>
        </aside>
      </main>

      <nav className="place64-navigation">
        <a href="/lessons/numbers-and-arithmetic/63-complex-numbers">
          <ArrowLeft />
          <span>
            PREVIOUS<b>Complex Numbers</b>
          </span>
        </a>
        <a href="/lessons/numbers-and-arithmetic/65-factors">
          <span>
            NEXT<b>Factors</b>
          </span>
          <ArrowRight />
        </a>
      </nav>
      <footer className="place64-footer">
        <h3>
          <Sparkles /> Math Universe
        </h3>
        <p>
          Interactive math labs, visual proofs, NCERT explorations, graphing,
          CAS-style tools, and classroom-ready activities.
        </p>
        <nav>
          <a href="/sitemap">
            <BookOpen /> Sitemap
          </a>
          <a href="/docs">
            <Calculator /> Docs
          </a>
          <a href="/about">✉ About</a>
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
