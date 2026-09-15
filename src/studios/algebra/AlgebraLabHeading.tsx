import { HelpCircle, RotateCcw, RotateCw, Settings } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import { useLocation } from "react-router-dom";
import { useTheme } from "../../hooks/useTheme";
import MathExpression from "../../components/ui/MathExpression";
import StudioHomeButtons from "../../components/ui/StudioHomeButtons";
import { StudioCanvasToolbar } from "../../components/ui/StudioCanvasToolbar";
import { curriculumByLab, firstTryHelp, glossary, misconceptions, vignettes } from "./algebraStudioCatalog";
import {
  exactModeEnabled,
  recordLabMode,
  recordUndoCaption,
  saveNamedExperiment,
  setExactMode,
  setTeacherFreeze,
  teacherFreezeEnabled,
} from "./algebraStudioProgress";

export default function AlgebraLabHeading({
  children,
  subtitle,
  modes,
  mode,
  onMode,
  onUndo,
  onRedo,
  canUndo = false,
  canRedo = false,
  onReset,
  helpTitle = "Explore this lab",
  helpBody = "Select a mode and change its parameters to recompute the model. Use the result and graph together. Challenges check the current values; CAS and proof entry accept expressions with powers such as x^2.",
  labId,
  undoCaption,
}: {
  children: ReactNode;
  subtitle?: string;
  modes?: readonly string[];
  mode?: string;
  onMode?: (mode: string) => void;
  onUndo?: () => void;
  onRedo?: () => void;
  canUndo?: boolean;
  canRedo?: boolean;
  onReset?: () => void;
  helpTitle?: string;
  helpBody?: string;
  labId?: string;
  undoCaption?: string;
}) {
  const location = useLocation();
  const [panel, setPanel] = useState<"Help" | "Settings" | "Jump" | null>(null);
  const [confirmReset, setConfirmReset] = useState(false);
  const [experimentName, setExperimentName] = useState("");
  const [lastUndo, setLastUndo] = useState("");
  const [freeze, setFreeze] = useState(false);
  const [exact, setExact] = useState(true);
  const { fontScale, setFontScale, reducedMotion, setReducedMotion } = useTheme();
  const tags = labId ? curriculumByLab[labId] ?? [] : [];
  const tryFirst = (mode && firstTryHelp[mode]) || "";

  useEffect(() => {
    setFreeze(teacherFreezeEnabled());
    setExact(exactModeEnabled());
    setTeacherFreeze(teacherFreezeEnabled());
  }, []);

  useEffect(() => {
    if (labId) recordLabMode(labId, mode ?? "default");
  }, [labId, mode]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setPanel((current) => (current === "Jump" ? null : "Jump"));
        return;
      }
      if (target && /input|textarea|select/i.test(target.tagName)) {
        if (event.key === "Escape") setPanel(null);
        return;
      }
      if (event.key === "Escape") setPanel(null);
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "z") {
        event.preventDefault();
        if (event.shiftKey) onRedo?.();
        else {
          onUndo?.();
          const caption = undoCaption || "Undid the last lab change.";
          setLastUndo(caption);
          recordUndoCaption(caption);
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onRedo, onUndo, undoCaption]);

  return (
    <>
      <header className="alg-header alg-header-sticky" data-lab-mode={mode ?? ""} data-mode-canvas={mode ?? ""}>
        <div>
          <StudioHomeButtons studioTo="/algebra" />
          <a className="alg-skip" href="#algebra-graph">Skip to graph</a>
          <h1>{children}</h1>
          {subtitle ? <p>{subtitle}</p> : null}
          {tags.length ? (
            <p className="alg-curric">{tags.map((tag) => <span key={tag.code}>{tag.board} · {tag.code} · {tag.label}</span>)}</p>
          ) : null}
        </div>
        {modes && onMode ? (
          <nav className="alg-header-modes" aria-label="Lab modes">
            <small>Mode</small>
            {modes.map((item) => (
              <button key={item} type="button" aria-pressed={item === mode} className={item === mode ? "active" : ""} onClick={() => onMode(item)}>{item}</button>
            ))}
          </nav>
        ) : null}
        <div className="alg-header-actions">
          <StudioCanvasToolbar />
          <button type="button" aria-label="Undo" disabled={!onUndo || !canUndo} onClick={() => { onUndo?.(); const caption = undoCaption || "Undid the last lab change."; setLastUndo(caption); recordUndoCaption(caption); }}><RotateCcw /></button>
          <button type="button" aria-label="Redo" disabled={!onRedo || !canRedo} onClick={onRedo}><RotateCw /></button>
          <button type="button" aria-expanded={panel === "Help"} onClick={() => setPanel(panel === "Help" ? null : "Help")} aria-label="Help"><HelpCircle /></button>
          <button type="button" aria-expanded={panel === "Settings"} onClick={() => setPanel(panel === "Settings" ? null : "Settings")} aria-label="Settings"><Settings /></button>
        </div>
      </header>
      {lastUndo ? <p className="alg-undo-caption" role="status">{lastUndo}</p> : null}
      {panel === "Help" && (
        <section className="alg-card" role="region" aria-label="Lab help">
          <h2>{helpTitle}</h2>
          <p>{helpBody}</p>
          {tryFirst ? <p><b>What to try first. </b>{tryFirst}</p> : null}
          {labId && vignettes[labId] ? <p><b>In the world. </b>{vignettes[labId]}</p> : null}
          {labId ? misconceptions.filter((item) => item.lab === labId).map((item) => <p key={item.id}><b>Watch for: </b>{item.mistake} {item.repair}</p>) : null}
          <p>Leaving Algebra: <a href="/linear-algebra">Linear Algebra</a> for matrices, <a href="/discrete-world/number-patterns">Discrete patterns</a> for sequences, <a href="/complex-numbers">Complex Numbers</a> for non-real roots.</p>
          <details><summary>Glossary</summary><dl className="alg-glossary">{glossary.map((item) => <div key={item.term}><dt>{item.term}</dt><dd>{item.meaning}</dd></div>)}</dl></details>
          {onReset ? (
            confirmReset ? (
              <div className="alg-tile-actions">
                <button type="button" className="alg-gradient-button" onClick={() => { onReset(); setConfirmReset(false); }}>Confirm reset</button>
                <button type="button" onClick={() => setConfirmReset(false)}>Keep work</button>
              </div>
            ) : (
              <button type="button" className="alg-soft-button" onClick={() => setConfirmReset(true)}>Reset lab</button>
            )
          ) : null}
        </section>
      )}
      {panel === "Settings" && (
        <section className="alg-card">
          <h2>Display settings</h2>
          <label>Text size<select aria-label="Text size" value={fontScale} onChange={(e) => setFontScale(e.target.value as typeof fontScale)}><option value="base">Standard</option><option value="large">Large</option><option value="xlarge">Extra large</option></select></label>
          <label><input type="checkbox" checked={reducedMotion} onChange={(e) => setReducedMotion(e.target.checked)} />Reduce motion</label>
          <label><input type="checkbox" checked={exact} onChange={(e) => { setExact(e.target.checked); setExactMode(e.target.checked); }} />Exact integer labels</label>
          <label><input type="checkbox" checked={freeze} onChange={(e) => { setFreeze(e.target.checked); setTeacherFreeze(e.target.checked); }} />Teacher freeze (projection)</label>
          <label><input type="checkbox" onChange={(e) => document.documentElement.classList.toggle("alg-hide-challenges", e.target.checked)} />Hide challenges</label>
          <button type="button" onClick={() => window.print()}>Print worksheet</button>
          <label className="alg-field">Save this experiment<input value={experimentName} onChange={(e) => setExperimentName(e.target.value)} placeholder="Period 3 warm-up" /></label>
          <button type="button" onClick={() => saveNamedExperiment(experimentName, `${location.pathname}${location.search}`)}>Save experiment</button>
        </section>
      )}
      {panel === "Jump" && modes && onMode ? (
        <section className="alg-card" role="dialog" aria-label="Jump to mode">
          <h2>Jump</h2>
          <p>Ctrl K — open a mode or paste the current URL.</p>
          {modes.map((item) => <button type="button" key={item} onClick={() => { onMode(item); setPanel(null); }}>{item}</button>)}
        </section>
      ) : null}
    </>
  );
}

export function MathExpr({ value }: { value: string }) {
  return <MathExpression value={value} />;
}

export function ExactBadge({ exact }: { exact: boolean }) {
  return <span className="alg-exact-badge">{exact ? "exact" : "approximate"}</span>;
}

export function DomainGuard({ message }: { message: string }) {
  return <p className="alg-domain-guard" role="status">{message}</p>;
}
