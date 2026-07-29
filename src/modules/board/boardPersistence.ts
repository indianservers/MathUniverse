import type { BoardDocument, SerializedBoardDocument } from "./types";
import { createBoardIntelligencePersistence } from "./boardIntelligence";

export const BOARD_SCHEMA_VERSION = 1;
export const BOARD_LIBRARY_KEY = "math-universe-board-library";
export const BOARD_DRAFT_KEY = "math-universe-board-draft";

export function createBoardDocument(title = "Untitled Board"): BoardDocument {
  const now = new Date().toISOString();
  const id = `board-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  return {
    id,
    title,
    createdAt: now,
    updatedAt: now,
    viewport: { x: 0, y: 0, zoom: 1 },
    background: "grid",
    snapToGrid: false,
    elements: [],
    relationships: [],
    actionHistory: [],
    solutionSequences: [],
    tutorMessages: [],
    automaticRecognition: {
      mode: "manual",
      pauseMs: 1_500,
      minimumStrokeCount: 2,
      disabledForSession: false,
    },
    intelligence: createBoardIntelligencePersistence(id),
  };
}

export function serializeBoard(document: BoardDocument): SerializedBoardDocument {
  return { schemaVersion: BOARD_SCHEMA_VERSION, document };
}

export function migrateBoard(value: unknown): BoardDocument | null {
  if (!value || typeof value !== "object") return null;
  const serialized = value as Partial<SerializedBoardDocument>;
  const document = serialized.document;
  if (!document || !Array.isArray(document.elements)) return null;
  const viewport = document.viewport;
  return {
    ...createBoardDocument(document.title),
    ...document,
    viewport: {
      x: viewport?.x ?? 0,
      y: viewport?.y ?? 0,
      zoom: viewport?.zoom ?? 1,
    },
    background: document.background ?? "grid",
    snapToGrid: document.snapToGrid ?? false,
    relationships: Array.isArray(document.relationships) ? document.relationships : [],
    actionHistory: Array.isArray(document.actionHistory) ? document.actionHistory : [],
    solutionSequences: Array.isArray(document.solutionSequences) ? document.solutionSequences : [],
    tutorMessages: Array.isArray(document.tutorMessages) ? document.tutorMessages : [],
    automaticRecognition: {
      mode: document.automaticRecognition?.mode ?? "manual",
      pauseMs: document.automaticRecognition?.pauseMs ?? 1_500,
      minimumStrokeCount: document.automaticRecognition?.minimumStrokeCount ?? 2,
      disabledForSession: document.automaticRecognition?.disabledForSession ?? false,
      lastFingerprint: document.automaticRecognition?.lastFingerprint,
    },
    intelligence: document.intelligence ?? createBoardIntelligencePersistence(document.id),
  };
}

export function readBoardLibrary(storage: Storage = localStorage): BoardDocument[] {
  try {
    const parsed = JSON.parse(storage.getItem(BOARD_LIBRARY_KEY) ?? "[]") as unknown[];
    return Array.isArray(parsed) ? parsed.map(migrateBoard).filter((item): item is BoardDocument => Boolean(item)) : [];
  } catch {
    return [];
  }
}

export function saveBoard(document: BoardDocument, storage: Storage = localStorage): BoardDocument[] {
  const updated = { ...document, updatedAt: new Date().toISOString() };
  const next = [updated, ...readBoardLibrary(storage).filter((item) => item.id !== updated.id)].slice(0, 32);
  storage.setItem(BOARD_LIBRARY_KEY, JSON.stringify(next.map(serializeBoard)));
  return next;
}

export function deleteBoard(id: string, storage: Storage = localStorage): BoardDocument[] {
  const next = readBoardLibrary(storage).filter((item) => item.id !== id);
  storage.setItem(BOARD_LIBRARY_KEY, JSON.stringify(next.map(serializeBoard)));
  return next;
}

export function saveDraft(document: BoardDocument, storage: Storage = localStorage) {
  storage.setItem(BOARD_DRAFT_KEY, JSON.stringify(serializeBoard(document)));
}

export function recoverDraft(storage: Storage = localStorage): BoardDocument | null {
  try {
    return migrateBoard(JSON.parse(storage.getItem(BOARD_DRAFT_KEY) ?? "null"));
  } catch {
    return null;
  }
}
