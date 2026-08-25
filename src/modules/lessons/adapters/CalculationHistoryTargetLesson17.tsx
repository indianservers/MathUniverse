import {
  Check,
  CheckCircle2,
  Clipboard,
  Copy,
  Eye,
  ExternalLink,
  FileText,
  History,
  Languages,
  Pin,
  RotateCcw,
  Search,
  Share2,
  ShieldCheck,
  Sparkles,
  Trophy,
  XCircle,
} from "lucide-react";
import { useEffect, useState } from "react";
import type { LessonAdapterProps } from "../types";
import "./CalculationHistoryTargetLesson17.css";

type HistoryAction = "reuse" | "copy" | "pin" | "inspect";

const TABS = [
  "Interaction + visualization",
  "Explain",
  "Examples",
  "Formulas",
  "Know more",
];

const ROWS = [
  { id: 1, expression: "7 × 8", result: "56", time: "Just now", source: "7 groups of 8 make 56." },
  { id: 2, expression: "56 / 7", result: "8", time: "2 min ago", source: "56 is reused from row 1, then divided by 7." },
  { id: 3, expression: "12 + 5", result: "17", time: "5 min ago", source: "12 and 5 are added directly." },
  { id: 4, expression: "17 × 4", result: "68", time: "7 min ago", source: "17 is reused from row 3, then multiplied by 4." },
] as const;

const ACTION_LABELS: Record<HistoryAction, string> = {
  reuse: "Reuse input",
  copy: "Copy result",
  pin: "Pin note",
  inspect: "Inspect source",
};

export default function CalculationHistoryTargetLesson17({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [selectedRow, setSelectedRow] = useState(1);
  const [lastAction, setLastAction] = useState<HistoryAction>("inspect");
  const [view, setView] = useState(0);
  const [pinnedRows, setPinnedRows] = useState<number[]>([]);
  const [copiedResult, setCopiedResult] = useState("");
  const [reusedExpression, setReusedExpression] = useState("");
  const [practiceChoice, setPracticeChoice] = useState<number | null>(1);
  const [practiceChecked, setPracticeChecked] = useState(true);
  const [shareState, setShareState] = useState("Share");
  const [workspaceOpen, setWorkspaceOpen] = useState(false);
  const active = ROWS.find((row) => row.id === selectedRow) ?? ROWS[0];

  const reset = (notify = true) => {
    setSelectedRow(1);
    setLastAction("inspect");
    setView(0);
    setPinnedRows([]);
    setCopiedResult("");
    setReusedExpression("");
    setPracticeChoice(1);
    setPracticeChecked(true);
    setShareState("Share");
    setWorkspaceOpen(false);
    if (notify) onInteraction();
  };

  useEffect(() => {
    setSelectedRow(1);
    setLastAction("inspect");
    setView(0);
    setPinnedRows([]);
    setCopiedResult("");
    setReusedExpression("");
    setPracticeChoice(1);
    setPracticeChecked(true);
    setShareState("Share");
    setWorkspaceOpen(false);
  }, [resetToken]);

  const chooseRow = (id: number) => {
    setSelectedRow(id);
    setLastAction("inspect");
    onInteraction();
  };

  const runAction = async (action: HistoryAction, id: number) => {
    const row = ROWS.find((item) => item.id === id) ?? ROWS[0];
    setSelectedRow(row.id);
    setLastAction(action);
    if (action === "reuse") setReusedExpression(row.expression);
    if (action === "copy") {
      setCopiedResult(row.result);
      try {
        await navigator.clipboard?.writeText(row.result);
      } catch {
        // The selected result remains visibly copied when clipboard permission is unavailable.
      }
    }
    if (action === "pin") {
      setPinnedRows((current) =>
        current.includes(row.id)
          ? current.filter((value) => value !== row.id)
          : [...current, row.id],
      );
    }
    onInteraction();
  };

  const share = async () => {
    const text = `${active.expression} = ${active.result}`;
    try {
      await navigator.clipboard?.writeText(text);
      setShareState("Copied link");
    } catch {
      setShareState("Ready to share");
    }
    onInteraction();
  };

  const correct = practiceChecked && practiceChoice === 1;
  const actionMessage =
    lastAction === "reuse"
      ? `Loaded ${active.expression} back into the calculator input.`
      : lastAction === "copy"
        ? `Copied ${active.result} with row ${active.id} still selected as its source.`
        : lastAction === "pin"
          ? pinnedRows.includes(active.id)
            ? `Pinned row ${active.id}: ${active.expression} = ${active.result}.`
            : `Removed the note from row ${active.id}.`
          : `Source verified: ${active.source}`;

  return (
    <div
      className="target-history-page"
      data-testid="calculator-mockup-0017"
      data-dedicated-lesson="17"
      data-object-model="selectable-provenance-history-row-reuse-copy-pin-inspection-dependency-chain-graded-practice-model"
      data-selected-row={selectedRow}
      data-last-action={lastAction}
      data-copied-result={copiedResult}
      data-reused-expression={reusedExpression}
      data-pinned-rows={pinnedRows.join(",")}
      data-practice-correct={correct}
      data-view={view}
    >
      <nav className="history-breadcrumb">
        <a href="/">←</a><a href="/">Home</a><span>›</span><a href="/lessons">Lessons</a><span>›</span>
        <a href="/lessons/core-workspaces">Core Workspaces</a><span>›</span><b>17 Calculation History</b>
      </nav>

      <header className="history-header">
        <div className="history-kickers"><span>CORE WORKSPACES</span><span>SCIENTIFIC CALCULATOR</span></div>
        <h1>Calculation History</h1>
        <p>A reliable record of expressions and results—so you can verify, reuse, and learn with confidence.</p>
        <div className="history-meta"><b>♙ Foundational–Advanced</b><b>ϟ Calculator Lab</b><b>▣ Scientific Calculator</b><b>◴ 6–10 min</b></div>
        <nav className="history-actions">
          <button type="button" onClick={() => onInteraction()}><Languages size={15} />English (English)<span>⌄</span></button>
          <button type="button" onClick={() => reset()}><RotateCcw size={15} />Reset</button>
          <button type="button" onClick={share}><Share2 size={15} />{shareState}</button>
          <button type="button" className={workspaceOpen ? "active" : ""} onClick={() => { setWorkspaceOpen((value) => !value); onInteraction(); }}><ExternalLink size={15} />Workspace</button>
        </nav>
      </header>

      <nav className="history-tabs" aria-label="Lesson views">
        {TABS.map((tab, index) => (
          <button type="button" className={view === index ? "active" : ""} onClick={() => { setView(index); onInteraction(); }} key={tab}>
            <span>{index === 0 ? "◉" : index === 1 ? "▣" : index === 2 ? "♧" : index === 3 ? "∑" : "✣"}</span>{tab}
          </button>
        ))}
      </nav>

      <main className="history-main">
        <section className="history-lab">
          <div className="history-lab-title">
            <div><small>CALCULATION HISTORY LAB</small><h2>Every result has a source. Verify before you reuse.</h2></div>
            <strong>△ &nbsp; Do not copy a result without its input</strong>
          </div>
          <div className="history-display" data-testid="history-equation-overlay">
            <span>{active.expression}</span><i>=</i><b>{active.result}</b><Sparkles size={23} />
          </div>
          <p className="history-timeline"><History size={14} /> History timeline (newest first)</p>

          <div className="history-table" role="table" aria-label="Calculation history">
            <div className="history-row history-row-head" role="row"><span>#</span><span>Expression (input)</span><span>=</span><span>Result</span><span>Time</span><span>Actions</span></div>
            {ROWS.map((row) => (
              <div className={`history-row ${selectedRow === row.id ? "selected" : ""}`} role="row" key={row.id} onClick={() => chooseRow(row.id)}>
                <b>{row.id}</b><strong>{row.expression}</strong><span>=</span><strong>{row.result}</strong><span>{row.time}</span>
                <div className="history-row-actions">
                  <button type="button" aria-label={`Reuse input from row ${row.id}`} onClick={(event) => { event.stopPropagation(); void runAction("reuse", row.id); }}><RotateCcw /><small>Reuse input</small></button>
                  <button type="button" aria-label={`Copy result from row ${row.id}`} onClick={(event) => { event.stopPropagation(); void runAction("copy", row.id); }}><Copy /><small>Copy result</small></button>
                  <button type="button" className={pinnedRows.includes(row.id) ? "active" : ""} aria-label={`Pin note for row ${row.id}`} onClick={(event) => { event.stopPropagation(); void runAction("pin", row.id); }}><Pin /><small>Pin note</small></button>
                  <button type="button" aria-label={`Inspect source for row ${row.id}`} onClick={(event) => { event.stopPropagation(); void runAction("inspect", row.id); }}><Search /><small>Inspect source</small></button>
                </div>
              </div>
            ))}
          </div>
          <div className="history-action-key">
            {(Object.keys(ACTION_LABELS) as HistoryAction[]).map((action) => (
              <button type="button" key={action} onClick={() => void runAction(action, active.id)}>
                {action === "reuse" ? <RotateCcw /> : action === "copy" ? <Copy /> : action === "pin" ? <Pin /> : <Search />}
                <span><b>{ACTION_LABELS[action]}</b><small>{action === "reuse" ? "Use this expression again" : action === "copy" ? "Copy the result value" : action === "pin" ? "Add a quick note" : "View full expression details"}</small></span>
              </button>
            ))}
          </div>
          <output className="history-feedback">{actionMessage}</output>
        </section>

        <aside className="history-side">
          <section>
            <small className="history-uppercase">Concept trace</small><h3>Calculation history essentials</h3>
            <div className="history-trace"><i><FileText /></i><span><small>LATEST INPUT</small><b>{active.expression}</b></span></div>
            <div className="history-trace"><i><Sparkles /></i><span><small>LATEST RESULT</small><b>{active.result}</b></span></div>
            <div className="history-trace"><i><Clipboard /></i><span><small>ROWS STORED</small><b>Expression + result</b></span></div>
            <div className="history-trace"><i><ShieldCheck /></i><span><small>REUSE SAFELY</small><b>Check the source expression</b></span></div>
          </section>
          <section className="history-chain">
            <small>DEPENDENCY CHAIN</small><h3>Reuse only with the source</h3>
            <div><b>7 × 8 = 56</b><span>(original expression)</span></div><em>↓</em>
            <div><b>56 / 7 = 8</b><span>(uses 56 from above)</span><CheckCircle2 /></div><em>↓</em>
            <div className="wrong"><b>56 + 3 = 59</b><span>(do not reuse blindly)</span><XCircle /></div>
            <p><ShieldCheck /> Keep the source visible. Reuse with confidence.</p>
          </section>
        </aside>
      </main>

      <section className="history-practice">
        <div className="history-question"><Trophy /><span><small>PRACTICE CHECK</small><b>Which history row produced 56?</b></span></div>
        <div className="history-choices">
          {[2, 3, 4, 1].map((id, index) => (
            <button type="button" className={practiceChoice === id ? "selected" : ""} key={id} onClick={() => { setPracticeChoice(id); setPracticeChecked(true); onInteraction(); }}>
              <i>{String.fromCharCode(65 + index)}</i> Row {id}{practiceChecked && practiceChoice === id && id === 1 ? <CheckCircle2 /> : null}
            </button>
          ))}
        </div>
        <div className={`history-practice-result ${practiceChecked ? (correct ? "correct" : "wrong") : "pending"}`}>
          {practiceChecked ? (correct ? <Check /> : <XCircle />) : <Eye />}
          <span><b>{practiceChecked ? (correct ? "Correct!" : "Check the selected source") : "Answer ready"}</b><small>{practiceChecked ? (correct ? "Row 1 produced 56." : "Inspect the expression paired with 56.") : "Select Check answer to grade it."}</small><strong>{correct ? "7 × 8 = 56" : "Expression + result"}</strong></span>
        </div>
      </section>

      <nav className="history-neighbors"><a href="/lessons/foundational-advanced/16-constants-library">← <span><small>PREVIOUS</small><b>Constants Library</b></span></a><a href="/lessons/foundational-advanced/18-exact-and-decimal-modes"><span><small>NEXT</small><b>Exact and Decimal Modes</b></span> →</a></nav>
    </div>
  );
}
