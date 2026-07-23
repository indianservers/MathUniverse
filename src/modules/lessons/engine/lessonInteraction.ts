import type { LessonDefinition, LessonInteractionEvent } from "../types";

export function createLessonInteractionEvent(input: Omit<LessonInteractionEvent, "timestamp">): LessonInteractionEvent {
  return { ...input, timestamp: Date.now() };
}

export function createLegacyInteractionEvent(lesson: LessonDefinition): LessonInteractionEvent {
  return createLessonInteractionEvent({
    controlId: lesson.contract.requiredControlIds[0],
    kind: lesson.contract.requiredControls[0],
    before: null,
    after: { changed: true },
    affectedOutputs: lesson.contract.observableOutputs,
  });
}

export function hasRequiredLessonEvidence(lesson: LessonDefinition, history: LessonInteractionEvent[]) {
  return lesson.contract.requiredControlIds.some((controlId) => history.some((event) => event.controlId === controlId && event.affectedOutputs.some((output) => lesson.contract.observableOutputs.includes(output))));
}

export function latestLessonEvidence(history: LessonInteractionEvent[], controlIds?: string[]) {
  const allowed = controlIds ? new Set(controlIds) : null;
  return [...history].reverse().find((event) => !allowed || allowed.has(event.controlId));
}

export function normalizeInteractionHistory(value: unknown): LessonInteractionEvent[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((item) => {
    if (!item || typeof item !== "object") return [];
    const event = item as Partial<LessonInteractionEvent>;
    if (typeof event.controlId !== "string" || typeof event.kind !== "string" || typeof event.timestamp !== "number" || !Array.isArray(event.affectedOutputs)) return [];
    return [{
      controlId: event.controlId,
      kind: event.kind as LessonInteractionEvent["kind"],
      timestamp: event.timestamp,
      before: event.before,
      after: event.after,
      affectedOutputs: event.affectedOutputs.filter((output): output is string => typeof output === "string"),
    }];
  }).slice(-40);
}

