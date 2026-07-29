import katex from "katex";
import {
  Brush,
  BrainCircuit,
  Camera,
  Check,
  ChevronRight,
  Command,
  Download,
  Eraser,
  FolderOpen,
  Grid3X3,
  Highlighter,
  LassoSelect,
  MousePointer2,
  Move,
  PanelRightClose,
  PanelRightOpen,
  PenLine,
  Redo2,
  RotateCcw,
  Save,
  ScanLine,
  Settings2,
  Sparkles,
  Trash2,
  Undo2,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import { lazy, Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
import MathKeyboardInput from "../../components/math-keyboard/MathKeyboardInput";
import SectionCard from "../../components/ui/SectionCard";
import { MathLabLayout } from "../../components/math-lab/MathLabShared";
import BoardCanvas from "./BoardCanvas";
import BoardCommandPalette, { type BoardCommand as BoardPaletteCommand } from "./BoardCommandPalette";
import BoardOutline from "./BoardOutline";
import BoardResultCard from "./BoardResultCard";
import { exportBoard } from "./boardExport";
import { fingerprintStrokes, normalizeReadingOrder } from "./boardImageImport";
import { executeBoardAction, normalizeBoardEngineError } from "./boardEngineAdapters";
import { executeCommand, emptyBoardHistory, recordCommand, undoCommand, type BoardCommand, type BoardHistory } from "./boardHistory";
import { boardToScreen, calculateBounds, expandBounds, simplifyPoints, smoothPoints, snapValue, unionBounds } from "./boardGeometry";
import { analyzeBoardExpression } from "./boardMathAnalyzer";
import { recordBoardMasteryEvidence } from "./boardLearningIntegration";
import { applyVerification, createSolutionSequence, verifySolutionSequence } from "./boardWorkVerification";
import {
  approveSafeWorkflowSteps,
  boardIntelligenceOrchestrator,
  buildBoardIntelligenceContext,
  cancelBoardWorkflow,
  dismissBoardRecommendation,
  markBoardActionCompleted,
  planBoardWorkflow,
  updateWorkflowStep,
} from "./boardIntelligence";
import {
  createBoardDocument,
  deleteBoard,
  readBoardLibrary,
  recoverDraft,
  saveBoard,
  saveDraft,
} from "./boardPersistence";
import {
  createRecognitionInput,
  mathRecognitionProvider,
  renderRecognitionImage,
} from "./mathRecognition";
import type { BoardActionType, BoardDocument, BoardElement, BoardExplanationElement, BoardImageElement, BoardResultElement, BoardTool, BoardTutorMessage, BoardWorkVerificationResult, MathExpressionElement, MathRecognitionResult, StrokeElement } from "./types";
import type { BoardIntelligencePersistence, SmartBoardRecommendation, SmartBoardUnderstandingResult, SmartBoardWorkflowPlan } from "./boardIntelligenceTypes";

const BoardTutorPanel = lazy(() => import("./BoardTutorPanel"));
const BoardImageImportDialog = lazy(() => import("./BoardImageImportDialog"));
const BoardIntelligencePanel = lazy(() => import("./BoardIntelligencePanel"));

type RecognitionEntry = MathRecognitionResult & { id: string; createdAt: string };

const tools: Array<{ id: BoardTool; label: string; icon: typeof PenLine }> = [
  { id: "pen", label: "Pen (P)", icon: PenLine },
  { id: "highlighter", label: "Highlighter", icon: Highlighter },
  { id: "eraser", label: "Eraser (E)", icon: Eraser },
  { id: "select", label: "Select (V)", icon: MousePointer2 },
  { id: "lasso", label: "Lasso", icon: LassoSelect },
  { id: "pan", label: "Pan (H)", icon: Move },
];

export default function BoardPage() {
  const [document, setDocument] = useState<BoardDocument>(() => recoverDraft() ?? createBoardDocument());
  const [history, setHistory] = useState<BoardHistory>(emptyBoardHistory);
  const [tool, setTool] = useState<BoardTool>("pen");
  const [color, setColor] = useState(defaultBoardInkColor);
  const [strokeWidth, setStrokeWidth] = useState(3);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [recognitionOpen, setRecognitionOpen] = useState(true);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [libraryOpen, setLibraryOpen] = useState(false);
  const [savedBoards, setSavedBoards] = useState(() => readBoardLibrary());
  const [recognition, setRecognition] = useState<RecognitionEntry | null>(null);
  const [recognitionHistory, setRecognitionHistory] = useState<RecognitionEntry[]>([]);
  const [latex, setLatex] = useState("");
  const [recognitionStatus, setRecognitionStatus] = useState<"idle" | "working" | "success" | "error">("idle");
  const [message, setMessage] = useState("Ready");
  const [tutorOpen, setTutorOpen] = useState(false);
  const [intelligenceOpen, setIntelligenceOpen] = useState(false);
  const [understanding, setUnderstanding] = useState<SmartBoardUnderstandingResult | null>(null);
  const [intelligenceStatus, setIntelligenceStatus] = useState<"idle" | "working">("idle");
  const [workflowRunning, setWorkflowRunning] = useState(false);
  const [outlineOpen, setOutlineOpen] = useState(false);
  const [commandOpen, setCommandOpen] = useState(false);
  const [imageImportOpen, setImageImportOpen] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);
  const [autoSuggestion, setAutoSuggestion] = useState(false);
  const [workVerification, setWorkVerification] = useState<BoardWorkVerificationResult | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const actionControllersRef = useRef(new Map<string, AbortController>());
  const intelligenceAbortRef = useRef<AbortController | null>(null);
  const workflowAbortRef = useRef<AbortController | null>(null);
  const intelligenceFingerprintRef = useRef("");
  const boardSurfaceRef = useRef<HTMLDivElement>(null);
  const [actionParameters, setActionParameters] = useState<Record<string, unknown>>({
    variable: "x",
    xMin: -10,
    xMax: 10,
    yMin: -10,
    yMax: 10,
    target: "0",
    compareWith: "0",
  });

  const selectedElements = useMemo(
    () => document.elements.filter((element) => selectedIds.includes(element.id)),
    [document.elements, selectedIds],
  );
  const selectedStrokes = useMemo(
    () => selectedElements.filter((element): element is StrokeElement => element.type === "stroke"),
    [selectedElements],
  );
  const selectedMath = useMemo(
    () => selectedElements.find((element): element is MathExpressionElement => element.type === "math-expression") ?? null,
    [selectedElements],
  );
  const selectedImage = useMemo(
    () => selectedElements.find((element): element is BoardImageElement => element.type === "image") ?? null,
    [selectedElements],
  );
  const analysis = useMemo(() => {
    if (!selectedMath) return null;
    try {
      return analyzeBoardExpression(selectedMath.latex);
    } catch {
      return null;
    }
  }, [selectedMath]);
  const preview = useMemo(() => renderBoardLatex(latex), [latex]);

  const runCommand = useCallback((command: BoardCommand) => {
    setDocument((current) => executeCommand(current, command));
    setHistory((current) => recordCommand(current, command));
  }, []);

  const undo = useCallback(() => {
    setHistory((current) => {
      const command = current.undo.at(-1);
      if (!command) return current;
      setDocument((board) => undoCommand(board, command));
      return { undo: current.undo.slice(0, -1), redo: [command, ...current.redo].slice(0, 80) };
    });
  }, []);

  const redo = useCallback(() => {
    setHistory((current) => {
      const [command, ...rest] = current.redo;
      if (!command) return current;
      setDocument((board) => executeCommand(board, command));
      return { undo: [...current.undo, command].slice(-80), redo: rest };
    });
  }, []);

  const addStroke = useCallback((stroke: StrokeElement) => {
    const smoothed = smoothPoints(simplifyPoints(stroke.points));
    const points = document.snapToGrid
      ? smoothed.map((point) => ({ ...point, x: snapValue(point.x), y: snapValue(point.y) }))
      : smoothed;
    const processed = { ...stroke, points, bounds: calculateBounds(points) };
    runCommand({ type: "add", elements: [processed] });
    setMessage("Stroke added");
  }, [document.snapToGrid, runCommand]);

  const removeElements = useCallback((elements: BoardElement[]) => {
    if (!elements.length) return;
    const ids = new Set(elements.map((element) => element.id));
    setDocument((current) => {
      const next = executeCommand(current, { type: "delete", elements });
      return {
        ...next,
        relationships: next.relationships.filter((relationship) => !ids.has(relationship.sourceElementId) && !ids.has(relationship.targetElementId)),
      };
    });
    setHistory((current) => recordCommand(current, { type: "delete", elements }));
    setSelectedIds((ids) => ids.filter((id) => !elements.some((element) => element.id === id)));
  }, []);

  const moveSelection = useCallback((ids: string[], dx: number, dy: number) => {
    const adjustedX = document.snapToGrid ? snapValue(dx) : dx;
    const adjustedY = document.snapToGrid ? snapValue(dy) : dy;
    runCommand({ type: "move", ids, dx: adjustedX, dy: adjustedY });
  }, [document.snapToGrid, runCommand]);

  const recognize = useCallback(async () => {
    const strokes = selectedStrokes.length
      ? selectedStrokes
      : document.elements.filter((element): element is StrokeElement => element.type === "stroke");
    if (!strokes.length) {
      setMessage("Draw or select handwriting before recognition.");
      setRecognitionStatus("error");
      return;
    }
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    setRecognitionStatus("working");
    setRecognitionOpen(true);
    setMessage("Preparing selected strokes…");
    try {
      const input = renderRecognitionImage(createRecognitionInput(strokes));
      const result = await mathRecognitionProvider.recognize(input, { signal: controller.signal });
      const entry = { ...result, id: `recognition-${Date.now()}`, createdAt: new Date().toISOString() };
      setRecognition(entry);
      setRecognitionHistory((items) => [entry, ...items].slice(0, 12));
      setLatex(entry.latex);
      setRecognitionStatus("success");
      setMessage("Recognition ready for review");
    } catch (error) {
      if ((error as Error).name === "AbortError") return;
      setRecognitionStatus("error");
      setMessage(error instanceof Error ? error.message : "Recognition failed");
    }
  }, [document.elements, selectedStrokes]);

  const insertExpression = useCallback(() => {
    if (!latex.trim() || !preview.valid) {
      setMessage("Correct the LaTeX before inserting it.");
      return;
    }
    const source = selectedStrokes.length
      ? selectedStrokes
      : document.elements.filter((element): element is StrokeElement => element.type === "stroke");
    const sourceBounds = source.length
      ? expandBounds(unionBounds(source.map((stroke) => stroke.bounds)), 12)
      : { x: 80, y: 80, width: 220, height: 64 };
    const element: BoardElement = {
      id: `math-${Date.now()}`,
      type: "math-expression",
      latex: latex.trim(),
      normalizedExpression: recognition?.normalizedExpression,
      sourceStrokeIds: source.map((stroke) => stroke.id),
      recognitionConfidence: recognition?.confidence,
      bounds: { ...sourceBounds, width: Math.max(180, sourceBounds.width), height: Math.max(58, sourceBounds.height) },
      createdAt: new Date().toISOString(),
    };
    runCommand({ type: "add", elements: [element] });
    setSelectedIds([element.id]);
    setMessage("Editable expression inserted; handwriting preserved.");
  }, [document.elements, latex, preview.valid, recognition, runCommand, selectedStrokes]);

  const clearBoard = useCallback(() => {
    if (!document.elements.length) return;
    if (!globalThis.confirm("Clear every element from this Board? You can undo this action.")) return;
    runCommand({ type: "clear", elements: document.elements });
    setDocument((current) => ({ ...current, relationships: [] }));
    setSelectedIds([]);
  }, [document.elements, runCommand]);

  const saveCurrent = useCallback(() => {
    const next = saveBoard(document);
    setSavedBoards(next);
    saveDraft(document);
    setMessage(`Saved “${document.title}” locally`);
  }, [document]);

  const setViewport = useCallback((viewport: BoardDocument["viewport"]) => {
    setDocument((current) => ({ ...current, viewport, updatedAt: new Date().toISOString() }));
  }, []);

  const executeAction = useCallback(async (
    actionType: BoardActionType,
    source = selectedMath,
    parameters = actionParameters,
  ) => {
    if (!source) {
      setMessage("Select an inserted mathematical expression first.");
      return false;
    }
    let currentAnalysis;
    try {
      currentAnalysis = analyzeBoardExpression(source.latex);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Expression analysis failed.");
      return false;
    }
    if (currentAnalysis.ambiguities.some((ambiguity) => ambiguity.requiresResolution)) {
      setMessage("Resolve the recognition ambiguity before running an engine.");
      return false;
    }
    const now = new Date().toISOString();
    const resultId = `result-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    const sourceRight = source.bounds.x + source.bounds.width;
    const repeatedActionCount = document.elements.filter(
      (element) => element.type === "math-result" && element.sourceElementIds.includes(source.id),
    ).filter(
      (element) => element.type === "math-result" && element.actionType === actionType,
    ).length;
    const resultSlot = actionPlacementSlot(actionType) + repeatedActionCount;
    const resultWidth = actionType.includes("plot") ? 410 : 330;
    const resultHeight = actionType.includes("plot") ? 360 : 210;
    const loading: BoardResultElement = {
      id: resultId,
      type: "math-result",
      actionType,
      sourceElementIds: [source.id],
      title: actionLabel(actionType),
      status: "loading",
      inputLatex: source.latex,
      normalizedInput: currentAnalysis.engineExpression,
      engine: { adapter: currentAnalysis.suggestedActions.find((action) => action.type === actionType)?.engineAdapter ?? "cas" },
      parameters,
      collapsed: false,
      bounds: {
        x: sourceRight + 36,
        y: source.bounds.y + resultSlot * 80,
        width: resultWidth,
        height: resultHeight,
      },
      createdAt: now,
      updatedAt: now,
    };
    const relationshipType = actionType.includes("plot") ? "graphs" : actionType === "verify" ? "verifies" : actionType === "geometry" || actionType === "plot-3d" ? "visualizes" : "derived-from";
    runCommand({ type: "add", elements: [loading] });
    setDocument((current) => ({
      ...current,
      relationships: [...current.relationships, {
        id: `relationship-${Date.now()}`,
        type: relationshipType,
        sourceElementId: source.id,
        targetElementId: resultId,
        createdAt: now,
      }],
      actionHistory: [...current.actionHistory, {
        id: `action-${Date.now()}`,
        actionType,
        sourceElementId: source.id,
        resultElementId: resultId,
        inputExpression: source.latex,
        normalizedExpression: currentAnalysis.engineExpression,
        parameters,
        engineAdapter: loading.engine.adapter,
        underlyingEngine: "pending",
        startedAt: now,
        cancelled: false,
      }].slice(-100),
    }));
    setSelectedIds([resultId, source.id]);
    setRecognitionOpen(true);
    setMessage(`${actionLabel(actionType)} started`);
    const controller = new AbortController();
    actionControllersRef.current.set(resultId, controller);
    try {
      const response = await executeBoardAction({ action: actionType, analysis: currentAnalysis, parameters, signal: controller.signal });
      const completedAt = new Date().toISOString();
      setDocument((current) => ({
        ...current,
        elements: current.elements.map((element) => element.id === resultId && element.type === "math-result" ? {
          ...element,
          ...response,
          status: "success",
          updatedAt: completedAt,
        } : element),
        actionHistory: current.actionHistory.map((entry) => entry.resultElementId === resultId ? {
          ...entry,
          completedAt,
          result: response.exactOutputLatex ?? response.plainTextOutput,
          warnings: response.warnings,
          underlyingEngine: response.engine.underlyingEngine,
        } : entry),
      }));
      setMessage(`${actionLabel(actionType)} completed`);
      return true;
    } catch (error) {
      const normalizedError = normalizeBoardEngineError(error);
      const completedAt = new Date().toISOString();
      setDocument((current) => ({
        ...current,
        elements: current.elements.map((element) => element.id === resultId && element.type === "math-result" ? {
          ...element,
          status: normalizedError.code === "CANCELLED" ? "cancelled" : "error",
          error: normalizedError,
          updatedAt: completedAt,
        } : element),
        actionHistory: current.actionHistory.map((entry) => entry.resultElementId === resultId ? {
          ...entry,
          completedAt,
          error: normalizedError,
          cancelled: normalizedError.code === "CANCELLED",
        } : entry),
      }));
      setMessage(normalizedError.userMessage);
      return false;
    } finally {
      actionControllersRef.current.delete(resultId);
    }
  }, [actionParameters, document.elements, runCommand, selectedMath]);

  const setIntelligence = useCallback((next: BoardIntelligencePersistence) => {
    setDocument((current) => ({ ...current, intelligence: next, updatedAt: new Date().toISOString() }));
  }, []);

  const analyzeIntelligence = useCallback(async (command?: string) => {
    intelligenceAbortRef.current?.abort();
    const controller = new AbortController();
    intelligenceAbortRef.current = controller;
    setIntelligenceStatus("working");
    setMessage("Understanding selected Board context…");
    try {
      const result = await boardIntelligenceOrchestrator.understand({
        document,
        selectedElementIds: selectedIds,
        command,
      }, controller.signal);
      setUnderstanding(result);
      setDocument((current) => ({
        ...current,
        intelligence: {
          ...current.intelligence,
          activeProblem: result.activeProblem,
          sessionMemory: {
            ...current.intelligence.sessionMemory,
            activeProblemId: result.activeProblem?.id,
            updatedAt: new Date().toISOString(),
          },
        },
      }));
      setMessage(result.ambiguities.some((item) => item.requiresResolution)
        ? "Clarification required."
        : `Analysis complete. ${result.recommendations.length} recommendations available.`);
    } catch (error) {
      if ((error as Error).name !== "AbortError") setMessage("Selection understanding was cancelled or could not complete.");
    } finally {
      if (intelligenceAbortRef.current === controller) setIntelligenceStatus("idle");
    }
  }, [document, selectedIds]);

  const handleRecommendation = useCallback(async (recommendation: SmartBoardRecommendation) => {
    if (!recommendation.enabled) return;
    if (recommendation.boardActionType) {
      const completed = await executeAction(recommendation.boardActionType);
      if (completed) {
        setDocument((current) => ({
          ...current,
          intelligence: markBoardActionCompleted(current.intelligence, recommendation.id),
        }));
        setUnderstanding((current) => current ? {
          ...current,
          recommendations: current.recommendations.filter((item) => item.id !== recommendation.id),
        } : current);
      }
      return;
    }
    if (recommendation.action === "open-unit-converter") {
      window.open("/unit-converter", "_blank", "noopener,noreferrer");
      setMessage("Opened the existing unit converter.");
    }
  }, [executeAction]);

  const planIntelligenceWorkflow = useCallback((command: string) => {
    const context = buildBoardIntelligenceContext({ document, selectedElementIds: selectedIds });
    const plan = planBoardWorkflow({ context, command });
    setDocument((current) => ({
      ...current,
      intelligence: {
        ...current.intelligence,
        activeWorkflow: plan,
        sessionMemory: {
          ...current.intelligence.sessionMemory,
          activeWorkflowId: plan.id,
          updatedAt: new Date().toISOString(),
        },
      },
    }));
    setMessage("Workflow ready for review.");
  }, [document, selectedIds]);

  const patchActiveWorkflow = useCallback((updater: (plan: SmartBoardWorkflowPlan) => SmartBoardWorkflowPlan) => {
    setDocument((current) => {
      const plan = current.intelligence.activeWorkflow;
      return plan ? {
        ...current,
        intelligence: { ...current.intelligence, activeWorkflow: updater(plan) },
      } : current;
    });
  }, []);

  const runApprovedWorkflow = useCallback(async () => {
    const initial = document.intelligence.activeWorkflow;
    if (!initial || workflowRunning) return;
    const source = selectedMath ?? document.elements.find((element): element is MathExpressionElement => (
      element.type === "math-expression" && initial.goal.targetElementIds.includes(element.id)
    ));
    const controller = new AbortController();
    workflowAbortRef.current?.abort();
    workflowAbortRef.current = controller;
    setWorkflowRunning(true);
    let plan: SmartBoardWorkflowPlan = { ...initial, status: "running" };
    patchActiveWorkflow(() => plan);
    try {
      for (const step of plan.steps) {
        if (controller.signal.aborted) break;
        if (step.status !== "approved") continue;
        const dependenciesReady = step.dependsOnStepIds.every((id) => {
          const dependency = plan.steps.find((candidate) => candidate.id === id);
          return dependency?.status === "success" || dependency?.status === "skipped";
        });
        if (!dependenciesReady) {
          plan = updateWorkflowStep(plan, step.id, { status: "failed", error: "A required earlier step did not complete." });
          patchActiveWorkflow(() => plan);
          break;
        }
        plan = updateWorkflowStep(plan, step.id, { status: "running", error: undefined });
        patchActiveWorkflow(() => plan);
        let completed = true;
        if (step.boardActionType) completed = await executeAction(step.boardActionType, source, step.parameters ?? actionParameters);
        if (step.toolId === "physics.open-unit-converter") {
          window.open("/unit-converter", "_blank", "noopener,noreferrer");
        }
        plan = updateWorkflowStep(plan, step.id, {
          status: completed ? "success" : "failed",
          error: completed ? undefined : "The existing engine did not complete this step.",
        });
        patchActiveWorkflow(() => plan);
        if (!completed) break;
      }
      if (!controller.signal.aborted && plan.steps.every((step) => ["success", "skipped", "pending"].includes(step.status))) {
        const unfinishedApproved = plan.steps.some((step) => step.status === "approved" || step.status === "running");
        if (!unfinishedApproved && plan.steps.every((step) => ["success", "skipped"].includes(step.status))) {
          plan = { ...plan, status: "completed" };
          patchActiveWorkflow(() => plan);
          setMessage("Workflow completed and results linked to the source.");
        } else {
          patchActiveWorkflow(() => ({ ...plan, status: "paused" }));
          setMessage("Approved workflow steps completed. Remaining steps await approval.");
        }
      }
    } finally {
      setWorkflowRunning(false);
    }
  }, [actionParameters, document.elements, document.intelligence.activeWorkflow, executeAction, patchActiveWorkflow, selectedMath, workflowRunning]);

  const cancelIntelligenceWorkflow = useCallback(() => {
    workflowAbortRef.current?.abort();
    actionControllersRef.current.forEach((controller) => controller.abort());
    patchActiveWorkflow(cancelBoardWorkflow);
    setWorkflowRunning(false);
    setMessage("Workflow cancelled.");
  }, [patchActiveWorkflow]);

  const setTutorMessages = useCallback((messages: BoardTutorMessage[]) => {
    setDocument((current) => ({ ...current, tutorMessages: messages, updatedAt: new Date().toISOString() }));
  }, []);

  const insertTutorExplanation = useCallback((response: { text: string; verified: boolean; referencedElementIds: string[] }) => {
    const source = document.elements.find((element) => response.referencedElementIds.includes(element.id));
    const explanation: BoardExplanationElement = {
      id: `explanation-${Date.now()}`,
      type: "explanation",
      title: response.verified ? "Verified tutor note" : "Tutor guidance",
      text: response.text,
      sourceElementIds: response.referencedElementIds,
      verified: response.verified,
      bounds: {
        x: (source?.bounds.x ?? 80) + (source?.bounds.width ?? 200) + 36,
        y: source?.bounds.y ?? 80,
        width: 330,
        height: 160,
      },
      createdAt: new Date().toISOString(),
    };
    runCommand({ type: "add", elements: [explanation] });
    setDocument((current) => ({
      ...current,
      relationships: [
        ...current.relationships,
        ...response.referencedElementIds.map((sourceElementId, index) => ({
          id: `relationship-explanation-${Date.now()}-${index}`,
          type: "explains" as const,
          sourceElementId,
          targetElementId: explanation.id,
          createdAt: new Date().toISOString(),
        })),
      ],
    }));
    setSelectedIds([explanation.id, ...response.referencedElementIds]);
    setMessage("Tutor explanation inserted and linked to its source.");
  }, [document.elements, runCommand]);

  const insertImage = useCallback((image: BoardImageElement) => {
    runCommand({ type: "add", elements: [image] });
    setSelectedIds([image.id]);
    setMessage(`Image inserted locally with ${image.recognitionRegions.length} review regions.`);
  }, [runCommand]);

  const checkSelectedWork = useCallback(async () => {
    const expressions = selectedElements.filter((element): element is MathExpressionElement => element.type === "math-expression");
    if (expressions.length < 2) {
      setMessage("Select at least two inserted expressions to check multi-line work.");
      return;
    }
    try {
      const created = createSolutionSequence(expressions);
      const rightEdge = Math.max(...expressions.map((element) => element.bounds.x + element.bounds.width));
      const steps = created.steps.map((step, index) => ({
        ...step,
        bounds: { ...step.bounds, x: rightEdge + 36, y: Math.min(...expressions.map((element) => element.bounds.y)) + index * 78, width: Math.max(260, step.bounds.width) },
      }));
      const allElements = [...document.elements, ...steps];
      const result = await verifySolutionSequence(created.sequence, allElements);
      const classification = analyzeBoardExpression(expressions[0].latex).classification;
      const confidences = expressions.map((element) => element.recognitionConfidence).filter((value): value is number => typeof value === "number");
      recordBoardMasteryEvidence({
        classification,
        verification: result,
        recognitionConfidence: confidences.length ? Math.min(...confidences) : 1,
      });
      setDocument((current) => ({
        ...current,
        elements: applyVerification([...current.elements, ...steps], result),
        solutionSequences: [...current.solutionSequences, created.sequence],
        relationships: [...current.relationships, ...created.relationships],
        updatedAt: new Date().toISOString(),
      }));
      setHistory((current) => recordCommand(current, { type: "add", elements: steps }));
      setWorkVerification(result);
      setSelectedIds(result.firstInvalidStepId ? [result.firstInvalidStepId] : steps.map((step) => step.id));
      setRecognitionOpen(true);
      setMessage(result.firstInvalidStepId ? "First invalid step highlighted." : "Every recognized transformation is valid.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Work verification failed.");
    }
  }, [document.elements, selectedElements]);

  const performExport = useCallback(async (format: Parameters<typeof exportBoard>[1]) => {
    const target = boardSurfaceRef.current;
    if (!target) return;
    try {
      await exportBoard(document, format, target, { includeTutor: true, selectedElementIds: selectedIds });
      setMessage(`Board ${format} export completed.`);
      setExportOpen(false);
    } catch {
      setMessage("Export failed. Try JSON or LaTeX export.");
    }
  }, [document, selectedIds]);

  const commands = useMemo<BoardPaletteCommand[]>(() => {
    const hasMath = Boolean(selectedMath);
    const multiLine = selectedElements.filter((element) => element.type === "math-expression").length >= 2;
    const action = (id: string, label: string, actionType: BoardActionType, priority: number): BoardPaletteCommand => ({
      id,
      label,
      enabled: hasMath,
      disabledReason: hasMath ? undefined : "Select an expression",
      priority,
      run: () => void executeAction(actionType),
    });
    return [
      { id: "recognize", label: "Recognize selection", enabled: selectedStrokes.length > 0, disabledReason: "Select handwriting", priority: 1, run: () => void recognize() },
      { id: "understand", label: "Understand selection", keywords: "identify subject concept intelligence", enabled: selectedIds.length > 0, disabledReason: "Select Board content", priority: 1, run: () => { setIntelligenceOpen(true); setRecognitionOpen(true); void analyzeIntelligence(); } },
      { id: "intelligence", label: "Open Intelligence panel", keywords: "recommend workflow goal", enabled: true, priority: 2, run: () => { setIntelligenceOpen(true); setRecognitionOpen(true); } },
      action("solve", "Solve selected equation", "solve", 2),
      action("simplify", "Simplify", "simplify", 3),
      action("factor", "Factor", "factor", 4),
      action("expand", "Expand", "expand", 5),
      action("differentiate", "Differentiate", "differentiate", 6),
      action("integrate", "Integrate", "integrate", 7),
      action("graph", "Draw graph", "plot-2d", 8),
      { id: "check-work", label: "Check my work", enabled: multiLine, disabledReason: "Select two or more expressions", priority: 2, run: () => void checkSelectedWork() },
      { id: "tutor", label: "Ask AI Math Tutor", enabled: hasMath || multiLine, disabledReason: "Select Board mathematics", priority: 3, run: () => { setTutorOpen(true); setRecognitionOpen(true); } },
      { id: "hint", label: "Give a hint", enabled: hasMath, disabledReason: "Select an expression", priority: 4, run: () => { setTutorOpen(true); setRecognitionOpen(true); } },
      { id: "image", label: "Import image", enabled: true, priority: 10, run: () => setImageImportOpen(true) },
      { id: "save", label: "Save Board", enabled: true, priority: 11, run: saveCurrent },
      { id: "export", label: "Export Board", enabled: true, priority: 12, run: () => setExportOpen(true) },
      { id: "outline", label: "Open Board Outline", enabled: true, priority: 13, run: () => { setOutlineOpen(true); setRecognitionOpen(true); } },
      { id: "clear-selection", label: "Clear selection", enabled: selectedIds.length > 0, disabledReason: "Nothing selected", priority: 14, run: () => setSelectedIds([]) },
    ];
  }, [analyzeIntelligence, checkSelectedWork, executeAction, recognize, saveCurrent, selectedElements, selectedIds.length, selectedMath, selectedStrokes.length]);

  useEffect(() => {
    const timer = window.setTimeout(() => saveDraft(document), 500);
    return () => window.clearTimeout(timer);
  }, [document]);

  useEffect(() => {
    const settings = document.automaticRecognition;
    const strokes = document.elements.filter((element): element is StrokeElement => element.type === "stroke");
    if (settings.mode === "manual" || settings.disabledForSession || strokes.length < settings.minimumStrokeCount) return undefined;
    abortRef.current?.abort();
    const timer = window.setTimeout(() => {
      void fingerprintStrokes(strokes.flatMap((stroke) => stroke.points)).then((fingerprint) => {
        if (fingerprint === document.automaticRecognition.lastFingerprint) return;
        setDocument((current) => ({ ...current, automaticRecognition: { ...current.automaticRecognition, lastFingerprint: fingerprint } }));
        if (settings.mode === "suggest") {
          setAutoSuggestion(true);
          setMessage("Writing group ready for recognition.");
        } else {
          void recognize();
        }
      });
    }, settings.pauseMs);
    return () => window.clearTimeout(timer);
  }, [document.automaticRecognition, document.elements, recognize]);

  useEffect(() => {
    const preferences = document.intelligence.sessionMemory.userPreferences;
    if (
      preferences.intelligenceMode === "manual"
      || !preferences.proactiveRecommendations
      || document.intelligence.recommendationsDisabled
      || selectedIds.length === 0
    ) return undefined;
    const selectedFingerprint = selectedIds.map((id) => {
      const element = document.elements.find((candidate) => candidate.id === id);
      return element?.type === "math-expression" ? `${id}:${element.latex}` : `${id}:${element?.type ?? "missing"}`;
    }).join("|");
    if (intelligenceFingerprintRef.current === selectedFingerprint) return undefined;
    const timer = window.setTimeout(() => {
      intelligenceFingerprintRef.current = selectedFingerprint;
      void analyzeIntelligence();
    }, preferences.stablePauseMs);
    return () => window.clearTimeout(timer);
  }, [
    analyzeIntelligence,
    document.elements,
    document.intelligence.recommendationsDisabled,
    document.intelligence.sessionMemory.userPreferences,
    selectedIds,
  ]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      const typing = target?.tagName === "INPUT" || target?.tagName === "TEXTAREA" || target?.getAttribute("contenteditable") === "true";
      const command = event.ctrlKey || event.metaKey;
      if (command && event.key.toLowerCase() === "k") {
        event.preventDefault();
        event.stopImmediatePropagation();
        setCommandOpen((value) => !value);
      } else if (command && event.key.toLowerCase() === "s" && !event.shiftKey) {
        event.preventDefault();
        saveCurrent();
      } else if (command && event.key.toLowerCase() === "z" && event.shiftKey) {
        event.preventDefault();
        redo();
      } else if (command && event.key.toLowerCase() === "z") {
        event.preventDefault();
        undo();
      } else if (command && event.key === "Enter" && selectedMath && analysis?.suggestedActions[0]) {
        event.preventDefault();
        void executeAction(analysis.suggestedActions[0].type);
      } else if (command && event.key === "Enter") {
        event.preventDefault();
        void recognize();
      } else if (command && event.key.toLowerCase() === "g" && selectedMath) {
        event.preventDefault();
        void executeAction("plot-2d");
      } else if (command && event.shiftKey && event.key.toLowerCase() === "s" && selectedMath) {
        event.preventDefault();
        void executeAction("solve");
      } else if (command && event.shiftKey && event.key.toLowerCase() === "d" && selectedMath) {
        event.preventDefault();
        void executeAction("differentiate");
      } else if (command && event.shiftKey && event.key.toLowerCase() === "i" && selectedMath) {
        event.preventDefault();
        void executeAction("integrate");
      } else if (!typing && !command) {
        if (event.key.toLowerCase() === "p") setTool("pen");
        if (event.key.toLowerCase() === "e") setTool("eraser");
        if (event.key.toLowerCase() === "v") setTool("select");
        if (event.key.toLowerCase() === "h") setTool("pan");
        if ((event.key === "Delete" || event.key === "Backspace") && selectedElements.length) {
          event.preventDefault();
          removeElements(selectedElements);
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown, true);
    return () => window.removeEventListener("keydown", handleKeyDown, true);
  }, [analysis?.suggestedActions, executeAction, recognize, redo, removeElements, saveCurrent, selectedElements, selectedMath, undo]);

  useEffect(() => () => {
    abortRef.current?.abort();
    intelligenceAbortRef.current?.abort();
    workflowAbortRef.current?.abort();
    actionControllersRef.current.forEach((controller) => controller.abort());
  }, []);

  return (
    <MathLabLayout
      title="Board — Intelligent AI Canvas"
      subtitle="Write mathematics naturally, select the relevant strokes, and turn recognition results into editable mathematical notation."
    >
      <div ref={boardSurfaceRef} className="space-y-3" data-testid="board-page">
        <section className="glass-card overflow-hidden rounded-xl">
          <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 p-2 dark:border-white/10">
            {tools.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                type="button"
                className={tool === id ? "action-primary" : "tool-button"}
                aria-pressed={tool === id}
                aria-label={label}
                title={label}
                onClick={() => setTool(id)}
              >
                <Icon className="h-4 w-4" /> <span className="hidden 2xl:inline">{label.split(" (")[0]}</span>
              </button>
            ))}
            <span className="mx-1 hidden h-7 w-px bg-slate-200 dark:bg-white/10 sm:block" />
            <button type="button" className="tool-button" onClick={undo} disabled={!history.undo.length} aria-label="Undo"><Undo2 className="h-4 w-4" /></button>
            <button type="button" className="tool-button" onClick={redo} disabled={!history.redo.length} aria-label="Redo"><Redo2 className="h-4 w-4" /></button>
            <button type="button" className="tool-button" onClick={clearBoard} aria-label="Clear board"><Trash2 className="h-4 w-4" /></button>
            <button type="button" className="tool-button" onClick={() => setViewport({ ...document.viewport, zoom: Math.min(4, document.viewport.zoom * 1.2) })} aria-label="Zoom in"><ZoomIn className="h-4 w-4" /></button>
            <button type="button" className="tool-button" onClick={() => setViewport({ ...document.viewport, zoom: Math.max(0.25, document.viewport.zoom / 1.2) })} aria-label="Zoom out"><ZoomOut className="h-4 w-4" /></button>
            <button type="button" className="tool-button" onClick={() => setViewport({ x: 0, y: 0, zoom: 1 })} aria-label="Reset viewport"><RotateCcw className="h-4 w-4" /></button>
            <button type="button" className="action-primary" onClick={() => void recognize()} disabled={recognitionStatus === "working"}>
              <ScanLine className="h-4 w-4" /> {recognitionStatus === "working" ? "Recognizing…" : "Recognize"}
            </button>
            <button type="button" className="tool-button" onClick={saveCurrent}><Save className="h-4 w-4" /><span className="hidden xl:inline">Save</span></button>
            <button type="button" className="tool-button" onClick={() => setLibraryOpen((value) => !value)}><FolderOpen className="h-4 w-4" /><span className="hidden xl:inline">Load</span></button>
            <button type="button" className="tool-button" onClick={() => setTutorOpen((value) => !value)} aria-pressed={tutorOpen} aria-label="Tutor"><BrainCircuit className="h-4 w-4" /><span className="hidden 2xl:inline">Tutor</span></button>
            <button type="button" className="tool-button" onClick={() => { setIntelligenceOpen((value) => !value); setRecognitionOpen(true); }} aria-pressed={intelligenceOpen} aria-label="Intelligence"><Sparkles className="h-4 w-4" /><span className="hidden 2xl:inline">Intelligence</span></button>
            <button type="button" className="tool-button" onClick={() => setImageImportOpen(true)} aria-label="Image import"><Camera className="h-4 w-4" /><span className="hidden 2xl:inline">Image</span></button>
            <button type="button" className="tool-button" onClick={() => setCommandOpen(true)} aria-label="Open Board command palette"><Command className="h-4 w-4" /><span className="hidden 2xl:inline">Commands</span></button>
            <button type="button" className="tool-button" onClick={() => setOutlineOpen((value) => !value)} aria-pressed={outlineOpen} aria-label="Toggle Board Outline"><Grid3X3 className="h-4 w-4" /></button>
            <button type="button" className="tool-button" onClick={() => setExportOpen((value) => !value)} aria-expanded={exportOpen} aria-label="Export"><Download className="h-4 w-4" /><span className="hidden 2xl:inline">Export</span></button>
            <button type="button" className="tool-button" onClick={() => setSettingsOpen((value) => !value)} aria-expanded={settingsOpen}><Settings2 className="h-4 w-4" /></button>
            <button type="button" className="ml-auto tool-button" onClick={() => setRecognitionOpen((value) => !value)} aria-label="Toggle recognition panel">
              {recognitionOpen ? <PanelRightClose className="h-4 w-4" /> : <PanelRightOpen className="h-4 w-4" />}
            </button>
          </div>

          {settingsOpen && (
            <div className="grid gap-3 border-b border-slate-200 p-3 dark:border-white/10 sm:grid-cols-2 lg:grid-cols-5">
              <label className="text-sm font-semibold">Board title
                <input className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 dark:border-white/10 dark:bg-slate-950" value={document.title} onChange={(event) => setDocument((current) => ({ ...current, title: event.target.value }))} />
              </label>
              <label className="text-sm font-semibold">Background
                <select className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 dark:border-white/10 dark:bg-slate-950" value={document.background} onChange={(event) => runCommand({ type: "background", before: document.background, after: event.target.value as BoardDocument["background"] })}>
                  <option value="grid">Grid</option><option value="dots">Dotted</option><option value="plain">Plain</option><option value="ruled">Ruled</option>
                </select>
              </label>
              <label className="text-sm font-semibold">Stroke width: {strokeWidth}
                <input className="slider-range mt-2 w-full" type="range" min="1" max="12" value={strokeWidth} onChange={(event) => setStrokeWidth(Number(event.target.value))} />
              </label>
              <label className="text-sm font-semibold">Ink color
                <input className="mt-1 h-10 w-full rounded-lg border border-slate-200 bg-white p-1 dark:border-white/10 dark:bg-slate-950" type="color" value={color} onChange={(event) => setColor(event.target.value)} />
              </label>
              <label className="flex min-h-11 items-center gap-2 self-end text-sm font-semibold">
                <input type="checkbox" checked={document.snapToGrid} onChange={(event) => setDocument((current) => ({ ...current, snapToGrid: event.target.checked }))} /> Snap to grid
              </label>
              <label className="text-sm font-semibold">Recognition after pause
                <select className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 dark:border-white/10 dark:bg-slate-950" value={document.automaticRecognition.mode} onChange={(event) => setDocument((current) => ({ ...current, automaticRecognition: { ...current.automaticRecognition, mode: event.target.value as BoardDocument["automaticRecognition"]["mode"] } }))}>
                  <option value="manual">Manual only</option><option value="suggest">Suggest after pause</option><option value="automatic">Recognize completed group</option>
                </select>
              </label>
              <label className="text-sm font-semibold">Pause: {document.automaticRecognition.pauseMs} ms
                <input className="slider-range mt-2 w-full" type="range" min="800" max="4000" step="100" value={document.automaticRecognition.pauseMs} onChange={(event) => setDocument((current) => ({ ...current, automaticRecognition: { ...current.automaticRecognition, pauseMs: Number(event.target.value) } }))} />
              </label>
            </div>
          )}

          {exportOpen && (
            <div className="flex flex-wrap gap-2 border-b border-slate-200 p-3 dark:border-white/10" aria-label="Board export options">
              <button type="button" className="tool-button" onClick={() => void performExport("png")}>PNG</button>
              <button type="button" className="tool-button" onClick={() => void performExport("pdf")}>PDF</button>
              <button type="button" className="tool-button" onClick={() => void performExport("json")}>Board JSON</button>
              <button type="button" className="tool-button" onClick={() => void performExport("latex")}>LaTeX</button>
              <button type="button" className="tool-button" onClick={() => void performExport("tutor-text")}>Tutor transcript</button>
              <button type="button" className="tool-button" onClick={() => void performExport("print")}>Print</button>
              <span className="self-center text-xs text-slate-500">Account sharing is unavailable; local export remains available.</span>
            </div>
          )}

          {libraryOpen && (
            <div className="border-b border-slate-200 p-3 dark:border-white/10">
              <div className="mb-2 flex flex-wrap items-center gap-2">
                <strong className="text-sm">Saved Boards</strong>
                <button type="button" className="tool-button" onClick={() => {
                  setDocument(createBoardDocument());
                  setHistory(emptyBoardHistory());
                  setSelectedIds([]);
                }}>New Board</button>
              </div>
              {savedBoards.length ? (
                <div className="flex flex-wrap gap-2">
                  {savedBoards.map((board) => (
                    <div key={board.id} className="flex items-center rounded-lg border border-slate-200 dark:border-white/10">
                      <button type="button" className="px-3 py-2 text-left text-sm" onClick={() => {
                        setDocument(board);
                        setHistory(emptyBoardHistory());
                        setSelectedIds([]);
                        setLibraryOpen(false);
                        setMessage(`Loaded “${board.title}”`);
                      }}>{board.title}</button>
                      <button type="button" className="p-2 text-rose-600" aria-label={`Delete ${board.title}`} onClick={() => setSavedBoards(deleteBoard(board.id))}><Trash2 className="h-4 w-4" /></button>
                    </div>
                  ))}
                </div>
              ) : <p className="text-sm text-slate-500">No saved Boards yet. Your current work is still autosaved as a draft.</p>}
            </div>
          )}

          <div className={`grid min-w-0 ${recognitionOpen ? "xl:grid-cols-[minmax(0,1fr)_380px]" : ""}`}>
            <div className="min-w-0 p-2">
              <BoardCanvas
                document={document}
                tool={tool}
                color={tool === "highlighter" ? "#facc15" : color}
                width={tool === "highlighter" ? Math.max(12, strokeWidth * 4) : strokeWidth}
                selectedIds={selectedIds}
                onAddStroke={addStroke}
                onDeleteElements={removeElements}
                onSelectionChange={setSelectedIds}
                onMoveSelection={moveSelection}
                onViewportChange={setViewport}
                overlay={<>
                  {document.elements.filter((element): element is BoardImageElement => element.type === "image" && Boolean(element.dataUrl)).map((image) => {
                    const point = boardToScreen({ x: image.bounds.x, y: image.bounds.y }, document.viewport);
                    return <img
                      key={image.id}
                      src={image.dataUrl}
                      alt={`Imported ${image.source} reference with ${image.recognitionRegions.length} detected regions`}
                      className={`pointer-events-none absolute z-[2] object-contain ${selectedIds.includes(image.id) ? "ring-2 ring-cyan-400" : ""}`}
                      style={{
                        left: point.x,
                        top: point.y,
                        width: image.bounds.width * document.viewport.zoom,
                        height: image.bounds.height * document.viewport.zoom,
                        opacity: image.opacity,
                        transform: `rotate(${image.rotation}deg)`,
                      }}
                    />;
                  })}
                  {document.elements.filter((element): element is BoardResultElement => element.type === "math-result").map((result) => {
                    const source = document.elements.find((element) => element.id === result.sourceElementIds[0] && element.type === "math-expression") as MathExpressionElement | undefined;
                    return (
                    <BoardResultCard
                      key={result.id}
                      result={result}
                      viewport={document.viewport}
                      selected={selectedIds.includes(result.id)}
                      onSelect={() => setSelectedIds([result.id, ...result.sourceElementIds])}
                      onMove={(dx, dy) => moveSelection([result.id], dx, dy)}
                      onToggle={() => setDocument((current) => ({ ...current, elements: current.elements.map((element) => element.id === result.id && element.type === "math-result" ? { ...element, collapsed: !element.collapsed } : element) }))}
                      onDelete={() => removeElements([result])}
                      onRerun={() => {
                        if (result.status === "loading") actionControllersRef.current.get(result.id)?.abort();
                        else if (source) void executeAction(result.actionType, source, result.parameters ?? {});
                      }}
                      onInsert={() => {
                        if (!result.exactOutputLatex) return;
                        const expression: MathExpressionElement = {
                          id: `math-${Date.now()}`,
                          type: "math-expression",
                          latex: result.exactOutputLatex,
                          normalizedExpression: result.exactOutputLatex,
                          sourceStrokeIds: [],
                          bounds: { x: result.bounds.x, y: result.bounds.y + result.bounds.height + 24, width: 220, height: 64 },
                          createdAt: new Date().toISOString(),
                        };
                        runCommand({ type: "add", elements: [expression] });
                        setDocument((current) => ({ ...current, relationships: [...current.relationships, { id: `relationship-${Date.now()}`, type: "uses-result-of", sourceElementId: result.id, targetElementId: expression.id, createdAt: new Date().toISOString() }] }));
                        setSelectedIds([expression.id]);
                      }}
                    />
                    );
                  })}
                </>}
              />
              <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-slate-500" aria-live="polite">
                <span>{message}</span><span>·</span><span>{document.elements.length} elements</span><span>·</span><span>{selectedStrokes.length} selected strokes</span>
                {autoSuggestion && <button type="button" className="action-primary min-h-8 px-2" onClick={() => { setAutoSuggestion(false); void recognize(); }}>Recognize completed group</button>}
                <button type="button" className="tool-button min-h-8 px-2" onClick={() => void checkSelectedWork()} disabled={selectedElements.filter((element) => element.type === "math-expression").length < 2}>Check my work</button>
                {selectedStrokes.length > 1 && (
                  <>
                    <button type="button" className="tool-button min-h-8 px-2" onClick={() => {
                      const groupId = `group-${Date.now()}`;
                      setDocument((current) => ({ ...current, elements: current.elements.map((element) => selectedIds.includes(element.id) && element.type === "stroke" ? { ...element, groupId } : element) }));
                      setMessage("Selected strokes merged into one recognition group");
                    }}>Merge group</button>
                    <button type="button" className="tool-button min-h-8 px-2" onClick={() => {
                      setDocument((current) => ({ ...current, elements: current.elements.map((element) => selectedIds.includes(element.id) && element.type === "stroke" ? { ...element, groupId: undefined } : element) }));
                      setMessage("Selected recognition group split");
                    }}>Split group</button>
                  </>
                )}
              </div>
            </div>

            {recognitionOpen && (
              <aside className="max-h-[72vh] overflow-y-auto border-t border-slate-200 p-3 dark:border-white/10 xl:border-l xl:border-t-0" aria-label="Recognition panel">
                {intelligenceOpen && (
                  <Suspense fallback={<p className="mb-4 text-sm text-slate-500">Loading intelligence…</p>}>
                    <BoardIntelligencePanel
                      intelligence={document.intelligence}
                      understanding={understanding}
                      analyzing={intelligenceStatus === "working"}
                      workflowRunning={workflowRunning}
                      onAnalyze={() => void analyzeIntelligence()}
                      onChange={setIntelligence}
                      onRecommendation={(recommendation) => void handleRecommendation(recommendation)}
                      onDismissRecommendation={(recommendation, mode) => {
                        setDocument((current) => ({
                          ...current,
                          intelligence: dismissBoardRecommendation(current.intelligence, recommendation.id, mode, recommendation.category),
                        }));
                        setUnderstanding((current) => current ? {
                          ...current,
                          recommendations: current.recommendations.filter((item) => item.id !== recommendation.id),
                        } : current);
                        setMessage(mode === "snooze" ? "Recommendation snoozed." : "Recommendation dismissed.");
                      }}
                      onPlan={planIntelligenceWorkflow}
                      onApproveAll={() => patchActiveWorkflow(approveSafeWorkflowSteps)}
                      onApproveStep={(stepId) => patchActiveWorkflow((plan) => updateWorkflowStep(plan, stepId, { status: "approved" }))}
                      onRun={() => void runApprovedWorkflow()}
                      onCancel={cancelIntelligenceWorkflow}
                      onRetry={(stepId) => patchActiveWorkflow((plan) => updateWorkflowStep(plan, stepId, { status: "approved", error: undefined }))}
                      onSkip={(stepId) => patchActiveWorkflow((plan) => updateWorkflowStep(plan, stepId, { status: "skipped", error: undefined }))}
                    />
                  </Suspense>
                )}
                {tutorOpen && (
                  <div className="mb-4 border-b border-slate-200 pb-4 dark:border-white/10">
                    <Suspense fallback={<p className="text-sm text-slate-500">Loading tutor…</p>}>
                      <BoardTutorPanel
                        document={document}
                        selectedIds={selectedIds}
                        onMessagesChange={setTutorMessages}
                        onHighlight={setSelectedIds}
                        onInsert={insertTutorExplanation}
                        onVisual={() => {
                          if (selectedMath) void executeAction("plot-2d");
                        }}
                        onCheckWork={() => void checkSelectedWork()}
                      />
                    </Suspense>
                  </div>
                )}
                {outlineOpen && (
                  <div className="mb-4 border-b border-slate-200 pb-4 dark:border-white/10">
                    <BoardOutline document={document} selectedIds={selectedIds} onSelect={setSelectedIds} />
                  </div>
                )}
                {workVerification && (
                  <section className="mb-4 rounded-lg bg-slate-100 p-3 dark:bg-white/5" aria-label="Work verification result" aria-live="polite">
                    <div className="flex items-center justify-between gap-2">
                      <h2 className="font-bold">Work verification</h2>
                      <span className="mini-chip">{workVerification.overallStatus}</span>
                    </div>
                    <ol className="mt-2 space-y-1 text-sm">
                      {workVerification.verifiedSteps.map((step, index) => (
                        <li key={step.stepId}>
                          <button type="button" className={`w-full rounded-md px-2 py-1 text-left ${step.status === "invalid" ? "bg-rose-100 text-rose-900 dark:bg-rose-500/15 dark:text-rose-100" : ""}`} onClick={() => setSelectedIds([step.stepId])}>
                            Step {index + 1}: {step.status} {step.explanation ? `· ${step.explanation}` : ""}
                          </button>
                        </li>
                      ))}
                    </ol>
                    {workVerification.misconceptions?.map((item) => <p key={item.id} className="mt-2 text-sm"><strong>{item.title}:</strong> {item.correctiveHint}</p>)}
                  </section>
                )}
                {selectedImage && (
                  <section className="mb-4 border-b border-slate-200 pb-4 dark:border-white/10" aria-label="Imported image region review">
                    <div className="flex items-center justify-between gap-2">
                      <div><h2 className="font-bold">Image regions</h2><p className="text-xs text-slate-500">Review local detection and enter corrected LaTeX.</p></div>
                      <span className="mini-chip">{selectedImage.recognitionRegions.length}</span>
                    </div>
                    <div className="mt-2 space-y-2">
                      {normalizeReadingOrder(selectedImage.recognitionRegions).map((region) => (
                        <div key={region.id} className="rounded-lg bg-slate-100 p-2 dark:bg-white/5">
                          <div className="flex items-center gap-2 text-xs">
                            <input type="checkbox" checked={region.selected} onChange={(event) => setDocument((current) => ({
                              ...current,
                              elements: current.elements.map((element) => element.id === selectedImage.id && element.type === "image" ? {
                                ...element,
                                recognitionRegions: element.recognitionRegions.map((item) => item.id === region.id ? { ...item, selected: event.target.checked } : item),
                              } : element),
                            }))} aria-label={`Include region ${(region.readingOrder ?? 0) + 1}`} />
                            <strong>Region {(region.readingOrder ?? 0) + 1}</strong><span>{region.regionType}</span>
                          </div>
                          <input
                            className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-2 py-1.5 dark:border-white/10 dark:bg-slate-950"
                            value={region.recognizedLatex ?? ""}
                            placeholder="Corrected LaTeX"
                            onChange={(event) => setDocument((current) => ({
                              ...current,
                              elements: current.elements.map((element) => element.id === selectedImage.id && element.type === "image" ? {
                                ...element,
                                recognitionRegions: element.recognitionRegions.map((item) => item.id === region.id ? {
                                  ...item,
                                  recognizedLatex: event.target.value,
                                  recognitionStatus: event.target.value.trim() ? "success" : "idle",
                                } : item),
                              } : element),
                            }))}
                          />
                        </div>
                      ))}
                    </div>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <button type="button" className="action-primary" onClick={() => {
                        const regions = normalizeReadingOrder(selectedImage.recognitionRegions).filter((region) => region.selected && region.recognizedLatex?.trim());
                        const expressions: MathExpressionElement[] = regions.map((region, index) => ({
                          id: `math-image-${Date.now()}-${index}`,
                          type: "math-expression",
                          latex: region.recognizedLatex!.trim(),
                          normalizedExpression: region.recognizedLatex!.trim(),
                          sourceStrokeIds: [],
                          bounds: { x: selectedImage.bounds.x + selectedImage.bounds.width + 36, y: selectedImage.bounds.y + index * 72, width: 240, height: 58 },
                          createdAt: new Date().toISOString(),
                        }));
                        if (!expressions.length) {
                          setMessage("Enter corrected LaTeX for at least one selected image region.");
                          return;
                        }
                        runCommand({ type: "add", elements: expressions });
                        setDocument((current) => ({
                          ...current,
                          relationships: [...current.relationships, ...expressions.map((expression, index) => ({
                            id: `relationship-image-${Date.now()}-${index}`,
                            type: "detected-from-image" as const,
                            sourceElementId: selectedImage.id,
                            targetElementId: expression.id,
                            createdAt: new Date().toISOString(),
                          }))],
                        }));
                        setSelectedIds(expressions.map((expression) => expression.id));
                        setMessage(`${expressions.length} editable image expressions inserted.`);
                      }}>Insert selected expressions</button>
                      <button type="button" className="tool-button" onClick={() => setDocument((current) => ({
                        ...current,
                        elements: current.elements.map((element) => element.id === selectedImage.id && element.type === "image" ? {
                          ...element,
                          recognitionRegions: normalizeReadingOrder([...element.recognitionRegions, {
                            id: `region-${Date.now()}`,
                            imageElementId: element.id,
                            bounds: { x: 0, y: 0, width: element.width, height: element.height },
                            regionType: "unknown",
                            selected: true,
                            recognitionStatus: "idle",
                          }]),
                        } : element),
                      }))}>Add region</button>
                    </div>
                  </section>
                )}
                {selectedMath && analysis && (
                  <section className="mb-4 border-b border-slate-200 pb-4 dark:border-white/10" aria-label="Contextual mathematical actions">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h2 className="font-bold">Math actions</h2>
                        <p className="text-xs text-slate-500">{analysis.classification} · {analysis.variables.length ? `variables ${analysis.variables.join(", ")}` : "no variables"}</p>
                      </div>
                      <span className="mini-chip">{analysis.detectedStructures.slice(0, 2).join(" · ") || "expression"}</span>
                    </div>
                    {analysis.ambiguities.map((ambiguity) => (
                      <div key={ambiguity.id} className="mt-2 rounded-lg bg-amber-50 p-2 text-sm text-amber-900 dark:bg-amber-400/10 dark:text-amber-100">
                        <p>{ambiguity.description}</p>
                        <div className="mt-2 flex flex-wrap gap-1">
                          {ambiguity.candidates.map((candidate) => (
                            <button key={candidate.label} type="button" className="tool-button min-h-8 px-2" onClick={() => {
                              const replacement = candidate.latex ?? selectedMath.latex;
                              runCommand({ type: "edit-math", id: selectedMath.id, before: selectedMath.latex, after: replacement });
                              setMessage(`Resolved as ${candidate.label}`);
                            }}>{candidate.label}</button>
                          ))}
                        </div>
                      </div>
                    ))}
                    <div className="mt-3 flex flex-wrap gap-2">
                      {analysis.suggestedActions.slice(0, 5).map((action) => (
                        <button key={action.id} type="button" className={action.priority <= 15 ? "action-primary" : "tool-button"} disabled={!action.enabled} title={action.disabledReason} onClick={() => void executeAction(action.type)}>
                          {action.label}
                        </button>
                      ))}
                    </div>
                    {analysis.suggestedActions.length > 5 && (
                      <details className="mt-2">
                        <summary className="cursor-pointer text-sm font-bold">More actions</summary>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {analysis.suggestedActions.slice(5).map((action) => <button key={action.id} type="button" className="tool-button" disabled={!action.enabled} onClick={() => void executeAction(action.type)}>{action.label}</button>)}
                        </div>
                      </details>
                    )}
                    <div className="mt-3 grid grid-cols-2 gap-2">
                      <label className="text-xs font-semibold">Variable
                        <input className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-2 py-1.5 dark:border-white/10 dark:bg-slate-950" value={String(actionParameters.variable ?? "x")} onChange={(event) => setActionParameters((current) => ({ ...current, variable: event.target.value }))} />
                      </label>
                      <label className="text-xs font-semibold">Verify against
                        <input className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-2 py-1.5 dark:border-white/10 dark:bg-slate-950" value={String(actionParameters.compareWith ?? "0")} onChange={(event) => setActionParameters((current) => ({ ...current, compareWith: event.target.value }))} />
                      </label>
                      <label className="text-xs font-semibold">x minimum
                        <input type="number" min="-100" max="99" className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-2 py-1.5 dark:border-white/10 dark:bg-slate-950" value={Number(actionParameters.xMin ?? -10)} onChange={(event) => setActionParameters((current) => ({ ...current, xMin: Number(event.target.value) }))} />
                      </label>
                      <label className="text-xs font-semibold">x maximum
                        <input type="number" min="-99" max="100" className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-2 py-1.5 dark:border-white/10 dark:bg-slate-950" value={Number(actionParameters.xMax ?? 10)} onChange={(event) => setActionParameters((current) => ({ ...current, xMax: Number(event.target.value) }))} />
                      </label>
                    </div>
                  </section>
                )}
                <div className="mb-3 flex items-center justify-between">
                  <div>
                    <h2 className="font-bold">Recognition</h2>
                    <p className="text-xs text-slate-500">{mathRecognitionProvider.production ? "Production provider" : "Development adapter — mock results"}</p>
                  </div>
                  <span className={`mini-chip ${recognitionStatus === "error" ? "text-rose-600" : ""}`}>{recognitionStatus}</span>
                </div>

                {recognitionStatus === "error" && (
                  <div className="mb-3 rounded-lg bg-rose-50 p-3 text-sm text-rose-700 dark:bg-rose-500/10 dark:text-rose-200">
                    {message}
                    <button type="button" className="mt-2 tool-button" onClick={() => void recognize()}>Retry</button>
                  </div>
                )}

                {recognition && (
                  <div className="mb-3 grid grid-cols-2 gap-2 text-sm">
                    <div className="rounded-lg bg-slate-100 p-2 dark:bg-white/5"><span className="block text-xs text-slate-500">Confidence</span>{Math.round((recognition.confidence ?? 0) * 100)}%</div>
                    <div className="rounded-lg bg-slate-100 p-2 dark:bg-white/5"><span className="block text-xs text-slate-500">Structure</span>{recognition.detectedType ?? "unknown"}</div>
                  </div>
                )}

                <MathKeyboardInput value={latex} onChange={setLatex} label="Editable recognized LaTeX" mode="formula" rows={2} defaultCompact />
                <div className="mt-3 min-h-20 overflow-x-auto rounded-lg bg-slate-100 p-3 text-center dark:bg-white/5" aria-label="Rendered recognition preview">
                  {preview.valid
                    ? <div dangerouslySetInnerHTML={{ __html: preview.html }} />
                    : <p className="text-sm text-rose-600">Invalid LaTeX: {preview.error}</p>}
                </div>

                {recognition?.alternatives?.length ? (
                  <div className="mt-3">
                    <p className="text-xs font-bold uppercase text-slate-500">Alternatives</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {recognition.alternatives.map((alternative) => (
                        <button type="button" className="tool-button" key={alternative.latex} onClick={() => setLatex(alternative.latex)}>
                          {alternative.latex} {alternative.confidence ? `${Math.round(alternative.confidence * 100)}%` : ""}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : null}

                <div className="mt-3 flex flex-wrap gap-2">
                  <button type="button" className="tool-button" onClick={() => {
                    if (!recognition) return;
                    const corrected = { ...recognition, latex, id: `recognition-${Date.now()}`, createdAt: new Date().toISOString() };
                    setRecognition(corrected);
                    setRecognitionHistory((items) => [corrected, ...items].slice(0, 12));
                    setMessage("Correction applied");
                  }} disabled={!recognition || !preview.valid}><Check className="h-4 w-4" />Apply correction</button>
                  <button type="button" className="action-primary" onClick={insertExpression} disabled={!recognition || !preview.valid}><ChevronRight className="h-4 w-4" />Insert into board</button>
                </div>

                {recognition?.warnings?.map((warning) => <p key={warning} className="mt-3 text-xs text-amber-700 dark:text-amber-300">{warning}</p>)}

                <details className="mt-4">
                  <summary className="cursor-pointer text-sm font-bold">Recognition history ({recognitionHistory.length})</summary>
                  <div className="mt-2 space-y-1">
                    {recognitionHistory.map((item) => (
                      <button key={item.id} type="button" className="flex w-full items-center justify-between rounded-lg px-2 py-2 text-left text-sm hover:bg-slate-100 dark:hover:bg-white/5" onClick={() => {
                        setRecognition(item);
                        setLatex(item.latex);
                      }}>
                        <code>{item.latex}</code><span className="text-xs text-slate-500">{Math.round((item.confidence ?? 0) * 100)}%</span>
                      </button>
                    ))}
                  </div>
                </details>
              </aside>
            )}
          </div>
        </section>

        <BoardCommandPalette open={commandOpen} commands={commands} onClose={() => setCommandOpen(false)} />
        <Suspense fallback={null}>
          <BoardImageImportDialog open={imageImportOpen} onClose={() => setImageImportOpen(false)} onInsert={insertImage} />
        </Suspense>

        <SectionCard compact title="Board controls" description="P/E/V/H switch tools. Ctrl/Cmd+Z undoes, Ctrl/Cmd+Shift+Z redoes, Ctrl/Cmd+S saves, and Ctrl/Cmd+Enter recognizes the selection.">
          <div className="flex flex-wrap gap-2 text-xs text-slate-500">
            <span className="mini-chip"><Brush className="h-3.5 w-3.5" />Pressure-aware vector ink</span>
            <span className="mini-chip"><Grid3X3 className="h-3.5 w-3.5" />Board-space coordinates</span>
            <span className="mini-chip"><ScanLine className="h-3.5 w-3.5" />Explicit recognition only</span>
          </div>
        </SectionCard>
      </div>
    </MathLabLayout>
  );
}

export function renderBoardLatex(latex: string): { valid: boolean; html: string; error?: string } {
  if (!latex.trim()) return { valid: true, html: "" };
  try {
    return {
      valid: true,
      html: katex.renderToString(latex, { displayMode: true, throwOnError: true, strict: false }),
    };
  } catch (error) {
    return { valid: false, html: "", error: error instanceof Error ? error.message : "Malformed expression" };
  }
}

export function defaultBoardInkColor() {
  return globalThis.matchMedia?.("(prefers-color-scheme: dark)").matches ? "#f8fafc" : "#0f172a";
}

function actionLabel(action: BoardActionType) {
  const labels: Record<BoardActionType, string> = {
    evaluate: "Evaluate",
    simplify: "Simplify",
    factor: "Factor",
    expand: "Expand",
    solve: "Solve",
    "solve-system": "Solve system",
    "solve-inequality": "Solve inequality",
    "find-roots": "Find roots",
    differentiate: "Differentiate",
    integrate: "Integrate",
    "evaluate-limit": "Evaluate limit",
    "matrix-operation": "Matrix operation",
    "plot-2d": "Draw graph",
    "plot-implicit": "Implicit graph",
    "plot-3d": "Open in 3D",
    "table-of-values": "Table of values",
    statistics: "Statistics",
    geometry: "Geometry",
    verify: "Verify",
  };
  return labels[action];
}

function actionPlacementSlot(action: BoardActionType) {
  const slots: Record<BoardActionType, number> = {
    factor: 0,
    "find-roots": 1,
    "plot-2d": 2,
    solve: 0,
    simplify: 1,
    expand: 2,
    evaluate: 3,
    verify: 4,
    differentiate: 0,
    integrate: 1,
    "evaluate-limit": 2,
    "solve-system": 0,
    "solve-inequality": 0,
    "matrix-operation": 0,
    "plot-implicit": 1,
    "plot-3d": 1,
    "table-of-values": 1,
    statistics: 0,
    geometry: 0,
  };
  return slots[action];
}
