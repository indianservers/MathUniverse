import {
  ArrowLeft,
  ArrowRight,
  Award,
  BookOpen,
  CheckCircle2,
  ChevronDown,
  ClipboardCheck,
  Copy,
  ExternalLink,
  Eye,
  Keyboard,
  Languages,
  Lightbulb,
  Maximize2,
  NotebookText,
  PanelTop,
  RotateCcw,
  Share2,
  ShieldCheck,
  Sigma,
  SlidersHorizontal,
  Sparkles,
  Target,
  Timer,
  X,
  Zap,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import MathExpression from "../../../components/ui/MathExpression";
import { adjacentLessons } from "../catalog/lessonCatalog";
import {
  createLegacyInteractionEvent,
  hasRequiredLessonEvidence,
} from "../engine/lessonInteraction";
import {
  isLessonLanguageCode,
  lessonLanguageOptions,
  loadLessonLocalizedContent,
} from "../engine/lessonLanguages";
import {
  clearLessonProgress,
  defaultLessonProgress,
  readLessonProgress,
  writeLessonProgress,
} from "../engine/lessonPersistence";
import { getStrengthenedFoundationLesson } from "../strengthening/foundationNumberContent";
import type { StrengthenedLesson } from "../strengthening/strengthenedLessonSchema";
import type {
  LessonContent,
  LessonDefinition,
  LessonLanguageCode,
  LessonProgress,
} from "../types";
import LessonSurface from "./LessonSurface";

type LessonInfoTab = "interaction" | "learn" | "examples" | "formulas" | "more";

type LessonVisualState = {
  pointA: number;
  pointB: number;
  verticalShift: number;
  showProjections: boolean;
  showGrid: boolean;
};

const defaultVisualState: LessonVisualState = {
  pointA: -4,
  pointB: 4,
  verticalShift: 0,
  showProjections: true,
  showGrid: true,
};

export default function LessonShell({ lesson }: { lesson: LessonDefinition }) {
  const [progress, setProgress] = useState<LessonProgress>(() =>
    readLessonProgress(lesson),
  );
  const [resetToken, setResetToken] = useState(0);
  const [shareStatus, setShareStatus] = useState("");
  const [shareOpen, setShareOpen] = useState(false);
  const [focusMode, setFocusMode] = useState(false);
  const [visualState, setVisualState] = useState<LessonVisualState>(() =>
    readVisualStateFromUrl(),
  );
  const [languageCode, setLanguageCode] = useState<LessonLanguageCode>("en");
  const [languageContent, setLanguageContent] = useState<LessonContent | null>(
    null,
  );
  const [languageStatus, setLanguageStatus] = useState("");
  const [infoTab, setInfoTab] = useState<LessonInfoTab>("interaction");
  const interacted = useMemo(
    () => hasRequiredLessonEvidence(lesson, progress.interactionHistory),
    [lesson, progress.interactionHistory],
  );
  const adjacent = useMemo(() => adjacentLessons(lesson), [lesson]);
  const strengthenedLesson = useMemo(
    () => getStrengthenedFoundationLesson(lesson.id),
    [lesson.id],
  );
  const selectedLanguage =
    lessonLanguageOptions.find((option) => option.code === languageCode) ??
    lessonLanguageOptions[0];
  const localizedContent = languageContent ?? lesson.content;

  useEffect(() => {
    setProgress(readLessonProgress(lesson));
    setShareStatus("");
  }, [lesson]);
  useEffect(() => {
    writeLessonProgress(lesson.id, progress);
  }, [lesson.id, progress]);
  useEffect(() => {
    let cancelled = false;
    if (languageCode === "en") {
      setLanguageContent(null);
      setLanguageStatus("");
      return () => {
        cancelled = true;
      };
    }
    setLanguageContent(null);
    setLanguageStatus("Loading language pack...");
    void loadLessonLocalizedContent(languageCode, lesson)
      .then((content) => {
        if (cancelled) return;
        setLanguageContent(content);
        setLanguageStatus(
          `${selectedLanguage.englishName} lesson language loaded for this lesson.`,
        );
      })
      .catch(() => {
        if (cancelled) return;
        setLanguageContent(null);
        setLanguageStatus(
          "Language pack could not be loaded. Showing English.",
        );
      });
    return () => {
      cancelled = true;
    };
  }, [languageCode, lesson, selectedLanguage.englishName]);

  const recordInteraction = (event = createLegacyInteractionEvent(lesson)) => {
    setProgress((current) => ({
      ...current,
      interactionHistory: [...current.interactionHistory, event].slice(-40),
      ...(current.stage === "discover" && current.prediction.trim()
        ? { stage: "explore" as const }
        : {}),
      updatedAt: Date.now(),
    }));
  };
  const reset = () => {
    clearLessonProgress(lesson.id);
    setProgress(defaultLessonProgress(lesson));
    setShareStatus("");
    setVisualState(defaultVisualState);
    setResetToken((value) => value + 1);
  };
  const shareUrl = useMemo(() => buildShareUrl(visualState), [visualState]);
  const copyShareLink = async () => {
    const url = shareUrl;
    await navigator.clipboard?.writeText(url);
    setShareStatus("Lesson state link copied.");
  };
  const usesImmersiveFunctionWorkspace =
    (lesson.id >= 143 && lesson.id <= 152) ||
    lesson.id === 153 ||
    lesson.id === 154 ||
    (lesson.id >= 156 && lesson.id <= 162) ||
    lesson.id === 164 ||
    (lesson.id >= 1 && lesson.id <= 38) ||
    (lesson.id >= 57 && lesson.id <= 65) ||
    lesson.id === 257 ||
    lesson.id === 258 ||
    lesson.id === 259 ||
    lesson.id === 260 ||
    lesson.id === 261 ||
    lesson.id === 262 ||
    lesson.id === 263 ||
    lesson.id === 264 ||
    lesson.id === 265 ||
    lesson.id === 266 ||
    lesson.id === 267 ||
    lesson.id === 268 ||
    lesson.id === 269 ||
    lesson.id === 270 ||
    lesson.id === 271 ||
    lesson.id === 272 ||
    lesson.id === 273 ||
    lesson.id === 274 ||
    lesson.id === 275;
  const usesTargetGraphingWorkspace = lesson.id >= 39 && lesson.id <= 56;
  const usesImmersiveDynamicGeometryWorkspace =
    lesson.id >= 198 && lesson.id <= 256;
  const usesTargetTrigonometryWorkspace = lesson.id >= 257 && lesson.id <= 276;
  const usesTargetStatisticsWorkspace = lesson.id >= 467 && lesson.id <= 499;
  const usesTargetProbabilityWorkspace = lesson.id >= 500 && lesson.id <= 536;
  const usesTargetLimitsDifferentialWorkspace =
    lesson.id >= 277 && lesson.id <= 305;
  const usesTargetIntegralDifferentialWorkspace =
    lesson.id >= 306 && lesson.id <= 333;
  const usesTargetSymbolicCasWorkspace = lesson.id >= 428 && lesson.id <= 449;

  if (usesImmersiveFunctionWorkspace || usesImmersiveDynamicGeometryWorkspace) {
    return (
      <div
        className="lesson-page-shell space-y-3"
        data-testid="lesson-page"
        data-lesson-id={lesson.id}
      >
        <LessonSurface
          lesson={lesson}
          resetToken={resetToken}
          onInteraction={recordInteraction}
        />
        {usesImmersiveDynamicGeometryWorkspace ||
        (lesson.id >= 1 && lesson.id <= 38) ||
        (lesson.id >= 57 && lesson.id <= 65) ||
        lesson.id === 257 ||
        lesson.id === 258 ||
        lesson.id === 259 ||
        lesson.id === 260 ||
        lesson.id === 261 ||
        lesson.id === 262 ||
        lesson.id === 263 ||
        lesson.id === 264 ||
        lesson.id === 265 ||
        lesson.id === 266 ||
        lesson.id === 267 ||
        lesson.id === 268 ||
        lesson.id === 269 ||
        lesson.id === 270 ||
        lesson.id === 271 ||
        lesson.id === 272 ||
        lesson.id === 273 ||
        lesson.id === 274 ||
        lesson.id === 275 ? null : (
          <nav
            className="lesson-adjacent-nav grid gap-3 sm:grid-cols-2"
            aria-label="Adjacent lessons"
          >
            {adjacent.previous ? (
              <Link
                className="action-secondary justify-start"
                to={adjacent.previous.route}
              >
                <ArrowLeft className="h-4 w-4" />
                <span>
                  <span className="block text-[10px] font-black uppercase text-slate-500 dark:text-slate-300">
                    Previous
                  </span>
                  <span className="line-clamp-1">
                    {adjacent.previous.title}
                  </span>
                </span>
              </Link>
            ) : (
              <span />
            )}
            {adjacent.next ? (
              <Link
                className="action-secondary justify-end text-right"
                to={adjacent.next.route}
              >
                <span>
                  <span className="block text-[10px] font-black uppercase text-slate-500 dark:text-slate-300">
                    Next
                  </span>
                  <span className="line-clamp-1">{adjacent.next.title}</span>
                </span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            ) : (
              <span />
            )}
          </nav>
        )}
      </div>
    );
  }

  return (
    <div
      className="lesson-page-shell space-y-3"
      data-testid="lesson-page"
      data-lesson-id={lesson.id}
    >
      <header className="lesson-shell-header overflow-hidden rounded-2xl border border-slate-200 bg-white/95 shadow-xl shadow-cyan-950/5 backdrop-blur dark:border-white/10 dark:bg-slate-950/80">
        <div className="p-4 sm:p-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="lesson-topic-pills flex flex-wrap items-center gap-2 text-[10px] font-black uppercase tracking-wide">
                <Link
                  className="lesson-topic-pill is-primary rounded-full bg-cyan-50 px-2.5 py-1 text-cyan-700 transition hover:bg-cyan-100 dark:bg-cyan-300/10 dark:text-cyan-100"
                  to={`/lessons/${lesson.categorySlug}`}
                >
                  {lesson.category}
                </Link>
                <span className="lesson-topic-pill rounded-full bg-slate-100 px-2.5 py-1 text-slate-600 dark:bg-white/10 dark:text-slate-300">
                  {lesson.topic}
                </span>
              </div>
              <h1 className="lesson-shell-title mt-2 break-words text-2xl font-black leading-tight text-slate-950 dark:text-white sm:text-3xl">
                {lesson.title}
              </h1>
              <p className="lesson-shell-purpose mt-2 max-w-4xl text-sm font-semibold leading-6 text-slate-600 dark:text-slate-300">
                {lesson.purpose}
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <InfoChip
                  icon={<Award className="h-3.5 w-3.5" />}
                  label={lesson.level}
                />
                <InfoChip
                  icon={<Zap className="h-3.5 w-3.5" />}
                  label={lesson.mode}
                />
                <InfoChip
                  icon={<PanelTop className="h-3.5 w-3.5" />}
                  label={lesson.feature}
                />
                <InfoChip
                  icon={<Timer className="h-3.5 w-3.5" />}
                  label="6-10 min"
                />
              </div>
            </div>
            <div className="lesson-shell-actions flex flex-wrap gap-2">
              <label
                className="lesson-language-select inline-flex min-h-10 items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs font-black text-slate-700 dark:border-white/10 dark:bg-white/10 dark:text-slate-200"
                title="Load a lesson language pack on demand"
              >
                <Languages className="h-4 w-4 text-cyan-600 dark:text-cyan-300" />
                <select
                  className="bg-transparent text-xs font-black outline-none"
                  aria-label="Lesson language"
                  value={languageCode}
                  onChange={(event) => {
                    const nextCode = event.target.value;
                    if (isLessonLanguageCode(nextCode))
                      setLanguageCode(nextCode);
                  }}
                >
                  {lessonLanguageOptions.map((option) => (
                    <option key={option.code} value={option.code}>
                      {option.nativeName} ({option.englishName})
                    </option>
                  ))}
                </select>
              </label>
              <button
                type="button"
                className="action-secondary"
                onClick={reset}
                title="Reset lesson progress"
              >
                <RotateCcw className="h-4 w-4" />
                Reset
              </button>
              <button
                type="button"
                className="action-secondary"
                onClick={() => setShareOpen(true)}
                title="Share lesson state"
              >
                <Share2 className="h-4 w-4" />
                Share
              </button>
              <Link
                className="action-secondary"
                to={workspaceRoute(lesson)}
                title="Open related workspace"
              >
                <ExternalLink className="h-4 w-4" />
                Workspace
              </Link>
            </div>
          </div>
          {shareStatus ? (
            <p
              className="mt-3 rounded-lg bg-emerald-50 p-2 text-xs font-black text-emerald-800 dark:bg-emerald-300/10 dark:text-emerald-100"
              role="status"
            >
              {shareStatus}
            </p>
          ) : null}
        </div>
      </header>

      <LessonTabBar active={infoTab} onChange={setInfoTab} />

      <div className="grid items-start gap-3">
        <main className="space-y-3">
          {infoTab === "interaction" ? (
            <section
              id="lesson-panel-interaction"
              role="tabpanel"
              className={`lesson-workbench rounded-2xl border border-cyan-100 bg-white/90 p-3 shadow-lg shadow-cyan-950/5 dark:border-white/10 dark:bg-slate-950/75${usesTargetGraphingWorkspace || usesTargetTrigonometryWorkspace || usesTargetStatisticsWorkspace || usesTargetProbabilityWorkspace || usesTargetLimitsDifferentialWorkspace || usesTargetIntegralDifferentialWorkspace || usesTargetSymbolicCasWorkspace ? " is-target-graphing-workbench" : ""}`}
              aria-label="Lesson interaction and visualization"
            >
              {usesTargetGraphingWorkspace ||
              usesTargetTrigonometryWorkspace ||
              usesTargetStatisticsWorkspace ||
              usesTargetProbabilityWorkspace ||
              usesTargetLimitsDifferentialWorkspace ||
              usesTargetIntegralDifferentialWorkspace ||
              usesTargetSymbolicCasWorkspace ? null : (
                <div className="lesson-workbench-heading mb-3 flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-wide text-cyan-600 dark:text-cyan-300">
                      Interaction + visualization
                    </p>
                    <h2 className="mt-1 text-xl font-black text-slate-950 dark:text-white">
                      Work directly on the model
                    </h2>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <StatusPill
                      active={interacted}
                      activeText="Live evidence recorded"
                      idleText="Awaiting interaction"
                    />
                    <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-black text-slate-700 dark:border-white/10 dark:bg-white/10 dark:text-slate-200">
                      {progress.interactionHistory.length} actions
                    </span>
                    <button
                      type="button"
                      className="lesson-icon-button"
                      onClick={() => setFocusMode(true)}
                      aria-label="Open full screen visual lab"
                    >
                      <Maximize2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )}
              <LessonSurface
                lesson={lesson}
                resetToken={resetToken}
                onInteraction={(event) =>
                  recordInteraction(
                    event ?? createLegacyInteractionEvent(lesson),
                  )
                }
              />
              {usesTargetGraphingWorkspace ||
              usesTargetTrigonometryWorkspace ||
              usesTargetStatisticsWorkspace ||
              usesTargetProbabilityWorkspace ||
              usesTargetLimitsDifferentialWorkspace ||
              usesTargetIntegralDifferentialWorkspace ||
              usesTargetSymbolicCasWorkspace ? null : (
                <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
                  {lesson.contract.requiredControlIds.map((control) => (
                    <Tag
                      key={control}
                      icon={<SlidersHorizontal className="h-3.5 w-3.5" />}
                      label={control}
                    />
                  ))}
                  {lesson.contract.workspaceObjects
                    .slice(0, 3)
                    .map((object) => (
                      <Tag
                        key={object}
                        icon={<PanelTop className="h-3.5 w-3.5" />}
                        label={object}
                      />
                    ))}
                </div>
              )}
            </section>
          ) : (
            <LessonContentPanel
              lesson={lesson}
              content={localizedContent}
              language={selectedLanguage}
              status={languageStatus}
              activeTab={infoTab}
              strengthenedLesson={strengthenedLesson}
            />
          )}
        </main>
      </div>

      <nav
        className="lesson-adjacent-nav grid gap-3 sm:grid-cols-2"
        aria-label="Adjacent lessons"
      >
        {adjacent.previous ? (
          <Link
            className="action-secondary justify-start"
            to={adjacent.previous.route}
          >
            <ArrowLeft className="h-4 w-4" />
            <span>
              <span className="block text-[10px] font-black uppercase text-slate-500 dark:text-slate-300">
                Previous
              </span>
              <span className="line-clamp-1">{adjacent.previous.title}</span>
            </span>
          </Link>
        ) : (
          <span />
        )}
        {adjacent.next ? (
          <Link
            className="action-secondary justify-end text-right"
            to={adjacent.next.route}
          >
            <span>
              <span className="block text-[10px] font-black uppercase text-slate-500 dark:text-slate-300">
                Next
              </span>
              <span className="line-clamp-1">{adjacent.next.title}</span>
            </span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        ) : (
          <span />
        )}
      </nav>
      {focusMode ? (
        <VisualFocusOverlay
          lesson={lesson}
          state={visualState}
          onStateChange={setVisualState}
          onInteraction={recordInteraction}
          onClose={() => setFocusMode(false)}
        />
      ) : null}
      {shareOpen ? (
        <LessonShareModal
          lesson={lesson}
          state={visualState}
          shareUrl={shareUrl}
          status={shareStatus}
          onCopy={copyShareLink}
          onClose={() => setShareOpen(false)}
        />
      ) : null}
    </div>
  );
}

function VisualFocusOverlay({
  lesson,
  state,
  onStateChange,
  onInteraction,
  onClose,
}: {
  lesson: LessonDefinition;
  state: LessonVisualState;
  onStateChange: (state: LessonVisualState) => void;
  onInteraction: () => void;
  onClose: () => void;
}) {
  return (
    <div
      className="lesson-focus-overlay"
      role="dialog"
      aria-modal="true"
      aria-label="Full screen visual lab"
    >
      <div className="lesson-focus-topbar">
        <div>
          <p className="text-[10px] font-black uppercase tracking-wide text-cyan-200">
            Visual focus mode
          </p>
          <h2>{lesson.title}</h2>
        </div>
        <button type="button" className="lesson-focus-close" onClick={onClose}>
          <X className="h-4 w-4" />
          Close
        </button>
      </div>
      <div className="lesson-focus-canvas">
        <LessonStateGraph state={state} title={lesson.title} large />
      </div>
      <div className="lesson-focus-controls">
        <LabSlider
          label="Point A (x)"
          min={-5}
          max={0}
          step={0.5}
          value={state.pointA}
          onChange={(pointA) => {
            onStateChange({ ...state, pointA });
            onInteraction();
          }}
        />
        <LabSlider
          label="Point B (x)"
          min={0}
          max={5}
          step={0.5}
          value={state.pointB}
          onChange={(pointB) => {
            onStateChange({ ...state, pointB });
            onInteraction();
          }}
        />
        <LabSlider
          label="Vertical shift"
          min={-2}
          max={2}
          step={0.25}
          value={state.verticalShift}
          onChange={(verticalShift) => {
            onStateChange({ ...state, verticalShift });
            onInteraction();
          }}
        />
        <label className="lesson-toggle-row">
          <input
            type="checkbox"
            checked={state.showProjections}
            onChange={(event) => {
              onStateChange({
                ...state,
                showProjections: event.target.checked,
              });
              onInteraction();
            }}
          />
          Projections
        </label>
        <label className="lesson-toggle-row">
          <input
            type="checkbox"
            checked={state.showGrid}
            onChange={(event) => {
              onStateChange({ ...state, showGrid: event.target.checked });
              onInteraction();
            }}
          />
          Grid
        </label>
      </div>
    </div>
  );
}

function LessonShareModal({
  lesson,
  state,
  shareUrl,
  status,
  onCopy,
  onClose,
}: {
  lesson: LessonDefinition;
  state: LessonVisualState;
  shareUrl: string;
  status: string;
  onCopy: () => void;
  onClose: () => void;
}) {
  return (
    <div
      className="lesson-share-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="lesson-share-title"
    >
      <section className="lesson-share-modal">
        <div className="lesson-share-header">
          <div>
            <p className="text-[10px] font-black uppercase tracking-wide text-cyan-700">
              Share current visual state
            </p>
            <h2 id="lesson-share-title">{lesson.title}</h2>
          </div>
          <button
            type="button"
            className="lesson-icon-button"
            onClick={onClose}
            aria-label="Close share modal"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="lesson-share-grid">
          <div>
            <p className="text-xs font-black uppercase text-slate-500">
              Exact preview
            </p>
            <div className="lesson-share-preview">
              <LessonStateGraph state={state} title={lesson.title} />
            </div>
          </div>
          <div className="lesson-share-details">
            <p>
              <strong>Step:</strong> visual exploration
            </p>
            <p>
              <strong>Domain:</strong> [
              {Math.min(state.pointA, state.pointB).toFixed(1)},{" "}
              {Math.max(state.pointA, state.pointB).toFixed(1)}]
            </p>
            <p>
              <strong>Vertical shift:</strong> {state.verticalShift.toFixed(2)}
            </p>
            <label>
              Link
              <input readOnly value={shareUrl} />
            </label>
            <button
              type="button"
              className="action-primary w-full justify-center"
              onClick={() => void onCopy()}
            >
              <Copy className="h-4 w-4" />
              Copy state link
            </button>
            {status ? (
              <p
                className="rounded-xl bg-emerald-50 p-3 text-sm font-black text-emerald-800"
                role="status"
              >
                {status}
              </p>
            ) : null}
          </div>
        </div>
      </section>
    </div>
  );
}

function LessonStateGraph({
  state,
  title,
  large = false,
}: {
  state: LessonVisualState;
  title: string;
  large?: boolean;
}) {
  const xA = toGraphX(state.pointA);
  const xB = toGraphX(state.pointB);
  const yA = toGraphY(graphY(state.pointA, state.verticalShift));
  const yB = toGraphY(graphY(state.pointB, state.verticalShift));
  const vertexY = toGraphY(2 + state.verticalShift);
  const domainLeft = Math.min(xA, xB);
  const domainWidth = Math.abs(xB - xA);
  return (
    <svg
      className={large ? "lesson-state-graph is-large" : "lesson-state-graph"}
      viewBox="0 0 640 420"
      role="img"
      aria-label={`${title} graph with domain and range projections`}
    >
      <rect width="640" height="420" rx="28" fill="#f8fbff" />
      {state.showGrid
        ? Array.from({ length: 14 }, (_, index) => (
            <line
              key={`grid-v-${index}`}
              x1={40 + index * 42}
              x2={40 + index * 42}
              y1="34"
              y2="374"
              stroke="#dbeafe"
            />
          ))
        : null}
      {state.showGrid
        ? Array.from({ length: 9 }, (_, index) => (
            <line
              key={`grid-h-${index}`}
              x1="42"
              x2="598"
              y1={40 + index * 38}
              y2={40 + index * 38}
              stroke="#dbeafe"
            />
          ))
        : null}
      <rect
        x={domainLeft}
        y={vertexY}
        width={domainWidth}
        height={Math.max(yA, yB) - vertexY}
        rx="18"
        fill="#8b5cf6"
        opacity=".13"
      />
      <line
        x1="60"
        y1="300"
        x2="590"
        y2="300"
        stroke="#0f172a"
        strokeWidth="2"
      />
      <line
        x1="320"
        y1="46"
        x2="320"
        y2="372"
        stroke="#0f172a"
        strokeWidth="2"
      />
      <path
        d="M 80 382 C 155 172 252 72 320 100 C 410 136 492 236 575 382"
        fill="none"
        stroke="#c4b5fd"
        strokeDasharray="9 9"
        strokeWidth="2"
      />
      <path
        d={parabolaPath(state.verticalShift)}
        fill="none"
        stroke="#4f46e5"
        strokeWidth="7"
        strokeLinecap="round"
      />
      {state.showProjections ? (
        <path
          d={`M ${xA} ${yA} L ${xA} 300 M ${xB} ${yB} L ${xB} 300 M 320 ${vertexY} L 590 ${vertexY}`}
          stroke="#7c3aed"
          strokeDasharray="8 8"
          strokeWidth="2.5"
        />
      ) : null}
      <rect
        x={domainLeft}
        y="300"
        width={domainWidth}
        height="28"
        rx="14"
        fill="#2563eb"
        opacity=".18"
      />
      <circle
        cx={xA}
        cy={yA}
        r="12"
        fill="#ffffff"
        stroke="#4f46e5"
        strokeWidth="6"
      />
      <circle cx="320" cy={vertexY} r="9" fill="#4f46e5" />
      <circle
        cx={xB}
        cy={yB}
        r="12"
        fill="#ffffff"
        stroke="#4f46e5"
        strokeWidth="6"
      />
      <text
        x={xA - 24}
        y={yA - 18}
        fill="#1d4ed8"
        fontSize="18"
        fontWeight="900"
      >
        A
      </text>
      <text
        x={xB + 14}
        y={yB - 18}
        fill="#1d4ed8"
        fontSize="18"
        fontWeight="900"
      >
        B
      </text>
      <text
        x="480"
        y={vertexY - 12}
        fill="#7c3aed"
        fontSize="16"
        fontWeight="900"
      >
        range projection
      </text>
      <text
        x={domainLeft + 14}
        y="348"
        fill="#1d4ed8"
        fontSize="16"
        fontWeight="900"
      >
        domain projection
      </text>
    </svg>
  );
}

function LabSlider({
  label,
  value,
  min,
  max,
  step,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
}) {
  return (
    <label className="lesson-lab-slider">
      <span>
        {label}
        <strong>{value.toFixed(step < 1 ? 2 : 0)}</strong>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
      />
    </label>
  );
}

function graphY(x: number, shift: number) {
  return -0.25 * x * x + 2 + shift;
}

function toGraphX(x: number) {
  return 320 + x * 52;
}

function toGraphY(y: number) {
  return 300 - y * 58;
}

function parabolaPath(shift: number) {
  const points = Array.from({ length: 33 }, (_, index) => {
    const x = -5 + index * (10 / 32);
    return `${toGraphX(x).toFixed(1)},${toGraphY(graphY(x, shift)).toFixed(1)}`;
  });
  return `M ${points.join(" L ")}`;
}

function buildShareUrl(state: LessonVisualState) {
  const href =
    typeof window === "undefined"
      ? "http://localhost/lessons"
      : window.location.href;
  const url = new URL(href);
  url.searchParams.set(
    "visualState",
    encodeURIComponent(JSON.stringify(state)),
  );
  return url.toString();
}

function readVisualStateFromUrl(): LessonVisualState {
  if (typeof window === "undefined") return defaultVisualState;
  const raw = window.location.search
    ? new URLSearchParams(window.location.search).get("visualState")
    : null;
  if (!raw) return defaultVisualState;
  try {
    const parsed = JSON.parse(
      decodeURIComponent(raw),
    ) as Partial<LessonVisualState>;
    return {
      pointA: finiteOrDefault(parsed.pointA, defaultVisualState.pointA),
      pointB: finiteOrDefault(parsed.pointB, defaultVisualState.pointB),
      verticalShift: finiteOrDefault(
        parsed.verticalShift,
        defaultVisualState.verticalShift,
      ),
      showProjections:
        typeof parsed.showProjections === "boolean"
          ? parsed.showProjections
          : defaultVisualState.showProjections,
      showGrid:
        typeof parsed.showGrid === "boolean"
          ? parsed.showGrid
          : defaultVisualState.showGrid,
    };
  } catch {
    return defaultVisualState;
  }
}

function finiteOrDefault(value: unknown, fallback: number) {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

function LessonVisualBrief({
  lesson,
  strengthenedLesson,
}: {
  lesson: LessonDefinition;
  strengthenedLesson: StrengthenedLesson | null;
}) {
  const representations = strengthenedLesson?.representations.length
    ? strengthenedLesson.representations
    : lesson.contract.requiredRepresentations.map((representation) => ({
        id: representation,
        type: "text_table" as const,
        learningPurpose: `Use the ${representation} representation to inspect ${lesson.title}.`,
      }));
  const misconception = strengthenedLesson?.misconceptions[0];
  const exitCheck = strengthenedLesson?.exitCheck[0];
  return (
    <section
      className="mb-3 rounded-2xl border border-sky-200 bg-sky-50/80 p-3 dark:border-sky-300/20 dark:bg-sky-300/10"
      aria-label="Lesson-specific visual requirements"
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <SectionTitle
          icon={<Eye className="h-4 w-4" />}
          label="Visual requirement"
        />
        <span className="rounded-full bg-white px-2.5 py-1 text-[10px] font-black uppercase text-sky-700 dark:bg-white/10 dark:text-sky-100">
          {strengthenedLesson ? "Strengthened" : "Contract"}
        </span>
      </div>
      <div className="mt-3 grid gap-2 md:grid-cols-2">
        {representations.slice(0, 4).map((representation) => (
          <article
            key={representation.id}
            className="rounded-xl border border-sky-100 bg-white/85 p-3 dark:border-white/10 dark:bg-slate-950/50"
          >
            <p className="text-[10px] font-black uppercase text-sky-700 dark:text-sky-200">
              {representation.type.replace(/_/g, " ")}
            </p>
            <p className="mt-1 text-xs font-bold leading-5 text-slate-600 dark:text-slate-300">
              {representation.learningPurpose}
            </p>
          </article>
        ))}
      </div>
      <div className="mt-2 grid gap-2 lg:grid-cols-2">
        {misconception ? (
          <p className="rounded-xl bg-white/85 p-3 text-xs font-bold leading-5 text-slate-700 dark:bg-slate-950/50 dark:text-slate-200">
            <strong>Do not make it generic:</strong> {misconception.correction}
          </p>
        ) : null}
        {exitCheck ? (
          <p className="rounded-xl bg-white/85 p-3 text-xs font-bold leading-5 text-slate-700 dark:bg-slate-950/50 dark:text-slate-200">
            <strong>Visual must prove:</strong> {exitCheck.criterion}
          </p>
        ) : null}
      </div>
    </section>
  );
}

function LessonContentPanel({
  lesson,
  content,
  language,
  status,
  activeTab,
  strengthenedLesson,
}: {
  lesson: LessonDefinition;
  content: LessonContent;
  language: (typeof lessonLanguageOptions)[number];
  status: string;
  activeTab: LessonInfoTab;
  strengthenedLesson: StrengthenedLesson | null;
}) {
  return (
    <section
      id={`lesson-panel-${activeTab}`}
      role="tabpanel"
      className="space-y-3 rounded-2xl border border-slate-200 bg-white/90 p-4 text-[15px] shadow-lg shadow-cyan-950/5 dark:border-white/10 dark:bg-slate-950/70"
      aria-label="Lesson learning content"
      lang={language.code}
      dir={language.direction ?? "ltr"}
    >
      {activeTab === "learn" ? (
        <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_300px]">
          <div className="rounded-xl border border-cyan-100 bg-gradient-to-br from-cyan-50 via-white to-violet-50 p-4 dark:border-cyan-300/20 dark:from-cyan-300/10 dark:via-slate-950 dark:to-violet-300/10">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <SectionTitle
                icon={<BookOpen className="h-4 w-4" />}
                label="Introduction"
              />
              <span className="rounded-full bg-white/80 px-2.5 py-1 text-[10px] font-black uppercase text-cyan-700 dark:bg-white/10 dark:text-cyan-100">
                {language.nativeName} lesson
              </span>
            </div>
            {status ? (
              <p
                className="mt-3 rounded-lg bg-slate-50 p-2 text-xs font-bold text-slate-600 dark:bg-white/10 dark:text-slate-300"
                role="status"
              >
                {status}
              </p>
            ) : null}
            <p className="mt-3 text-base leading-7 text-slate-700 dark:text-slate-200">
              {content.summary}
            </p>
            <p className="mt-2 text-base leading-7 text-slate-600 dark:text-slate-300">
              {content.explanation}
            </p>
            <p className="mt-3 rounded-xl border border-cyan-100 bg-white/80 p-3 text-base font-bold leading-7 text-cyan-950 dark:border-cyan-400/20 dark:bg-cyan-400/10 dark:text-cyan-100">
              {content.workedConnection}
            </p>
          </div>
          <div className="grid gap-2">
            <MiniMetric
              icon={<Target className="h-4 w-4" />}
              label="Concept"
              value={lesson.contract.concept}
            />
            <MiniMetric
              icon={<ClipboardCheck className="h-4 w-4" />}
              label="Challenge type"
              value={lesson.contract.challengeFactory}
            />
            <MiniMetric
              icon={<ShieldCheck className="h-4 w-4" />}
              label="Reset checks"
              value={lesson.contract.resetAssertions.join(", ")}
            />
          </div>
          <DetailedLessonExplanation
            lesson={lesson}
            content={content}
            strengthenedLesson={strengthenedLesson}
          />
        </div>
      ) : null}

      {activeTab === "examples" ? (
        <div
          id="lesson-examples"
          className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_minmax(280px,0.9fr)]"
        >
          <section className="rounded-xl border border-slate-200 bg-white p-4 dark:border-white/10 dark:bg-slate-950/70">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <SectionTitle
                icon={
                  <Lightbulb className="h-4 w-4 text-amber-600 dark:text-amber-300" />
                }
                label="Real-time examples"
                muted
              />
              <span className="text-xs font-black text-slate-500 dark:text-slate-300">
                {content.realWorldExamples.length} examples
              </span>
            </div>
            <div className="mt-3 grid gap-2">
              {content.realWorldExamples.map((example, index) => (
                <article
                  key={example}
                  className="flex gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3 transition hover:border-amber-200 hover:bg-amber-50 dark:border-white/10 dark:bg-white/10 dark:hover:bg-amber-300/10"
                >
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-amber-100 text-xs font-black text-amber-800 dark:bg-amber-300/15 dark:text-amber-100">
                    {index + 1}
                  </span>
                  <p className="text-base font-semibold leading-7 text-slate-700 dark:text-slate-200">
                    {example}
                  </p>
                </article>
              ))}
            </div>
            <ul className="mt-3 space-y-2">
              {content.keyIdeas.map((idea, index) => (
                <li
                  key={idea}
                  className="flex gap-2 rounded-xl bg-slate-50 p-3 text-base font-semibold leading-7 text-slate-700 dark:bg-white/10 dark:text-slate-200"
                >
                  <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-cyan-600" />
                  <span>
                    <strong>Idea {index + 1}:</strong> {idea}
                  </span>
                </li>
              ))}
            </ul>
          </section>

          <div className="space-y-3">
            <section className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-white/10 dark:bg-slate-950/70">
              <SectionTitle
                icon={<SlidersHorizontal className="h-4 w-4" />}
                label="Interact with controls"
              />
              <ol className="mt-3 space-y-2">
                {content.controlGuide.map((step, index) => (
                  <li
                    key={step}
                    className="flex gap-2 text-base leading-7 text-slate-600 dark:text-slate-300"
                  >
                    <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-100 text-sm font-black text-slate-700 dark:bg-white/10 dark:text-slate-100">
                      {index + 1}
                    </span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
              <div className="mt-3 rounded-xl border border-dashed border-cyan-200 bg-cyan-50 p-3 text-sm font-bold leading-6 text-cyan-900 dark:border-cyan-300/20 dark:bg-cyan-300/10 dark:text-cyan-100">
                <Keyboard className="mr-1 inline h-3.5 w-3.5" />
                {lesson.contract.keyboardAlternative}
              </div>
            </section>
            <LessonVisualBrief
              lesson={lesson}
              strengthenedLesson={strengthenedLesson}
            />
          </div>
        </div>
      ) : null}

      {activeTab === "formulas" ? (
        <section
          id="lesson-formulas"
          className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-white/10 dark:bg-slate-950/70"
        >
          <div className="flex flex-wrap items-center justify-between gap-2">
            <SectionTitle
              icon={<Sigma className="h-4 w-4" />}
              label="Formulas"
            />
            <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-black uppercase text-slate-600 dark:bg-white/10 dark:text-slate-300">
              {content.formulas.length} related
            </span>
          </div>
          <div className="mt-3 space-y-2">
            {content.formulas.map((item, index) => (
              <article
                key={`${item.label}-${item.expression}`}
                className="rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-white/10 dark:bg-white/10"
              >
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-xs font-black text-slate-700 dark:text-slate-100">
                    {item.label}
                  </h3>
                  <span className="rounded-full bg-white px-2 py-0.5 text-[10px] font-black text-slate-500 dark:bg-slate-900 dark:text-slate-300">
                    F{index + 1}
                  </span>
                </div>
                <div className="mt-2 overflow-x-auto rounded-lg bg-white px-2 py-2 font-semibold dark:bg-slate-900">
                  <MathExpression value={item.expression} />
                </div>
                <p className="mt-2 text-xs leading-5 text-slate-500 dark:text-slate-300">
                  {item.explanation}
                </p>
              </article>
            ))}
          </div>
        </section>
      ) : null}

      {activeTab === "more" ? (
        <details
          id="lesson-know-more"
          className="group rounded-xl border border-violet-200 bg-violet-50/70 p-2 dark:border-violet-300/20 dark:bg-violet-300/10"
          open
        >
          <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-3 rounded-lg px-3 py-2 text-sm font-black text-violet-900 transition hover:bg-white/70 dark:text-violet-100 dark:hover:bg-white/10">
            <span className="inline-flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              Know more
            </span>
            <ChevronDown className="h-4 w-4 transition group-open:rotate-180" />
          </summary>
          <div className="grid gap-2 px-2 pb-2 pt-1 sm:grid-cols-2">
            {content.knowMore.map((item) => (
              <p
                key={item}
                className="rounded-lg bg-white/85 p-3 text-base font-semibold leading-7 text-slate-700 dark:bg-slate-950/50 dark:text-slate-200"
              >
                {item}
              </p>
            ))}
          </div>
        </details>
      ) : null}
    </section>
  );
}

function DetailedLessonExplanation({
  lesson,
  content,
  strengthenedLesson,
}: {
  lesson: LessonDefinition;
  content: LessonContent;
  strengthenedLesson: StrengthenedLesson | null;
}) {
  const definitions = strengthenedLesson?.definitions.length
    ? strengthenedLesson.definitions.map((item) => item.statement)
    : [`${lesson.title} means: ${lesson.description}`];
  const vocabulary = strengthenedLesson?.keyVocabulary.length
    ? strengthenedLesson.keyVocabulary
    : [
        { term: lesson.contract.concept, meaning: lesson.outcome },
        {
          term: lesson.workspace,
          meaning: `The workspace representation used to inspect ${lesson.title}.`,
        },
      ];
  const facts = strengthenedLesson?.facts.length
    ? strengthenedLesson.facts.map((item) => item.statement)
    : content.keyIdeas;
  const worked = strengthenedLesson?.workedExamples[0];
  const misconception = strengthenedLesson?.misconceptions[0];
  const practice = strengthenedLesson?.practice.slice(0, 3) ?? [];
  const restrictions = strengthenedLesson?.conditionsAndRestrictions.length
    ? strengthenedLesson.conditionsAndRestrictions
    : content.formulas.flatMap((item) => item.explanation).slice(0, 2);
  const formulaItems = strengthenedLesson?.formulas.length
    ? strengthenedLesson.formulas.map((item) => {
        const variables = item.variables
          .map((variable) => `${variable.symbol}: ${variable.meaning}`)
          .join("; ");
        const restrictionsText = item.restrictions?.length
          ? ` Restrictions: ${item.restrictions.join("; ")}`
          : "";
        return `${item.label}: ${item.expression}. ${variables}${restrictionsText}`;
      })
    : content.formulas.map(
        (item) => `${item.label}: ${item.expression}. ${item.explanation}`,
      );
  return (
    <section
      className="lg:col-span-2 rounded-2xl border border-slate-200 bg-white/90 p-4 dark:border-white/10 dark:bg-slate-950/60"
      aria-label="Detailed explanation"
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <SectionTitle
          icon={<NotebookText className="h-4 w-4" />}
          label="Detailed explanation"
          muted
        />
        <span className="rounded-full bg-cyan-50 px-2.5 py-1 text-[10px] font-black uppercase text-cyan-700 dark:bg-cyan-300/10 dark:text-cyan-100">
          Introduction first, depth next
        </span>
      </div>
      <div className="mt-3 grid gap-3 xl:grid-cols-[minmax(0,1.2fr)_minmax(260px,0.8fr)]">
        <div className="space-y-3">
          <ExplanationArticle
            title={`What ${lesson.title} means`}
            items={definitions}
          />
          <ExplanationArticle
            title="How to read it"
            items={[
              strengthenedLesson?.howItWorks ?? content.controlGuide.join(" "),
              strengthenedLesson?.whyItWorks ?? content.workedConnection,
            ]}
          />
          {worked ? (
            <article className="rounded-xl border border-cyan-100 bg-cyan-50/70 p-3 dark:border-cyan-300/20 dark:bg-cyan-300/10">
              <h3 className="text-sm font-black text-cyan-950 dark:text-cyan-100">
                Worked example
              </h3>
              <p className="mt-2 text-sm font-bold leading-6 text-slate-700 dark:text-slate-200">
                {worked.prompt}
              </p>
              <ol className="mt-2 space-y-1">
                {worked.steps.map((step, index) => (
                  <li
                    key={step}
                    className="text-sm leading-6 text-slate-600 dark:text-slate-300"
                  >
                    <strong>Step {index + 1}:</strong> {step}
                  </li>
                ))}
              </ol>
              <p className="mt-2 rounded-lg bg-white/85 p-2 text-sm font-black text-cyan-900 dark:bg-slate-950/50 dark:text-cyan-100">
                Answer: {worked.answer}
              </p>
            </article>
          ) : null}
        </div>
        <aside className="space-y-3">
          <article className="rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-white/10 dark:bg-white/10">
            <h3 className="text-sm font-black text-slate-900 dark:text-white">
              Vocabulary
            </h3>
            <dl className="mt-2 space-y-2">
              {vocabulary.slice(0, 5).map((item) => (
                <div key={item.term}>
                  <dt className="text-xs font-black uppercase text-cyan-700 dark:text-cyan-200">
                    {item.term}
                  </dt>
                  <dd className="text-sm leading-6 text-slate-600 dark:text-slate-300">
                    {item.meaning}
                  </dd>
                </div>
              ))}
            </dl>
          </article>
          <ExplanationArticle
            title="Must remember"
            items={facts.slice(0, 4)}
            compact
          />
          {formulaItems.length ? (
            <ExplanationArticle
              title="Formula meaning"
              items={formulaItems.slice(0, 3)}
              compact
            />
          ) : null}
          <ExplanationArticle
            title="Conditions"
            items={restrictions.slice(0, 4)}
            compact
          />
          {misconception ? (
            <article className="rounded-xl border border-amber-200 bg-amber-50 p-3 dark:border-amber-300/20 dark:bg-amber-300/10">
              <h3 className="text-sm font-black text-amber-950 dark:text-amber-100">
                Common mistake
              </h3>
              <p className="mt-2 text-sm leading-6 text-slate-700 dark:text-slate-200">
                {misconception.mistake}
              </p>
              <p className="mt-2 text-sm font-black leading-6 text-amber-900 dark:text-amber-100">
                {misconception.correction}
              </p>
            </article>
          ) : null}
          {practice.length ? (
            <ExplanationArticle
              title="Try next"
              items={practice.map((item) => item.prompt)}
              compact
            />
          ) : null}
        </aside>
      </div>
    </section>
  );
}

function ExplanationArticle({
  title,
  items,
  compact = false,
}: {
  title: string;
  items: string[];
  compact?: boolean;
}) {
  return (
    <article className="rounded-xl border border-slate-200 bg-slate-50/80 p-3 dark:border-white/10 dark:bg-white/10">
      <h3 className="text-sm font-black text-slate-900 dark:text-white">
        {title}
      </h3>
      <div className={compact ? "mt-2 space-y-1.5" : "mt-2 space-y-2"}>
        {items.map((item) => (
          <p
            key={item}
            className={
              compact
                ? "text-sm font-semibold leading-6 text-slate-600 dark:text-slate-300"
                : "text-base leading-7 text-slate-700 dark:text-slate-200"
            }
          >
            {item}
          </p>
        ))}
      </div>
    </article>
  );
}

function LessonTabBar({
  active,
  onChange,
}: {
  active: LessonInfoTab;
  onChange: (tab: LessonInfoTab) => void;
}) {
  const tabs: Array<{ id: LessonInfoTab; label: string; icon: ReactNode }> = [
    {
      id: "interaction",
      label: "Interaction + visualization",
      icon: <Eye className="h-3.5 w-3.5" />,
    },
    {
      id: "learn",
      label: "Explain",
      icon: <NotebookText className="h-3.5 w-3.5" />,
    },
    {
      id: "examples",
      label: "Examples",
      icon: <Lightbulb className="h-3.5 w-3.5" />,
    },
    {
      id: "formulas",
      label: "Formulas",
      icon: <Sigma className="h-3.5 w-3.5" />,
    },
    {
      id: "more",
      label: "Know more",
      icon: <Sparkles className="h-3.5 w-3.5" />,
    },
  ];
  const preserveScroll = (button: HTMLButtonElement, tab: LessonInfoTab) => {
    const left = window.scrollX;
    const top = window.scrollY;
    button.blur();
    onChange(tab);
    window.setTimeout(() => window.scrollTo(left, top), 0);
    window.setTimeout(() => window.scrollTo(left, top), 60);
    window.setTimeout(() => window.scrollTo(left, top), 180);
  };
  return (
    <nav
      className="mobile-safe-scroll flex gap-2 rounded-2xl border border-slate-200 bg-white/85 p-2 shadow-sm dark:border-white/10 dark:bg-slate-950/70"
      role="tablist"
      aria-label="Lesson content tabs"
    >
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          role="tab"
          aria-selected={active === tab.id}
          aria-controls={`lesson-panel-${tab.id}`}
          id={`lesson-tab-${tab.id}`}
          tabIndex={active === tab.id ? 0 : -1}
          onMouseDown={(event) => event.preventDefault()}
          onClick={(event) => preserveScroll(event.currentTarget, tab.id)}
          className={
            active === tab.id
              ? "inline-flex min-h-10 shrink-0 items-center gap-2 rounded-xl bg-cyan-600 px-4 text-sm font-black text-white shadow"
              : "inline-flex min-h-10 shrink-0 items-center gap-2 rounded-xl px-4 text-sm font-black text-slate-600 transition hover:bg-cyan-50 hover:text-cyan-800 dark:text-slate-300 dark:hover:bg-cyan-300/10 dark:hover:text-cyan-100"
          }
        >
          {tab.icon}
          {tab.label}
        </button>
      ))}
    </nav>
  );
}

function SectionTitle({
  icon,
  label,
  muted = false,
}: {
  icon: ReactNode;
  label: string;
  muted?: boolean;
}) {
  return (
    <div className="flex items-center gap-2">
      {icon}
      <h2
        className={
          muted
            ? "text-sm font-black uppercase tracking-wide text-slate-700 dark:text-slate-200"
            : "text-sm font-black uppercase tracking-wide text-cyan-600 dark:text-cyan-300"
        }
      >
        {label}
      </h2>
    </div>
  );
}

function InfoChip({ icon, label }: { icon: ReactNode; label: string }) {
  return (
    <span className="inline-flex min-h-8 items-center gap-1.5 rounded-full border border-slate-200 bg-white/80 px-3 text-xs font-black text-slate-700 dark:border-white/10 dark:bg-white/10 dark:text-slate-200">
      {icon}
      {label}
    </span>
  );
}

function StatusPill({
  active,
  activeText,
  idleText,
}: {
  active: boolean;
  activeText: string;
  idleText: string;
}) {
  return (
    <span
      className={
        active
          ? "rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-black text-emerald-800 dark:border-emerald-300/20 dark:bg-emerald-300/10 dark:text-emerald-100"
          : "rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-black text-amber-800 dark:border-amber-300/20 dark:bg-amber-300/10 dark:text-amber-100"
      }
    >
      {active ? activeText : idleText}
    </span>
  );
}

function MiniMetric({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-3 dark:border-white/10 dark:bg-slate-950/70">
      <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-wide text-cyan-600 dark:text-cyan-300">
        {icon}
        {label}
      </div>
      <p className="mt-1 line-clamp-2 text-xs font-bold leading-5 text-slate-600 dark:text-slate-300">
        {value}
      </p>
    </div>
  );
}

function Tag({ icon, label }: { icon: ReactNode; label: string }) {
  return (
    <span className="inline-flex min-h-8 items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-2.5 text-xs font-bold text-slate-600 dark:border-white/10 dark:bg-white/10 dark:text-slate-300">
      {icon}
      {label}
    </span>
  );
}

function workspaceRoute(lesson: LessonDefinition) {
  if (lesson.adapter === "calculator") return "/calculator";
  if (lesson.adapter === "algebra") return "/workspace/graph";
  if (lesson.adapter === "graph" || lesson.adapter === "trigonometry")
    return "/workspace/graph";
  if (lesson.adapter === "geometry2d" || lesson.adapter === "vector")
    return "/workspace/geometry";
  if (lesson.adapter === "algebra-cas" || lesson.adapter === "cas")
    return "/workspace/data/cas";
  if (lesson.adapter === "calculus") return "/workspace/graph";
  if (lesson.adapter === "spreadsheet") return "/workspace/data/spreadsheet";
  if (
    lesson.adapter === "statistics" ||
    lesson.adapter === "probability" ||
    lesson.adapter === "inference"
  )
    return "/workspace/data/analysis";
  if (lesson.adapter === "geometry3d") return "/workspace/3d";
  if (lesson.adapter === "discrete") return "/modules/discrete-world";
  if (lesson.adapter === "finance") return "/workspace/data/spreadsheet";
  if (
    lesson.adapter === "sequence" ||
    lesson.adapter === "matrix" ||
    lesson.adapter === "complex"
  )
    return "/workspace";
  if (lesson.adapter === "authoring" || lesson.adapter === "learning")
    return "/workspace/teach";
  return "/workspace";
}
