import { AlertTriangle, BrainCircuit, CheckCircle2, CirclePause, Compass, Lightbulb, Play, ShieldCheck, Sparkles, Square, X } from "lucide-react";
import { useState } from "react";
import type {
  BoardIntelligencePersistence,
  SmartBoardIntelligenceMode,
  SmartBoardRecommendation,
  SmartBoardUnderstandingResult,
  SmartBoardWorkflowPlan,
} from "./boardIntelligenceTypes";

type Props = {
  intelligence: BoardIntelligencePersistence;
  understanding: SmartBoardUnderstandingResult | null;
  analyzing: boolean;
  workflowRunning: boolean;
  onAnalyze: () => void;
  onChange: (next: BoardIntelligencePersistence) => void;
  onRecommendation: (recommendation: SmartBoardRecommendation) => void;
  onDismissRecommendation: (recommendation: SmartBoardRecommendation, mode: "dismiss" | "snooze" | "hide-similar") => void;
  onPlan: (command: string) => void;
  onApproveAll: () => void;
  onApproveStep: (stepId: string) => void;
  onRun: () => void;
  onCancel: () => void;
  onRetry: (stepId: string) => void;
  onSkip: (stepId: string) => void;
};

const modes: Array<{ value: SmartBoardIntelligenceMode; label: string }> = [
  { value: "manual", label: "Manual" },
  { value: "assistive", label: "Assistive" },
  { value: "guided-learning", label: "Guided learning" },
  { value: "fast-solve", label: "Fast solve" },
  { value: "exploration", label: "Exploration" },
];

export default function BoardIntelligencePanel(props: Props) {
  const [command, setCommand] = useState("");
  const understanding = props.understanding;
  const workflow = props.intelligence.activeWorkflow;
  const mode = props.intelligence.sessionMemory.userPreferences.intelligenceMode;

  return (
    <section data-testid="board-intelligence" aria-label="Smart Board Intelligence" className="mb-4 border-b border-slate-200 pb-4 dark:border-white/10">
      <div className="flex items-start justify-between gap-2">
        <div>
          <h2 className="flex items-center gap-2 font-bold"><Sparkles className="h-4 w-4" />Intelligence</h2>
          <p className="text-xs text-slate-500">Selection-scoped · deterministic engines</p>
        </div>
        <span className="mini-chip"><ShieldCheck className="h-3.5 w-3.5" />AI off</span>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2">
        <label className="text-xs font-semibold">Mode
          <select
            className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-2 py-2 dark:border-white/10 dark:bg-slate-950"
            value={mode}
            onChange={(event) => props.onChange({
              ...props.intelligence,
              sessionMemory: {
                ...props.intelligence.sessionMemory,
                userPreferences: {
                  ...props.intelligence.sessionMemory.userPreferences,
                  intelligenceMode: event.target.value as SmartBoardIntelligenceMode,
                },
                updatedAt: new Date().toISOString(),
              },
            })}
          >
            {modes.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
          </select>
        </label>
        <label className="flex min-h-11 items-center gap-2 self-end text-xs font-semibold">
          <input
            type="checkbox"
            checked={props.intelligence.sessionMemory.userPreferences.proactiveRecommendations}
            disabled={mode === "manual"}
            onChange={(event) => props.onChange({
              ...props.intelligence,
              sessionMemory: {
                ...props.intelligence.sessionMemory,
                userPreferences: {
                  ...props.intelligence.sessionMemory.userPreferences,
                  proactiveRecommendations: event.target.checked,
                },
                updatedAt: new Date().toISOString(),
              },
            })}
          />
          Suggestions
        </label>
      </div>

      <button type="button" className="action-primary mt-3 w-full justify-center" onClick={props.onAnalyze} disabled={props.analyzing}>
        <BrainCircuit className="h-4 w-4" />{props.analyzing ? "Understanding…" : "Understand selection"}
      </button>

      <div className="sr-only" aria-live="polite">
        {understanding ? `Analysis complete. ${understanding.recommendations.length} recommendations available.` : ""}
      </div>

      {understanding && (
        <div className="mt-3 space-y-3">
          <div className="rounded-lg bg-slate-100 p-3 text-sm dark:bg-white/5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="mini-chip">{understanding.primarySubject ?? "Subject unresolved"}</span>
              <span className="mini-chip">{confidenceLabel(understanding.subjectConfidence)}</span>
              <span className="mini-chip">{understanding.intelligenceMode}</span>
            </div>
            <p className="mt-2 font-semibold">{understanding.detectedConcepts[0]?.label ?? "Concept needs confirmation"}</p>
            <p className="mt-1 text-xs text-slate-500">
              Goal: {understanding.inferredGoal?.type ?? "understand"} · {understanding.contextMetrics.elementCount} relevant element{understanding.contextMetrics.elementCount === 1 ? "" : "s"}
            </p>
          </div>

          {(understanding.knownFacts.length > 0 || understanding.unknownFacts.length > 0) && (
            <details>
              <summary className="cursor-pointer text-sm font-bold">What the Board understands</summary>
              <dl className="mt-2 space-y-1 text-xs">
                {understanding.knownFacts.slice(0, 4).map((fact) => (
                  <div key={`${fact.label}-${fact.value}`} className="flex justify-between gap-3">
                    <dt className="text-slate-500">{fact.label}</dt><dd className="min-w-0 truncate text-right font-semibold">{fact.value}</dd>
                  </div>
                ))}
                {understanding.unknownFacts.slice(0, 3).map((fact) => (
                  <div key={fact.label} className="flex gap-2 text-amber-700 dark:text-amber-300">
                    <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" /><span>{fact.label}: {fact.reason}</span>
                  </div>
                ))}
              </dl>
            </details>
          )}

          {understanding.warnings.map((warning) => (
            <p key={warning} className="flex gap-2 rounded-lg bg-amber-50 p-2 text-xs text-amber-900 dark:bg-amber-400/10 dark:text-amber-100">
              <AlertTriangle className="h-3.5 w-3.5 shrink-0" />{warning}
            </p>
          ))}

          {!props.intelligence.recommendationsDisabled && understanding.recommendations.length > 0 && (
            <section aria-label="Recommended actions">
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-sm font-bold">Next best actions</h3>
                <button
                  type="button"
                  className="text-xs text-slate-500 underline"
                  onClick={() => props.onChange({ ...props.intelligence, recommendationsDisabled: true })}
                >
                  Disable
                </button>
              </div>
              <ul className="mt-2 space-y-2">
                {understanding.recommendations.slice(0, 5).map((recommendation) => (
                  <li key={recommendation.id} className="rounded-lg bg-slate-100 p-2 dark:bg-white/5">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="font-semibold">{recommendation.title}</p>
                        <p className="mt-0.5 text-xs text-slate-500">{recommendation.reason}</p>
                        <p className="mt-1 text-xs">{recommendation.engine?.label ?? recommendation.subject}{recommendation.requiredConfirmation ? " · confirmation required" : ""}</p>
                      </div>
                      <button
                        type="button"
                        className="tool-button min-h-8 shrink-0 px-2"
                        onClick={() => props.onRecommendation(recommendation)}
                        disabled={!recommendation.enabled}
                        title={recommendation.disabledReason}
                      >
                        {recommendation.enabled ? "Use" : "Unavailable"}
                      </button>
                    </div>
                    {recommendation.disabledReason && <p className="mt-1 text-xs text-amber-700 dark:text-amber-300">{recommendation.disabledReason}</p>}
                    <div className="mt-2 flex flex-wrap gap-2">
                      <button type="button" className="text-xs underline" onClick={() => props.onDismissRecommendation(recommendation, "dismiss")}>Dismiss</button>
                      <button type="button" className="text-xs underline" onClick={() => props.onDismissRecommendation(recommendation, "snooze")}>Snooze</button>
                      <button type="button" className="text-xs underline" onClick={() => props.onDismissRecommendation(recommendation, "hide-similar")}>Hide similar</button>
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {props.intelligence.recommendationsDisabled && (
            <button type="button" className="tool-button w-full justify-center" onClick={() => props.onChange({ ...props.intelligence, recommendationsDisabled: false })}>
              Enable Board recommendations
            </button>
          )}
        </div>
      )}

      <form className="mt-3" onSubmit={(event) => {
        event.preventDefault();
        if (!command.trim()) return;
        props.onPlan(command.trim());
      }}>
        <label className="text-xs font-semibold">Plan a workflow
          <input
            className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 dark:border-white/10 dark:bg-slate-950"
            value={command}
            onChange={(event) => setCommand(event.target.value)}
            placeholder="Solve and graph this"
            maxLength={240}
          />
        </label>
        <button type="submit" className="tool-button mt-2 w-full justify-center"><Compass className="h-4 w-4" />Review plan</button>
      </form>

      {workflow && <WorkflowView workflow={workflow} running={props.workflowRunning} {...props} />}
    </section>
  );
}

function WorkflowView(props: Props & { workflow: SmartBoardWorkflowPlan; running: boolean }) {
  const { workflow } = props;
  return (
    <section className="mt-3 rounded-lg bg-slate-100 p-3 dark:bg-white/5" aria-label="Active intelligence workflow">
      <div className="flex items-start justify-between gap-2">
        <div><h3 className="text-sm font-bold">{workflow.title}</h3><p className="text-xs text-slate-500">{workflow.status} · reviewable and cancellable</p></div>
        <span className="mini-chip">{workflow.primarySubject}</span>
      </div>
      <ol className="mt-2 space-y-2">
        {workflow.steps.map((step) => (
          <li key={step.id} className="text-xs">
            <div className="flex items-center gap-2">
              {step.status === "success" ? <CheckCircle2 className="h-4 w-4 text-emerald-600" /> : step.status === "running" ? <CirclePause className="h-4 w-4" /> : <span className="grid h-4 w-4 place-items-center rounded-full bg-slate-200 text-[10px] dark:bg-white/10">{step.order}</span>}
              <span className="flex-1 font-semibold">{step.title}</span>
              <span className="text-slate-500">{step.status}</span>
            </div>
            {step.error && <p className="ml-6 mt-1 text-rose-600">{step.error}</p>}
            <div className="ml-6 mt-1 flex flex-wrap gap-2">
              {step.status === "pending" && <button type="button" className="underline" onClick={() => props.onApproveStep(step.id)}>Approve step</button>}
              {step.status === "failed" && step.canRetry && <button type="button" className="underline" onClick={() => props.onRetry(step.id)}>Retry</button>}
              {(step.status === "pending" || step.status === "approved" || step.status === "failed") && step.canSkip && <button type="button" className="underline" onClick={() => props.onSkip(step.id)}>Skip</button>}
            </div>
          </li>
        ))}
      </ol>
      <div className="mt-3 flex flex-wrap gap-2">
        {workflow.status === "draft" && <button type="button" className="tool-button" onClick={props.onApproveAll}><CheckCircle2 className="h-4 w-4" />Approve safe steps</button>}
        {!["completed", "cancelled"].includes(workflow.status) && (
          <button type="button" className="action-primary" onClick={props.onRun} disabled={props.running || !workflow.steps.some((step) => step.status === "approved")}>
            <Play className="h-4 w-4" />{props.running ? "Running…" : "Run approved"}
          </button>
        )}
        {!["completed", "cancelled"].includes(workflow.status) && <button type="button" className="tool-button" onClick={props.onCancel}><Square className="h-4 w-4" />Cancel</button>}
      </div>
      {workflow.status === "completed" && <p className="mt-2 flex items-center gap-2 text-xs font-semibold text-emerald-700 dark:text-emerald-300"><Lightbulb className="h-4 w-4" />Compare the roots with the graph’s x-intercepts.</p>}
      {workflow.status === "cancelled" && <p className="mt-2 flex items-center gap-2 text-xs"><X className="h-4 w-4" />The workflow stopped without changing unfinished steps.</p>}
    </section>
  );
}

function confidenceLabel(value: SmartBoardUnderstandingResult["subjectConfidence"]) {
  if (value === "high") return "High confidence";
  if (value === "review-recommended") return "Review recommended";
  if (value === "needs-confirmation") return "Needs confirmation";
  return "Unresolved";
}
