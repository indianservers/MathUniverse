import { analyzeBoardExpression } from "./boardMathAnalyzer";
import type { BoardDocument, BoardElement, BoardResultElement } from "./types";
import type {
  BoardIntelligencePersistence,
  SmartBoardCapability,
  SmartBoardConfidenceLevel,
  SmartBoardContextElement,
  SmartBoardGoal,
  SmartBoardGoalType,
  SmartBoardIntelligenceContext,
  SmartBoardIntelligenceError,
  SmartBoardRecommendation,
  SmartBoardServiceAvailability,
  SmartBoardSessionMemory,
  SmartBoardSubject,
  SmartBoardToolCall,
  SmartBoardToolDefinition,
  SmartBoardToolResult,
  SmartBoardUnderstandingResult,
  SmartBoardVerificationStatus,
  SmartBoardWorkflowPlan,
  SmartBoardWorkflowStep,
} from "./boardIntelligenceTypes";

const CONTEXT_VERSION = 1;
const DEFAULT_MAX_ELEMENTS = 24;
const DEFAULT_MAX_TOKENS = 2_400;
const MAX_EXPRESSION_LENGTH = 2_000;

const defaultServices: SmartBoardServiceAvailability = {
  ai: false,
  recognition: true,
  cas: true,
  graph2d: true,
  graph3d: true,
  geometry: true,
  statistics: true,
  physicsUnits: true,
  chemistry: false,
  english: false,
  biology: false,
};

export function createBoardSessionMemory(boardId: string): SmartBoardSessionMemory {
  return {
    boardId,
    resolvedAmbiguities: {},
    completedActionIds: [],
    dismissedRecommendationIds: [],
    snoozedRecommendationIds: [],
    hiddenRecommendationCategories: [],
    shownHintLevels: {},
    selectedMethods: {},
    userPreferences: {
      intelligenceMode: "assistive",
      explanationMode: "standard",
      proactiveRecommendations: true,
      stablePauseMs: 1_200,
    },
    updatedAt: new Date().toISOString(),
  };
}

export function createBoardIntelligencePersistence(boardId: string): BoardIntelligencePersistence {
  return {
    sessionMemory: createBoardSessionMemory(boardId),
    recommendationsDisabled: false,
  };
}

export function detectPromptInjection(content: string): boolean {
  const normalized = content.toLowerCase().replace(/\s+/g, " ");
  return [
    /ignore (all |any )?(previous|prior|system) instructions/,
    /\b(reveal|show|print|expose)\b.{0,30}\b(api keys?|secrets?|credentials?|tokens?)\b/,
    /\b(delete|clear|erase)\b.{0,20}\b(board|files?|content)\b/,
    /\b(upload|share|send)\b.{0,30}\b(all|entire|full|files?|board)\b/,
    /\benable\b.{0,20}\b(hidden|admin|privileged|unrestricted) tools?\b/,
  ].some((pattern) => pattern.test(normalized));
}

export function buildBoardIntelligenceContext(input: {
  document: BoardDocument;
  selectedElementIds: string[];
  activeProblemId?: string;
  maxElements?: number;
  maxEstimatedTokens?: number;
  serviceAvailability?: Partial<SmartBoardServiceAvailability>;
}): SmartBoardIntelligenceContext {
  const startedAt = performanceNow();
  const maxElements = clamp(input.maxElements ?? DEFAULT_MAX_ELEMENTS, 1, 100);
  const maxTokens = clamp(input.maxEstimatedTokens ?? DEFAULT_MAX_TOKENS, 128, 12_000);
  const elementMap = new Map(input.document.elements.map((element) => [element.id, element]));
  const seedIds = input.selectedElementIds.filter((id) => elementMap.has(id));
  const activeProblem = input.document.intelligence.activeProblem;
  if (input.activeProblemId && activeProblem?.id === input.activeProblemId) {
    seedIds.push(...activeProblem.problemElementIds.filter((id) => elementMap.has(id)));
  }

  const includedIds = new Set(seedIds);
  for (const relationship of input.document.relationships) {
    if (includedIds.has(relationship.sourceElementId) && elementMap.has(relationship.targetElementId)) {
      includedIds.add(relationship.targetElementId);
    } else if (includedIds.has(relationship.targetElementId) && elementMap.has(relationship.sourceElementId)) {
      includedIds.add(relationship.sourceElementId);
    }
  }

  const ordered = [...includedIds]
    .map((id) => elementMap.get(id))
    .filter((element): element is BoardElement => Boolean(element))
    .sort((left, right) => left.bounds.y - right.bounds.y || left.bounds.x - right.bounds.x || left.createdAt.localeCompare(right.createdAt));

  const contextElements: SmartBoardContextElement[] = [];
  const omittedElementIds: string[] = [];
  let estimatedTokens = 0;
  for (const [order, element] of ordered.entries()) {
    const converted = contextElement(element, order);
    const elementTokens = estimateTokens(converted.content) + 20;
    if (contextElements.length >= maxElements || estimatedTokens + elementTokens > maxTokens) {
      omittedElementIds.push(element.id);
      continue;
    }
    estimatedTokens += elementTokens;
    contextElements.push(converted);
  }
  const finalIds = new Set(contextElements.map((element) => element.id));
  const relationships = input.document.relationships
    .filter((relationship) => finalIds.has(relationship.sourceElementId) && finalIds.has(relationship.targetElementId))
    .map(({ id, type, sourceElementId, targetElementId }) => ({ id, type, sourceElementId, targetElementId }));
  const detected = detectSubjects(contextElements);
  const services = { ...defaultServices, ...input.serviceAvailability };
  const availableCapabilities = resolveAvailableCapabilities(services);
  const ambiguities = extractContextAmbiguities(contextElements, input.document.intelligence.sessionMemory);

  return {
    boardId: input.document.id,
    boardSubjectMode: detected.primary ?? "unknown",
    primarySubject: detected.primary,
    supportingSubjects: detected.supporting,
    selectedElementIds: seedIds,
    activeProblemId: input.activeProblemId ?? activeProblem?.id,
    activeWorkflowId: input.document.intelligence.activeWorkflow?.id,
    currentGoal: activeProblem?.goal,
    elements: contextElements,
    relationships,
    recentActions: input.document.actionHistory.slice(-10).map(({ id, actionType, sourceElementId, resultElementId, cancelled }) => ({
      id,
      actionType,
      sourceElementId,
      resultElementId,
      cancelled,
    })),
    pendingAmbiguities: ambiguities,
    availableCapabilities,
    serviceAvailability: services,
    clientCapabilities: {
      online: typeof navigator === "undefined" ? true : navigator.onLine,
      pointer: typeof PointerEvent !== "undefined",
      touch: typeof navigator !== "undefined" && navigator.maxTouchPoints > 0,
      camera: typeof navigator !== "undefined" && Boolean(navigator.mediaDevices?.getUserMedia),
    },
    contextVersion: CONTEXT_VERSION,
    metrics: {
      elementCount: contextElements.length,
      relationshipCount: relationships.length,
      estimatedTokens,
      croppedVisualCount: 0,
      omittedElementCount: omittedElementIds.length,
      buildDurationMs: Math.max(0, performanceNow() - startedAt),
    },
    omittedElementIds,
  };
}

export function understandBoardContext(
  context: SmartBoardIntelligenceContext,
  memory: SmartBoardSessionMemory,
  command?: string,
): SmartBoardUnderstandingResult {
  const subject = context.primarySubject;
  const mathElement = context.elements.find((element) => element.type === "math-expression");
  const injectionDetected = context.elements.some((element) => detectPromptInjection(element.content));
  const goal = inferBoardGoal(context, command);
  const detectedConcepts: SmartBoardUnderstandingResult["detectedConcepts"] = [];
  const knownFacts: SmartBoardUnderstandingResult["knownFacts"] = [];
  const unknownFacts: SmartBoardUnderstandingResult["unknownFacts"] = [];
  const warnings: string[] = [];

  let recommendations: SmartBoardRecommendation[] = [];
  if (subject === "mathematics" && mathElement) {
    try {
      const analysis = analyzeBoardExpression(mathElement.content);
      const concept = mathConcept(analysis.classification, analysis.metadata?.degree);
      detectedConcepts.push({ id: concept.id, label: concept.label, confidence: "high" });
      knownFacts.push(
        { label: "Expression", value: mathElement.content, sourceElementId: mathElement.id },
        { label: "Structure", value: analysis.classification, sourceElementId: mathElement.id },
      );
      if (analysis.variables.length) knownFacts.push({ label: "Variables", value: analysis.variables.join(", "), sourceElementId: mathElement.id });
      if (analysis.classification === "equation" && !analysis.variables.length) {
        unknownFacts.push({ label: "Target variable", reason: "No variable could be identified." });
      }
      recommendations = mathematicsRecommendations(context, memory, analysis, mathElement.id, goal);
    } catch (error) {
      warnings.push(error instanceof Error ? error.message : "The selected expression could not be analyzed.");
      unknownFacts.push({ label: "Expression structure", reason: "Confirm the expression before running an engine." });
    }
  } else if (subject && subject !== "unknown") {
    const subjectResult = unsupportedSubjectUnderstanding(subject, context, goal);
    detectedConcepts.push(...subjectResult.concepts);
    knownFacts.push(...subjectResult.knownFacts);
    unknownFacts.push(...subjectResult.unknownFacts);
    recommendations = subjectResult.recommendations;
    warnings.push(...subjectResult.warnings);
  } else {
    unknownFacts.push({ label: "Active subject", reason: "Select a confirmed expression, text, or image region." });
  }

  if (injectionDetected) {
    warnings.unshift("Untrusted content contains instruction-like text. Tool permissions remain unchanged.");
  }
  const activeProblem = context.elements.length && subject && subject !== "unknown"
    ? {
      id: memory.activeProblemId ?? `problem-${context.boardId}-${context.elements[0].id}`,
      primarySubject: subject,
      supportingSubjects: context.supportingSubjects,
      problemElementIds: context.elements.map((element) => element.id),
      goal,
      knownFacts,
      unknownFacts,
      attemptedStepIds: context.recentActions.map((action) => action.resultElementId),
      verifiedStepIds: [],
      currentStage: context.pendingAmbiguities.some((ambiguity) => ambiguity.requiresResolution) ? "blocked" as const : "understanding" as const,
      assumptions: [],
      warnings,
      completionStatus: context.pendingAmbiguities.some((ambiguity) => ambiguity.requiresResolution) ? "blocked" as const : "in-progress" as const,
    }
    : undefined;

  return {
    primarySubject: subject,
    supportingSubjects: context.supportingSubjects,
    subjectConfidence: subjectConfidence(context),
    detectedConcepts,
    activeProblem,
    inferredGoal: goal,
    knownFacts,
    unknownFacts,
    ambiguities: context.pendingAmbiguities,
    recommendations,
    warnings,
    contextMetrics: context.metrics,
    intelligenceMode: intelligenceAvailability(context.serviceAvailability),
  };
}

export function inferBoardGoal(context: SmartBoardIntelligenceContext, command?: string): SmartBoardGoal {
  const normalized = command?.trim().toLowerCase() ?? "";
  let type: SmartBoardGoalType = "understand";
  const evidence: SmartBoardGoal["evidence"] = [];
  if (normalized) {
    type = commandGoal(normalized);
    evidence.push({ source: "command", detail: `Explicit request classified as ${type}.` });
  } else if (context.elements.some((element) => element.type === "math-expression")) {
    type = "understand";
    evidence.push({ source: "selection", detail: "A mathematical expression is selected." });
  }
  return {
    type,
    primarySubject: context.primarySubject,
    supportingSubjects: context.supportingSubjects,
    targetElementIds: context.elements.map((element) => element.id),
    confidence: normalized ? "high" : context.elements.length === 1 ? "review-recommended" : "needs-confirmation",
    evidence,
    missingInformation: context.elements.length ? [] : [{ field: "selection", reason: "No active Board element is selected." }],
    userConfirmed: Boolean(normalized),
  };
}

export function planBoardWorkflow(input: {
  context: SmartBoardIntelligenceContext;
  command: string;
  goal?: SmartBoardGoal;
}): SmartBoardWorkflowPlan {
  const goal = input.goal ?? inferBoardGoal(input.context, input.command);
  const sourceIds = input.context.elements.map((element) => element.id);
  const subject = input.context.primarySubject ?? "unknown";
  const normalized = input.command.toLowerCase();
  const steps: SmartBoardWorkflowStep[] = [];
  const add = (
    type: SmartBoardWorkflowStep["type"],
    title: string,
    options: Partial<SmartBoardWorkflowStep> = {},
  ) => {
    const id = `step-${steps.length + 1}`;
    steps.push({
      id,
      order: steps.length + 1,
      type,
      title,
      inputElementIds: sourceIds,
      dependsOnStepIds: steps.length ? [steps[steps.length - 1].id] : [],
      status: "pending",
      requiresConfirmation: options.permissionClass === "sensitive",
      permissionClass: "read-only",
      canRetry: true,
      canSkip: type === "explain" || type === "visualize",
      ...options,
    });
  };

  add("confirm", "Confirm selected expression", { toolId: "board.inspect-selection", canSkip: false });
  if (subject === "mathematics") {
    const math = input.context.elements.find((element) => element.type === "math-expression");
    let quadratic = false;
    if (math) {
      try {
        quadratic = analyzeBoardExpression(math.content).metadata?.degree === 2;
      } catch {
        quadratic = false;
      }
    }
    if (quadratic && (normalized.includes("solve") || normalized.includes("factor") || normalized.includes("root"))) {
      add("calculate", "Factor the quadratic", { toolId: "math.factor", boardActionType: "factor", permissionClass: "reversible-write" });
      add("calculate", "Find the roots", { toolId: "math.find-roots", boardActionType: "find-roots", permissionClass: "reversible-write" });
      add("verify", "Verify the roots", { toolId: "math.verify" });
    } else if (normalized.includes("solve")) {
      add("calculate", "Solve with the existing CAS", { toolId: "math.solve", boardActionType: "solve", permissionClass: "reversible-write" });
      add("verify", "Verify the result", { toolId: "math.verify" });
    } else if (normalized.includes("simplif")) {
      add("calculate", "Simplify with the existing CAS", { toolId: "math.simplify", boardActionType: "simplify", permissionClass: "reversible-write" });
    }
    if (normalized.includes("graph") || normalized.includes("plot") || goal.type === "graph") {
      add("visualize", "Plot with the existing 2D graph engine", { toolId: "math.plot-2d", boardActionType: "plot-2d", permissionClass: "reversible-write" });
    }
  } else if (subject === "physics" && normalized.includes("unit")) {
    add("open-module", "Open the existing unit converter", { toolId: "physics.open-unit-converter" });
  } else {
    add("analyze", `Review ${subject} capability availability`, { toolId: "board.inspect-problem" });
  }

  if (steps.length === 1) {
    add("analyze", "Understand the selected content", { toolId: "board.inspect-problem" });
  }
  const capabilities = steps.map((step) => toolCapability(step.toolId)).filter((item): item is SmartBoardCapability => Boolean(item));
  return {
    id: `workflow-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    title: workflowTitle(goal, normalized),
    goal,
    primarySubject: subject,
    supportingSubjects: input.context.supportingSubjects,
    steps,
    requiresUserApproval: true,
    requiredCapabilities: [...new Set(capabilities)],
    warnings: subject === "unknown" ? ["Subject confirmation is required before engine execution."] : [],
    createdAt: new Date().toISOString(),
    status: "draft",
  };
}

export function approveSafeWorkflowSteps(plan: SmartBoardWorkflowPlan): SmartBoardWorkflowPlan {
  return {
    ...plan,
    status: "approved",
    steps: plan.steps.map((step) => step.permissionClass === "sensitive" ? step : { ...step, status: step.status === "pending" ? "approved" : step.status }),
  };
}

export function updateWorkflowStep(
  plan: SmartBoardWorkflowPlan,
  stepId: string,
  patch: Partial<SmartBoardWorkflowStep>,
): SmartBoardWorkflowPlan {
  const steps = plan.steps.map((step) => step.id === stepId ? { ...step, ...patch } : step);
  const status = steps.every((step) => step.status === "success" || step.status === "skipped")
    ? "completed"
    : steps.some((step) => step.status === "failed")
      ? "failed"
      : steps.some((step) => step.status === "running")
        ? "running"
        : plan.status;
  return { ...plan, steps, status };
}

export function cancelBoardWorkflow(plan: SmartBoardWorkflowPlan): SmartBoardWorkflowPlan {
  return {
    ...plan,
    status: "cancelled",
    steps: plan.steps.map((step) => step.status === "success" || step.status === "skipped" ? step : { ...step, status: "cancelled" }),
  };
}

export function resolveBoardAmbiguity(
  persistence: BoardIntelligencePersistence,
  ambiguityId: string,
  value: unknown,
): BoardIntelligencePersistence {
  return {
    ...persistence,
    sessionMemory: {
      ...persistence.sessionMemory,
      resolvedAmbiguities: { ...persistence.sessionMemory.resolvedAmbiguities, [ambiguityId]: value },
      updatedAt: new Date().toISOString(),
    },
  };
}

export function dismissBoardRecommendation(
  persistence: BoardIntelligencePersistence,
  recommendationId: string,
  mode: "dismiss" | "snooze" | "hide-similar",
  category?: string,
): BoardIntelligencePersistence {
  const session = persistence.sessionMemory;
  return {
    ...persistence,
    sessionMemory: {
      ...session,
      dismissedRecommendationIds: mode === "dismiss"
        ? unique([...session.dismissedRecommendationIds, recommendationId])
        : session.dismissedRecommendationIds,
      snoozedRecommendationIds: mode === "snooze"
        ? unique([...session.snoozedRecommendationIds, recommendationId])
        : session.snoozedRecommendationIds,
      hiddenRecommendationCategories: mode === "hide-similar" && category
        ? unique([...session.hiddenRecommendationCategories, category])
        : session.hiddenRecommendationCategories,
      updatedAt: new Date().toISOString(),
    },
  };
}

export function markBoardActionCompleted(
  persistence: BoardIntelligencePersistence,
  actionId: string,
): BoardIntelligencePersistence {
  return {
    ...persistence,
    sessionMemory: {
      ...persistence.sessionMemory,
      completedActionIds: unique([...persistence.sessionMemory.completedActionIds, actionId]),
      updatedAt: new Date().toISOString(),
    },
  };
}

export function verifyBoardResult(result: BoardResultElement): {
  status: SmartBoardVerificationStatus;
  label: string;
} {
  if (result.status === "error" || result.status === "cancelled") return { status: "failed", label: "Verification failed" };
  if (result.status !== "success") return { status: "inconclusive", label: "Verification pending" };
  if (result.actionType === "verify") return { status: "verified", label: "Verified by symbolic engine" };
  if (result.actionType === "plot-2d" || result.actionType === "table-of-values") {
    return result.graph?.series?.length
      ? { status: "numerically-verified", label: "Numerically sampled by graph engine" }
      : { status: "partially-verified", label: "Graph configuration validated" };
  }
  if (result.engine.adapter === "cas") return { status: "verified-with-conditions", label: "Computed by existing CAS" };
  return { status: "partially-verified", label: `Produced by ${result.engine.underlyingEngine ?? result.engine.adapter}` };
}

type ToolExecutor = (call: SmartBoardToolCall, signal?: AbortSignal) => Promise<unknown>;

export class BoardToolRegistry {
  private readonly definitions = new Map<string, SmartBoardToolDefinition>();
  private readonly executors = new Map<string, ToolExecutor>();

  constructor(definitions: SmartBoardToolDefinition[] = createBoardToolDefinitions()) {
    definitions.forEach((definition) => this.register(definition));
  }

  register(definition: SmartBoardToolDefinition, executor?: ToolExecutor) {
    if (this.definitions.has(definition.id)) throw new Error(`Duplicate Board tool: ${definition.id}`);
    this.definitions.set(definition.id, definition);
    if (executor) this.executors.set(definition.id, executor);
  }

  setExecutor(toolId: string, executor: ToolExecutor) {
    if (!this.definitions.has(toolId)) throw new Error(`Unknown Board tool: ${toolId}`);
    this.executors.set(toolId, executor);
  }

  listTools(context: SmartBoardIntelligenceContext) {
    return [...this.definitions.values()].filter((definition) => (
      (!definition.subject || definition.subject === context.primarySubject)
      && (context.clientCapabilities.online || definition.availableOffline)
    ));
  }

  async execute(
    call: SmartBoardToolCall,
    context: SmartBoardIntelligenceContext,
    signal?: AbortSignal,
  ): Promise<SmartBoardToolResult> {
    if (signal?.aborted) return failure(call.id, "CANCELLED", "The workflow step was cancelled.");
    const definition = this.definitions.get(call.toolId);
    if (!definition) return failure(call.id, "INVALID_TOOL_CALL", "This tool is not allowlisted.");
    if (!this.listTools(context).some((tool) => tool.id === definition.id)) {
      return failure(call.id, "CAPABILITY_UNAVAILABLE", "This tool is unavailable for the active subject or offline mode.");
    }
    if ((definition.requiresUserConfirmation || definition.permissionClass === "sensitive") && !call.userConfirmed) {
      return failure(call.id, "TOOL_PERMISSION_DENIED", "Confirm this action before it can run.");
    }
    if (call.sourceElementIds.some((id) => !context.elements.some((element) => element.id === id))) {
      return failure(call.id, "INVALID_TOOL_CALL", "The tool call attempted to access content outside the selected context.");
    }
    const validationError = validateToolArguments(definition, call.arguments);
    if (validationError) return failure(call.id, "INVALID_TOOL_CALL", validationError);
    const serializedArguments = JSON.stringify(call.arguments);
    if (detectPromptInjection(serializedArguments)) {
      return failure(call.id, "PROMPT_INJECTION_DETECTED", "Instruction-like Board content cannot change tool permissions.");
    }
    const executor = this.executors.get(definition.id);
    if (!executor) return failure(call.id, "CAPABILITY_UNAVAILABLE", "The selected capability has no executable adapter.");
    try {
      const output = await executor(call, signal);
      return { callId: call.id, status: "success", output };
    } catch (error) {
      if (signal?.aborted || (error as Error).name === "AbortError") return failure(call.id, "CANCELLED", "The workflow step was cancelled.");
      return failure(call.id, "UNKNOWN", error instanceof Error ? error.message : "The tool could not complete.");
    }
  }
}

export function createBoardToolDefinitions(): SmartBoardToolDefinition[] {
  const readOnly = (
    id: string,
    capability: SmartBoardCapability,
    description: string,
    subject?: SmartBoardSubject,
  ): SmartBoardToolDefinition => ({
    id,
    subject,
    capability,
    description,
    inputSchema: { required: ["sourceElementIds"], maxExpressionLength: MAX_EXPRESSION_LENGTH },
    outputSchema: { type: "object" },
    permissionClass: "read-only",
    requiresUserConfirmation: false,
    availableOffline: true,
  });
  const mathWrite = (id: string, capability: SmartBoardCapability, description: string): SmartBoardToolDefinition => ({
    ...readOnly(id, capability, description, "mathematics"),
    permissionClass: "reversible-write",
  });
  return [
    readOnly("board.inspect-selection", "inspect-selection", "Inspect only the selected Board elements."),
    readOnly("board.inspect-problem", "inspect-problem", "Inspect the active problem."),
    readOnly("board.inspect-relationships", "inspect-relationships", "Inspect selected source-result relationships."),
    mathWrite("math.solve", "solve", "Solve with the existing CAS."),
    mathWrite("math.simplify", "simplify", "Simplify with the existing CAS."),
    mathWrite("math.factor", "factor", "Factor with the existing CAS."),
    mathWrite("math.find-roots", "find-roots", "Find roots with the existing CAS."),
    mathWrite("math.verify", "verify", "Verify through the existing symbolic engine."),
    mathWrite("math.plot-2d", "plot-2d", "Plot through the existing 2D graph engine."),
    readOnly("physics.open-unit-converter", "open-unit-converter", "Open the existing unit-converter workspace.", "physics"),
  ];
}

export class BoardIntelligenceOrchestrator {
  understand(input: {
    document: BoardDocument;
    selectedElementIds: string[];
    command?: string;
    serviceAvailability?: Partial<SmartBoardServiceAvailability>;
  }, signal?: AbortSignal): Promise<SmartBoardUnderstandingResult> {
    if (signal?.aborted) return Promise.reject(new DOMException("Cancelled", "AbortError"));
    const context = buildBoardIntelligenceContext(input);
    return Promise.resolve(understandBoardContext(context, input.document.intelligence.sessionMemory, input.command));
  }

  recommendActions(context: SmartBoardIntelligenceContext, memory: SmartBoardSessionMemory, signal?: AbortSignal) {
    if (signal?.aborted) return Promise.reject(new DOMException("Cancelled", "AbortError"));
    return Promise.resolve(understandBoardContext(context, memory).recommendations);
  }

  planWorkflow(input: { context: SmartBoardIntelligenceContext; command: string; goal?: SmartBoardGoal }, signal?: AbortSignal) {
    if (signal?.aborted) return Promise.reject(new DOMException("Cancelled", "AbortError"));
    return Promise.resolve(planBoardWorkflow(input));
  }
}

export const boardIntelligenceOrchestrator = new BoardIntelligenceOrchestrator();

function contextElement(element: BoardElement, order: number): SmartBoardContextElement {
  if (element.type === "math-expression") {
    return {
      id: element.id,
      type: element.type,
      content: element.latex.slice(0, MAX_EXPRESSION_LENGTH),
      subject: "mathematics",
      order,
      recognitionConfidence: element.recognitionConfidence,
      recognitionStatus: element.recognitionConfidence === undefined ? "confirmed" : "recognized",
      sourceElementIds: element.sourceStrokeIds,
      untrusted: true,
    };
  }
  if (element.type === "math-result") {
    return {
      id: element.id,
      type: element.type,
      content: (element.exactOutputLatex ?? element.plainTextOutput ?? element.title).slice(0, MAX_EXPRESSION_LENGTH),
      subject: "mathematics",
      order,
      verificationStatus: verifyBoardResult(element).status,
      sourceElementIds: element.sourceElementIds,
      untrusted: true,
    };
  }
  if (element.type === "text") {
    return { id: element.id, type: element.type, content: element.text.slice(0, MAX_EXPRESSION_LENGTH), subject: detectTextSubject(element.text), order, sourceElementIds: [], untrusted: true };
  }
  if (element.type === "image") {
    const regionTypes = element.recognitionRegions.map((region) => region.regionType).join(", ");
    return {
      id: element.id,
      type: element.type,
      content: `Local ${element.source} image; regions: ${regionTypes || "unreviewed"}`,
      subject: detectImageSubject(element),
      order,
      recognitionStatus: element.recognitionRegions.some((region) => region.recognitionStatus === "success") ? "recognized" : "unrecognized",
      sourceElementIds: [],
      untrusted: true,
    };
  }
  if (element.type === "solution-step") {
    return {
      id: element.id,
      type: element.type,
      content: element.latex.slice(0, MAX_EXPRESSION_LENGTH),
      subject: "mathematics",
      order,
      recognitionConfidence: element.recognitionConfidence,
      verificationStatus: element.verificationStatus,
      sourceElementIds: element.sourceStrokeIds,
      untrusted: true,
    };
  }
  if (element.type === "explanation") {
    return { id: element.id, type: element.type, content: element.text.slice(0, MAX_EXPRESSION_LENGTH), subject: "mathematics", order, verificationStatus: element.verified ? "verified" : "ai-only", sourceElementIds: element.sourceElementIds, untrusted: true };
  }
  return { id: element.id, type: element.type, content: element.type === "shape" ? element.shape : "Unrecognized handwriting stroke", subject: "unknown", order, sourceElementIds: [], untrusted: true };
}

function detectSubjects(elements: SmartBoardContextElement[]) {
  const subjects = unique(elements.map((element) => element.subject).filter((subject) => subject !== "unknown"));
  if (!subjects.length) return { primary: undefined, supporting: [] as SmartBoardSubject[] };
  const nonEnglish = subjects.filter((subject) => subject !== "english");
  const primary = nonEnglish[0] ?? subjects[0];
  return { primary, supporting: subjects.filter((subject) => subject !== primary) };
}

function detectTextSubject(text: string): SmartBoardSubject {
  const lower = text.toLowerCase();
  if (/\b(velocity|acceleration|force|mass|newton|joule|voltage|current|m\/s|kinematic)\b/.test(lower)) return "physics";
  if (/(→|->|\b(mole|molar|reaction|compound|oxidation|acid|alkali)\b)/.test(lower)) return "chemistry";
  if (/\b(cell|organelle|mitosis|meiosis|gene|allele|taxonomy|photosynthesis)\b/.test(lower)) return "biology";
  if (/[.!?]/.test(text) || /\b(sentence|paragraph|grammar|verb|noun|adjective)\b/.test(lower)) return "english";
  return "unknown";
}

function detectImageSubject(element: Extract<BoardElement, { type: "image" }>): SmartBoardSubject {
  const content = element.recognitionRegions.map((region) => `${region.regionType} ${region.recognizedText ?? ""}`).join(" ");
  return detectTextSubject(content);
}

function extractContextAmbiguities(elements: SmartBoardContextElement[], memory: SmartBoardSessionMemory) {
  const ambiguities = [];
  for (const element of elements) {
    if (element.recognitionConfidence !== undefined && element.recognitionConfidence < 0.75) {
      const id = `recognition:${element.id}`;
      if (!(id in memory.resolvedAmbiguities)) {
        ambiguities.push({
          id,
          subject: element.subject,
          type: "text-recognition" as const,
          description: "Recognition confidence is low. Confirm this content before calculation.",
          candidates: [{ label: "Use current reading", value: element.content }, { label: "Review recognition", value: "review" }],
          requiresResolution: true,
          sourceElementIds: [element.id],
          resolvedByUser: false,
        });
      }
    }
  }
  return ambiguities;
}

function mathematicsRecommendations(
  context: SmartBoardIntelligenceContext,
  memory: SmartBoardSessionMemory,
  analysis: ReturnType<typeof analyzeBoardExpression>,
  sourceId: string,
  goal: SmartBoardGoal,
) {
  const preferred = analysis.suggestedActions.filter((action) => action.enabled);
  const actionSet = new Set(preferred.map((action) => action.type));
  if (analysis.metadata?.degree === 2) {
    actionSet.add("factor");
    actionSet.add("find-roots");
    actionSet.add("plot-2d");
  }
  if (analysis.classification === "equation") {
    actionSet.add("solve");
    actionSet.add("verify");
  }
  return [...actionSet]
    .map((action, index): SmartBoardRecommendation => {
      const meta = recommendationMeta(action, analysis.classification, analysis.metadata?.degree);
      const id = `recommendation:${sourceId}:${action}`;
      const engineAvailable = capabilityAvailable(action, context.serviceAvailability);
      const duplicate = memory.completedActionIds.includes(id);
      const ambiguity = context.pendingAmbiguities.some((item) => item.requiresResolution);
      const score = {
        goalMatch: goalMatchesAction(goal.type, action) ? 30 : 10,
        subjectMatch: 20,
        conceptMatch: meta.conceptMatch,
        prerequisiteFit: ambiguity ? 0 : 10,
        learningValue: meta.learningValue,
        engineAvailability: engineAvailable ? 10 : -50,
        duplicatePenalty: duplicate ? -100 : 0,
        ambiguityPenalty: ambiguity ? -35 : 0,
        userPreferenceFit: memory.userPreferences.intelligenceMode === "exploration" && action.includes("plot") ? 10 : 0,
        total: 0,
      };
      score.total = Object.values(score).reduce((total, value) => total + value, 0);
      return {
        id,
        action,
        boardActionType: action,
        category: meta.category,
        title: meta.title,
        reason: meta.reason,
        subject: "mathematics",
        priority: score.total || 100 - index,
        confidence: ambiguity ? "needs-confirmation" : "high",
        score,
        sourceElementIds: [sourceId],
        requiredConfirmation: false,
        expectedOutcome: meta.outcome,
        engine: { id: meta.engine, label: meta.engineLabel, localOrRemote: "local" },
        enabled: engineAvailable && !ambiguity,
        disabledReason: !engineAvailable ? `${meta.engineLabel} is unavailable.` : ambiguity ? "Confirm ambiguous recognition first." : undefined,
      };
    })
    .filter((item) => (
      !memory.dismissedRecommendationIds.includes(item.id)
      && !memory.snoozedRecommendationIds.includes(item.id)
      && !memory.hiddenRecommendationCategories.includes(item.category)
      && !memory.completedActionIds.includes(item.id)
    ))
    .sort((left, right) => right.score.total - left.score.total)
    .slice(0, 8);
}

function unsupportedSubjectUnderstanding(
  subject: SmartBoardSubject,
  context: SmartBoardIntelligenceContext,
  goal: SmartBoardGoal,
) {
  const sourceIds = context.elements.map((element) => element.id);
  const concepts = [{ id: `${subject}-content`, label: `${capitalize(subject)} content`, confidence: "review-recommended" as const }];
  const knownFacts = [{ label: "Detected subject", value: capitalize(subject), sourceElementId: sourceIds[0] }];
  const unknownFacts = [{ label: "Verified subject operation", reason: `No reusable ${capitalize(subject)} Board engine is registered.` }];
  const warnings = [`${capitalize(subject)} understanding is limited to local classification; no results are fabricated.`];
  const disabled = (
    action: SmartBoardCapability,
    title: string,
    reason: string,
    category: SmartBoardRecommendation["category"],
  ): SmartBoardRecommendation => ({
    id: `recommendation:${sourceIds[0] ?? "selection"}:${action}`,
    action,
    category,
    title,
    reason,
    subject,
    priority: 0,
    confidence: "review-recommended",
    score: { goalMatch: goal.type === action ? 30 : 0, subjectMatch: 20, conceptMatch: 10, prerequisiteFit: 0, learningValue: 5, engineAvailability: -50, duplicatePenalty: 0, ambiguityPenalty: 0, userPreferenceFit: 0, total: -15 },
    sourceElementIds: sourceIds,
    requiredConfirmation: false,
    enabled: false,
    disabledReason: `No verified ${capitalize(subject)} engine is exposed to Smart Board.`,
  });
  const recommendations: SmartBoardRecommendation[] = [];
  if (subject === "physics") {
    recommendations.push({
      ...disabled("open-unit-converter", "Open unit converter", "An existing unit workspace can help review conversions.", "convert"),
      enabled: context.serviceAvailability.physicsUnits,
      disabledReason: context.serviceAvailability.physicsUnits ? undefined : "The unit-converter workspace is unavailable.",
      engine: { id: "unit-converter", label: "Existing Unit Converter", localOrRemote: "local" },
      priority: 45,
      score: { goalMatch: 20, subjectMatch: 20, conceptMatch: 10, prerequisiteFit: 5, learningValue: 5, engineAvailability: 10, duplicatePenalty: 0, ambiguityPenalty: 0, userPreferenceFit: 0, total: 70 },
    });
  } else if (subject === "chemistry") {
    recommendations.push(disabled("balance-equation", "Check equation balance", "Balancing requires a verified Chemistry engine.", "verify"));
  } else if (subject === "english") {
    recommendations.push(disabled("check-grammar", "Check grammar", "Confirmed text requires an objective language engine.", "correct"));
  } else if (subject === "biology") {
    recommendations.push(disabled("review-labels", "Review labels", "Label validation requires model reference data.", "verify"));
  }
  return { concepts, knownFacts, unknownFacts, recommendations, warnings };
}

function recommendationMeta(action: SmartBoardCapability, classification: string, degree?: number) {
  const quadratic = degree === 2;
  const data: Record<string, {
    title: string;
    reason: string;
    outcome: string;
    engine: string;
    engineLabel: string;
    category: SmartBoardRecommendation["category"];
    conceptMatch: number;
    learningValue: number;
  }> = {
    factor: { title: "Factor", reason: quadratic ? "Factor is suggested because the selection is a quadratic polynomial." : "Factoring can expose the expression's multiplicative structure.", outcome: "A linked factorized result", engine: "cas", engineLabel: "Existing CAS", category: "solve", conceptMatch: quadratic ? 25 : 14, learningValue: 14 },
    "find-roots": { title: "Find roots", reason: quadratic ? "Roots are useful because this is a quadratic expression." : "Finding roots locates where the expression equals zero.", outcome: "Linked roots from the CAS", engine: "cas", engineLabel: "Existing CAS", category: "solve", conceptMatch: quadratic ? 25 : 15, learningValue: 15 },
    solve: { title: "Solve", reason: "Solve is suggested because the selection is an equation.", outcome: "A linked CAS solution", engine: "cas", engineLabel: "Existing CAS", category: "solve", conceptMatch: classification === "equation" ? 25 : 12, learningValue: 12 },
    verify: { title: "Verify", reason: "Verification checks the result with the existing symbolic engine.", outcome: "A visible verification status", engine: "verification", engineLabel: "Symbolic verifier", category: "verify", conceptMatch: 18, learningValue: 14 },
    "plot-2d": { title: "Graph", reason: "Graphing may help because the selection defines or implies a function.", outcome: "A linked interactive 2D graph", engine: "graph-2d", engineLabel: "Existing 2D graph engine", category: "visualize", conceptMatch: 18, learningValue: 18 },
    simplify: { title: "Simplify", reason: "Simplifying can expose an equivalent, easier-to-read form.", outcome: "A linked simplified result", engine: "cas", engineLabel: "Existing CAS", category: "continue", conceptMatch: 14, learningValue: 10 },
    expand: { title: "Expand", reason: "Expanding can expose coefficients and like terms.", outcome: "A linked expanded result", engine: "cas", engineLabel: "Existing CAS", category: "explore", conceptMatch: 10, learningValue: 8 },
    differentiate: { title: "Differentiate", reason: "The selected calculus content can be processed by the existing CAS.", outcome: "A linked derivative", engine: "cas", engineLabel: "Existing CAS", category: "solve", conceptMatch: classification === "derivative" ? 25 : 10, learningValue: 13 },
    integrate: { title: "Integrate", reason: "The selected calculus content can be processed by the existing CAS.", outcome: "A linked antiderivative", engine: "cas", engineLabel: "Existing CAS", category: "solve", conceptMatch: classification === "integral" ? 25 : 10, learningValue: 13 },
    statistics: { title: "Analyze data", reason: "The selection is structured as numerical data.", outcome: "A linked statistical summary", engine: "statistics", engineLabel: "Existing statistics engine", category: "explore", conceptMatch: 24, learningValue: 15 },
  };
  return data[action] ?? { title: capitalize(action), reason: "This action matches the selected mathematical structure.", outcome: "A linked Board result", engine: "cas", engineLabel: "Existing engine", category: "explore" as const, conceptMatch: 10, learningValue: 8 };
}

function mathConcept(classification: string, degree?: number) {
  if (classification === "equation" && degree === 2) return { id: "quadratic-equation", label: "Quadratic equation" };
  const label = classification.split("-").map(capitalize).join(" ");
  return { id: classification, label };
}

function subjectConfidence(context: SmartBoardIntelligenceContext): SmartBoardConfidenceLevel {
  if (!context.primarySubject) return "unresolved";
  if (context.supportingSubjects.length > 1) return "needs-confirmation";
  if (context.elements.every((element) => element.subject === context.primarySubject || element.subject === "unknown")) return "high";
  return "review-recommended";
}

function intelligenceAvailability(services: SmartBoardServiceAvailability) {
  if (services.ai && services.recognition && services.cas && services.graph2d) return "full" as const;
  if (!services.recognition && !services.cas) return "basic" as const;
  if (services.cas && services.graph2d) return "deterministic" as const;
  return "partial" as const;
}

function resolveAvailableCapabilities(services: SmartBoardServiceAvailability): SmartBoardCapability[] {
  const capabilities: SmartBoardCapability[] = ["inspect-selection", "inspect-problem", "inspect-relationships", "request-clarification"];
  if (services.cas) capabilities.push("evaluate", "simplify", "factor", "expand", "solve", "solve-system", "solve-inequality", "find-roots", "differentiate", "integrate", "evaluate-limit", "matrix-operation", "verify");
  if (services.graph2d) capabilities.push("plot-2d", "plot-implicit", "table-of-values");
  if (services.graph3d) capabilities.push("plot-3d");
  if (services.geometry) capabilities.push("geometry");
  if (services.statistics) capabilities.push("statistics");
  if (services.physicsUnits) capabilities.push("open-unit-converter");
  if (services.chemistry) capabilities.push("balance-equation");
  if (services.english) capabilities.push("check-grammar");
  if (services.biology) capabilities.push("review-labels");
  return capabilities;
}

function capabilityAvailable(capability: SmartBoardCapability, services: SmartBoardServiceAvailability) {
  if (["plot-2d", "plot-implicit", "table-of-values"].includes(capability)) return services.graph2d;
  if (capability === "plot-3d") return services.graph3d;
  if (capability === "geometry") return services.geometry;
  if (capability === "statistics") return services.statistics;
  return services.cas;
}

function commandGoal(command: string): SmartBoardGoalType {
  if (/\bsolve\b/.test(command)) return "solve";
  if (/\b(graph|plot|visuali[sz]e)\b/.test(command)) return "graph";
  if (/\bverify|check (my |this )?(answer|work)\b/.test(command)) return "verify";
  if (/\bsimplif/.test(command)) return "simplify";
  if (/\bexplain|why\b/.test(command)) return "explain";
  if (/\bhint\b/.test(command)) return "learn";
  if (/\bconvert\b.*\bunit|\bsi units?\b/.test(command)) return "convert-units";
  if (/\bbalance\b.*\bequation\b/.test(command)) return "balance-equation";
  if (/\bgrammar|check (this )?(sentence|paragraph)\b/.test(command)) return "check-grammar";
  if (/\breview\b.*\blabel/.test(command)) return "review-labels";
  if (/\bpractice|similar (question|problem)\b/.test(command)) return "practice";
  if (/\bcontinue|complete\b/.test(command)) return "complete-work";
  return "understand";
}

function goalMatchesAction(goal: SmartBoardGoalType, action: SmartBoardCapability) {
  return goal === action
    || (goal === "graph" && action.includes("plot"))
    || (goal === "solve" && ["solve", "factor", "find-roots"].includes(action))
    || (goal === "verify" && action === "verify");
}

function workflowTitle(goal: SmartBoardGoal, command: string) {
  if (command.includes("solve") && (command.includes("graph") || command.includes("plot"))) return "Solve and graph selection";
  if (goal.type === "solve") return "Solve selection";
  if (goal.type === "graph") return "Graph selection";
  return "Understand selection";
}

function toolCapability(toolId?: string): SmartBoardCapability | undefined {
  if (!toolId) return undefined;
  return createBoardToolDefinitions().find((tool) => tool.id === toolId)?.capability;
}

function validateToolArguments(definition: SmartBoardToolDefinition, args: Record<string, unknown>) {
  for (const required of definition.inputSchema.required) {
    if (!(required in args)) return `Missing required tool input: ${required}.`;
  }
  const expression = args.expression;
  if (typeof expression === "string" && expression.length > (definition.inputSchema.maxExpressionLength ?? MAX_EXPRESSION_LENGTH)) {
    return "The expression exceeds the allowed length.";
  }
  const numericValues = Object.values(args).filter((value): value is number => typeof value === "number");
  if (numericValues.some((value) => !Number.isFinite(value) || Math.abs(value) > 1_000_000_000)) {
    return "A numeric input is outside the supported range.";
  }
  return undefined;
}

function failure(callId: string, code: SmartBoardIntelligenceError["code"], userMessage: string): SmartBoardToolResult {
  return {
    callId,
    status: code === "CANCELLED" ? "cancelled" : code === "CAPABILITY_UNAVAILABLE" ? "unsupported" : "failed",
    error: {
      code,
      userMessage,
      recoverable: !["PROMPT_INJECTION_DETECTED", "TOOL_PERMISSION_DENIED"].includes(code),
      retryable: ["AI_TIMEOUT", "ENGINE_UNAVAILABLE", "UNKNOWN"].includes(code),
    },
  };
}

function estimateTokens(value: string) {
  return Math.max(1, Math.ceil(value.length / 4));
}

function clamp(value: number, minimum: number, maximum: number) {
  return Math.min(maximum, Math.max(minimum, value));
}

function performanceNow() {
  return typeof performance === "undefined" ? Date.now() : performance.now();
}

function unique<T>(items: T[]) {
  return [...new Set(items)];
}

function capitalize(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1).replaceAll("-", " ");
}
