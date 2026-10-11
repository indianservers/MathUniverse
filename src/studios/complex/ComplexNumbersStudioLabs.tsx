import WavesReference from "./WavesReference";
import LociReference from "./LociReference";
import { useStudioModel, useStudioState } from "../phase1/StudioModelProvider";
import StudioModelTools from "../phase1/StudioModelTools";
import { useState, type ReactNode } from "react";
import { HelpCircle, RotateCcw, RotateCw, Settings } from "lucide-react";
import StudioHomeButtons from "../../components/ui/StudioHomeButtons";
import { StudioCanvasToolbar } from "../../components/ui/StudioCanvasToolbar";
import { ChallengeBox, clamp, fmt, useLabMode } from "../mockup/studioLabKit";
import type { StudioMockupPage } from "../mockup/studioMockupCatalog";
import { studioMockups } from "../mockup/studioMockupCatalog";
import ArgandFigure from "./ArgandFigure";
import ArgandReference from "./ArgandReference";
import FractalsReference from "./FractalsReference";

import { markComplexComplete } from "./complexStudioSession";
import ComplexReferenceSuite from "./ComplexReferenceSuite";
import EulerExperience from "./EulerExperience";
import ComplexLearningDepth from "./ComplexLearningDepth";

const catalog = studioMockups["complex-numbers"];

export default function ComplexNumbersStudioLabs({
  pageId,
}: {
  pageId: string;
}) {
  const page = catalog.pages.find((item) => item.id === pageId);
  if (!page) return null;
  switch (pageId) {
    case "argand-plane":
      return <ArgandReference page={page} />;
    case "arithmetic":
      return <ArithmeticLab page={page} />;
    case "polar-forms":
      return <ComplexReferenceSuite page={page} />;
    case "rotation":
      return <ComplexReferenceSuite page={page} />;
    case "roots":
      return <ComplexReferenceSuite page={page} />;
    case "euler":
      return <EulerExperience page={page} />;
    case "loci":
      return <LociReference page={page} />;
    case "fractals":
      return <FractalsReference page={page} />;
    case "waves-circuits":
      return <WavesReference page={page} />;
    default:
      return null;
  }
}

function LabFrame({
  page,
  canvasTitle,
  controls,
  canvas,
  insight,
}: {
  page: StudioMockupPage;
  canvasTitle: string;
  controls: (mode: string) => ReactNode;
  canvas: (mode: string) => ReactNode;
  insight: (mode: string) => ReactNode;
}) {
  const { tabs, mode, setMode } = useLabMode(page);
  const model = useStudioModel();
  const [helpOpen, setHelpOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  return (
    <>
      <div
        data-complex-owned
        data-lab-pane="workspace"
        className="cxs-page cxs-lab"
        data-lab-mode={mode}
        data-mode-canvas={mode}
        data-cx-mode={mode}
        data-studio-kernel="1"
      >
        <header
          className="cxs-header"
          data-lab-mode={mode}
          data-mode-canvas={mode}
        >
          <div>
            <StudioHomeButtons studioTo="/complex-numbers" />
            <h1>{page.title}</h1>
            <p>{page.subtitle}</p>
          </div>
          <nav className="cxs-header-modes" aria-label={`${page.title} modes`}>
            <small>Mode</small>
            {tabs.map((item) => (
              <button
                key={item}
                type="button"
                aria-pressed={item === mode}
                className={item === mode ? "active" : ""}
                onClick={() => setMode(item)}
              >
                {item}
              </button>
            ))}
          </nav>
          <div className="cxs-header-actions">
            <StudioCanvasToolbar />
            <button
              type="button"
              aria-label="Undo"
              disabled={!model?.ledger.past.length}
              onClick={model?.ledger.undo}
            >
              <RotateCcw />
            </button>
            <button
              type="button"
              aria-label="Redo"
              disabled={!model?.ledger.future.length}
              onClick={model?.ledger.redo}
            >
              <RotateCw />
            </button>
            <button
              type="button"
              aria-label="Help"
              aria-expanded={helpOpen}
              onClick={() => {
                setHelpOpen((open) => !open);
                setSettingsOpen(false);
              }}
            >
              <HelpCircle />
            </button>
            <button
              type="button"
              aria-label="Settings"
              aria-expanded={settingsOpen}
              onClick={() => {
                setSettingsOpen((open) => !open);
                setHelpOpen(false);
              }}
            >
              <Settings />
            </button>
          </div>
        </header>
        {helpOpen ? (
          <div className="cxs-card cxs-dialog" role="dialog" aria-label="Help">
            <h2>Help · {page.title}</h2>
            <p>{page.subtitle}</p>
            <p>{page.description}</p>
            <p className="cxs-note">{page.learning.understand}</p>
            <button
              type="button"
              className="cxs-soft-button"
              onClick={() => setHelpOpen(false)}
            >
              Close
            </button>
          </div>
        ) : null}
        {settingsOpen ? (
          <div
            className="cxs-card cxs-dialog"
            role="dialog"
            aria-label="Settings"
          >
            <h2>Settings</h2>
            <p className="cxs-note">
              Undo and Redo restore model inputs. Reset restores defaults; Share
              saves the current inputs and mode in a link.
            </p>
            <StudioModelTools />
            <p className="cxs-note">Current mode: {mode}</p>
            <button
              type="button"
              className="cxs-soft-button"
              onClick={() => setSettingsOpen(false)}
            >
              Close
            </button>
          </div>
        ) : null}
        <p className="sr-only" role="status">
          {page.title} mode {mode}
        </p>
        <div
          className="cxs-dash-banner"
          data-lab-mode={mode}
          data-studio-kernel="1"
        >
          <b>
            {page.title} · {mode}
          </b>
          <small>{page.subtitle}</small>
        </div>
        <div className="cxs-three-column">
          <div className="cxs-stack cxs-card">{controls(mode)}</div>
          <section
            className="cxs-card cxs-wide cxs-canvas"
            data-studio="complex-numbers"
            data-mode-canvas={mode}
            data-cx-mode={mode}
          >
            <header className="cxs-canvas-head">
              <h2>{canvasTitle}</h2>
              <small>{mode}</small>
            </header>
            {canvas(mode)}
          </section>
          <aside className="cxs-stack cxs-card">{insight(mode)}</aside>
        </div>
        <section className="cxs-learning-strip" aria-label="Learning loop">
          <div>
            <span>
              <b>Observe</b>
              <small>{page.learning.observe}</small>
            </span>
          </div>
          <div>
            <span>
              <b>Understand</b>
              <small>{page.learning.understand}</small>
            </span>
          </div>
          <div>
            <span>
              <b>Why</b>
              <small>{page.learning.why}</small>
            </span>
          </div>
          <div>
            <span>
              <b>Try</b>
              <small>{page.learning.try}</small>
            </span>
          </div>
          <div>
            <span>
              <b>Challenge</b>
              <small>{page.learning.challenge}</small>
            </span>
          </div>
        </section>
      </div>
      <ComplexLearningDepth key={page.id} pageId={page.id} />
    </>
  );
}

function Legend({ items }: { items: Array<[string, string]> }) {
  return (
    <ul className="cxs-legend">
      {items.map(([color, label]) => (
        <li key={label}>
          <i style={{ background: color }} />
          {label}
        </li>
      ))}
    </ul>
  );
}

function Slider({
  label,
  value,
  min,
  max,
  step,
  onChange,
  unit,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (n: number) => void;
  unit?: string;
}) {
  return (
    <label className="cxs-slider">
      <span>{label}</span>
      <div>
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(event) => onChange(Number(event.target.value))}
        />
        <output>
          {fmt(value, step < 1 ? 2 : 0)}
          {unit ? ` ${unit}` : ""}
        </output>
      </div>
    </label>
  );
}

function Live({
  color,
  label,
  value,
}: {
  color: string;
  label: string;
  value: string;
}) {
  return (
    <div className="cxs-live-row">
      <i style={{ background: color }} />
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function ArithmeticLab({ page }: { page: StudioMockupPage }) {
  const [a, setA] = useStudioState(
    "ComplexNumbersStudioLabs:ArithmeticLab:a",
    2.5,
  );
  const [b, setB] = useStudioState(
    "ComplexNumbersStudioLabs:ArithmeticLab:b",
    1.5,
  );
  const [c, setC] = useStudioState(
    "ComplexNumbersStudioLabs:ArithmeticLab:c",
    -1,
  );
  const [d, setD] = useStudioState(
    "ComplexNumbersStudioLabs:ArithmeticLab:d",
    2,
  );
  const sum = [a + c, b + d];
  const prod = [a * c - b * d, a * d + b * c];
  const quotDen = c * c + d * d;
  const divideError = Math.abs(quotDen) < 1e-9;
  const quot = divideError
    ? [Number.NaN, Number.NaN]
    : [(a * c + b * d) / quotDen, (b * c - a * d) / quotDen];
  return (
    <LabFrame
      page={page}
      canvasTitle="PARALLELOGRAM LAW"
      controls={(mode) => (
        <>
          <h2>Vectors (drag points)</h2>
          <p className="cxs-note">
            Operation {mode} uses the live figure, not a copy-only switch.
          </p>
          <Slider
            label="Re z1"
            value={a}
            min={-4}
            max={4}
            step={0.1}
            onChange={setA}
          />
          <Slider
            label="Im z1"
            value={b}
            min={-4}
            max={4}
            step={0.1}
            onChange={setB}
          />
          {mode !== "Conjugate" ? (
            <>
              <Slider
                label="Re z2"
                value={c}
                min={-4}
                max={4}
                step={0.1}
                onChange={setC}
              />
              <Slider
                label="Im z2"
                value={d}
                min={-4}
                max={4}
                step={0.1}
                onChange={setD}
              />
            </>
          ) : (
            <p className="cxs-note">
              z₂ is hidden in Conjugate mode so only z and z̄ remain.
            </p>
          )}
        </>
      )}
      canvas={(mode) => {
        const res =
          mode === "Multiply"
            ? prod
            : mode === "Subtract"
              ? [a - c, b - d]
              : mode === "Divide"
                ? quot
                : mode === "Conjugate"
                  ? [a, -b]
                  : sum;
        return (
          <>
            <ArgandFigure
              re={a}
              im={b}
              wRe={mode === "Conjugate" ? undefined : c}
              wIm={mode === "Conjugate" ? undefined : d}
              resRe={mode === "Divide" && divideError ? undefined : res[0]}
              resIm={mode === "Divide" && divideError ? undefined : res[1]}
              showParallelogram={mode === "Add" || mode === "Subtract"}
              showConjugate={mode === "Conjugate"}
              scale={36}
              width={420}
              height={320}
              onPick={(x, y) => {
                const nx = clamp(x, -4, 4);
                const ny = clamp(y, -4, 4);
                if (
                  mode === "Conjugate" ||
                  Math.hypot(nx - a, ny - b) <= Math.hypot(nx - c, ny - d)
                ) {
                  setA(nx);
                  setB(ny);
                } else {
                  setC(nx);
                  setD(ny);
                }
              }}
              label="Parallelogram"
            />
            <Legend
              items={[
                ["#08a8cf", "z₁"],
                ["#8b45f4", "z₂"],
                ["#f59e0b", "result"],
              ]}
            />
          </>
        );
      }}
      insight={(mode) => {
        const res =
          mode === "Multiply"
            ? prod
            : mode === "Subtract"
              ? [a - c, b - d]
              : mode === "Divide"
                ? quot
                : mode === "Conjugate"
                  ? [a, -b]
                  : sum;
        return (
          <>
            <Live
              color="#f59e0b"
              label="result"
              value={
                mode === "Divide" && divideError
                  ? "undefined (divide by 0)"
                  : `${fmt(res[0], 2)} + ${fmt(res[1], 2)}i`
              }
            />
            <Live color="#147df2" label="|z1|" value={fmt(Math.hypot(a, b))} />
            <p className="cxs-note">
              {mode === "Multiply"
                ? "Multiply adds arguments and multiplies moduli."
                : mode === "Divide"
                  ? divideError
                    ? "Cannot divide: |z₂| ≈ 0."
                    : "Divide subtracts arguments."
                  : mode === "Conjugate"
                    ? "z₂ is hidden; the dashed ray is the conjugate."
                    : "Addition is the parallelogram diagonal."}
            </p>
            <ChallengeBox
              {...page.challenge}
              onCorrect={() => markComplexComplete(page.id)}
            />
          </>
        );
      }}
    />
  );
}



