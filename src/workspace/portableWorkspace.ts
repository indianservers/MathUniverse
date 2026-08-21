export const PORTABLE_FILE_MAGIC = "MATHAPP_PORTABLE_FILE" as const;
export const PORTABLE_SCHEMA_VERSION = 1 as const;
export const PORTABLE_APP_VERSION = "1.0.1";
export const WORKSPACE_MIME = "application/vnd.mathapp.workspace";
export const LESSON_MIME = "application/vnd.mathapp.lesson";
export const WORKSPACE_EXTENSION = ".mathworkspace";
export const LESSON_EXTENSION = ".mathlesson";
export const MAX_PORTABLE_FILE_BYTES = 25 * 1024 * 1024;
export const MAX_PORTABLE_OBJECTS = 5_000;
export const MAX_PORTABLE_DEPTH = 40;
export const MAX_PORTABLE_STRING_LENGTH = 200_000;

export const PORTABLE_WORKSPACE_TYPES = ["2d-geometry", "3d-geometry", "cas", "2d-graph", "3d-graph"] as const;
export type PortableWorkspaceType = typeof PORTABLE_WORKSPACE_TYPES[number];
export type PortableFileKind = "workspace" | "lesson";
export type LessonOpenMode = "practice" | "guided" | "solution" | "teacher";

export const PORTABLE_WORKSPACE_LABELS: Record<PortableWorkspaceType, string> = {
  "2d-geometry": "2D Geometry",
  "3d-geometry": "3D Geometry",
  cas: "CAS",
  "2d-graph": "2D Graph",
  "3d-graph": "3D Graph",
};

export const PORTABLE_WORKSPACE_ROUTES: Record<PortableWorkspaceType, string> = {
  "2d-geometry": "/workspace/geometry",
  "3d-geometry": "/workspace/3d",
  cas: "/workspace/data/cas",
  "2d-graph": "/workspace/graph",
  "3d-graph": "/math-lab/3d-graphing",
};

export type PortableFileHeader = {
  magic: typeof PORTABLE_FILE_MAGIC;
  fileKind: PortableFileKind;
  fileExtension: typeof WORKSPACE_EXTENSION | typeof LESSON_EXTENSION;
  mimeType: typeof WORKSPACE_MIME | typeof LESSON_MIME;
  schemaVersion: number;
  minimumReaderVersion: string;
  createdByApp: "Math Universe";
  createdByAppVersion: string;
};

export type PortableDocumentMetadata = {
  id: string;
  title: string;
  description: string;
  author: { name: string; organization: string };
  createdAt: string;
  updatedAt: string;
  language: string;
  tags: string[];
  difficulty: "beginner" | "intermediate" | "advanced" | "mixed";
  gradeLevel: string[];
  subject: "Mathematics";
  topic: string;
  estimatedDurationMinutes: number;
};

export type PortableLesson = {
  lessonId: string;
  title: string;
  shortDescription: string;
  subject: "Mathematics";
  workspaceType: PortableWorkspaceType;
  topic: string;
  subtopic: string;
  difficulty: PortableDocumentMetadata["difficulty"];
  gradeLevel: string[];
  learningObjectives: string[];
  prerequisites: string[];
  instructions: string[];
  hints: string[];
  checkpoints: Array<{ id: string; title: string; instructions: string; scene: unknown; validationRules: string[] }>;
  solutionSteps: string[];
  expectedResult: string;
  teacherNotes: string;
  estimatedDurationMinutes: number;
  maximumScore: number;
  attemptLimit: number | null;
  allowSolutionView: boolean;
  tags: string[];
  initialScene: unknown;
  solutionScene: unknown;
  openMode: LessonOpenMode;
};

export type PortableMathFile = {
  fileHeader: PortableFileHeader;
  workspace: {
    type: PortableWorkspaceType;
    typeLabel: string;
    engine: string;
    engineVersion: string;
  };
  document: PortableDocumentMetadata;
  preview: {
    thumbnailIncluded: boolean;
    thumbnailDataUrl?: string;
    objectCount: number;
    expressionCount: number;
    hasSolution: boolean;
  };
  scene: unknown;
  lesson?: PortableLesson;
  metadata: Record<string, unknown>;
  integrity: { algorithm: "SHA-256"; contentHash: string };
};

export type PortableSceneSummary = {
  objectCount: number;
  expressionCount: number;
  description?: string;
};

export type PortableWorkspaceAdapter = {
  workspaceType: PortableWorkspaceType;
  engine: string;
  engineVersion: string;
  title: () => string;
  serializeScene: () => unknown;
  deserializeScene: (scene: unknown, mode: "replace" | "merge") => void | Promise<void>;
  validateScene?: (scene: unknown) => string[];
  getImageTarget: (scope: "viewport" | "entire") => HTMLElement | SVGElement | null;
  getSceneSummary: () => PortableSceneSummary;
  canMerge?: boolean;
};

export type CreatePortableFileInput = {
  kind: PortableFileKind;
  adapter: PortableWorkspaceAdapter;
  title: string;
  description?: string;
  authorName?: string;
  authorOrganization?: string;
  tags?: string[];
  difficulty?: PortableDocumentMetadata["difficulty"];
  gradeLevel?: string[];
  topic?: string;
  durationMinutes?: number;
  scene?: unknown;
  lesson?: PortableLesson;
  thumbnailDataUrl?: string;
};

export type PortableValidationResult =
  | { ok: true; file: PortableMathFile; warnings: string[] }
  | { ok: false; error: string };

export async function createPortableMathFile(input: CreatePortableFileInput): Promise<PortableMathFile> {
  const now = new Date().toISOString();
  const kind = input.kind;
  const summary = input.adapter.getSceneSummary();
  const scene = clonePortableValue(input.scene ?? input.adapter.serializeScene());
  const title = cleanText(input.title || `${PORTABLE_WORKSPACE_LABELS[input.adapter.workspaceType]} workspace`, 160);
  const file: PortableMathFile = {
    fileHeader: {
      magic: PORTABLE_FILE_MAGIC,
      fileKind: kind,
      fileExtension: kind === "lesson" ? LESSON_EXTENSION : WORKSPACE_EXTENSION,
      mimeType: kind === "lesson" ? LESSON_MIME : WORKSPACE_MIME,
      schemaVersion: PORTABLE_SCHEMA_VERSION,
      minimumReaderVersion: "1.0.0",
      createdByApp: "Math Universe",
      createdByAppVersion: PORTABLE_APP_VERSION,
    },
    workspace: {
      type: input.adapter.workspaceType,
      typeLabel: PORTABLE_WORKSPACE_LABELS[input.adapter.workspaceType],
      engine: cleanText(input.adapter.engine, 120),
      engineVersion: cleanText(input.adapter.engineVersion, 40),
    },
    document: {
      id: crypto.randomUUID(),
      title,
      description: cleanText(input.description ?? summary.description ?? "", 4_000),
      author: { name: cleanText(input.authorName ?? "", 160), organization: cleanText(input.authorOrganization ?? "", 160) },
      createdAt: now,
      updatedAt: now,
      language: "en",
      tags: cleanStringArray(input.tags ?? [], 40, 80),
      difficulty: input.difficulty ?? "mixed",
      gradeLevel: cleanStringArray(input.gradeLevel ?? [], 20, 32),
      subject: "Mathematics",
      topic: cleanText(input.topic ?? "", 160),
      estimatedDurationMinutes: clampInteger(input.durationMinutes ?? 20, 1, 1440),
    },
    preview: {
      thumbnailIncluded: Boolean(input.thumbnailDataUrl),
      thumbnailDataUrl: validThumbnail(input.thumbnailDataUrl) ? input.thumbnailDataUrl : undefined,
      objectCount: clampInteger(summary.objectCount, 0, MAX_PORTABLE_OBJECTS),
      expressionCount: clampInteger(summary.expressionCount, 0, MAX_PORTABLE_OBJECTS),
      hasSolution: kind === "lesson" && Boolean(input.lesson?.solutionScene),
    },
    scene,
    lesson: kind === "lesson" ? clonePortableValue(input.lesson) as PortableLesson : undefined,
    metadata: {},
    integrity: { algorithm: "SHA-256", contentHash: "" },
  };
  if (file.lesson) file.lesson.workspaceType = file.workspace.type;
  file.integrity.contentHash = await portableContentHash(file);
  return file;
}

export async function parsePortableMathFile(text: string, filename = "", mimeType = ""): Promise<PortableValidationResult> {
  if (new TextEncoder().encode(text).byteLength > MAX_PORTABLE_FILE_BYTES) return { ok: false, error: "This workspace file is too large to open safely." };
  let parsed: unknown;
  try { parsed = JSON.parse(text); } catch { return { ok: false, error: "The file is damaged or incomplete." }; }
  const safetyError = inspectPortableValue(parsed);
  if (safetyError) return { ok: false, error: safetyError };
  const migrated = migratePortableFile(parsed);
  if (!migrated || typeof migrated !== "object") return { ok: false, error: "This file is not a supported workspace file." };
  const file = migrated as Partial<PortableMathFile>;
  if (file.fileHeader?.magic !== PORTABLE_FILE_MAGIC) return { ok: false, error: "This file is not a supported workspace file." };
  if (Number(file.fileHeader.schemaVersion) > PORTABLE_SCHEMA_VERSION) return { ok: false, error: "This file was created with a newer version of the application. Please update the application to open it safely." };
  if (file.fileHeader.fileKind !== "workspace" && file.fileHeader.fileKind !== "lesson") return { ok: false, error: "The portable file kind is missing or invalid." };
  const expectedExtension = file.fileHeader.fileKind === "lesson" ? LESSON_EXTENSION : WORKSPACE_EXTENSION;
  const expectedMime = file.fileHeader.fileKind === "lesson" ? LESSON_MIME : WORKSPACE_MIME;
  if (file.fileHeader.fileExtension !== expectedExtension || file.fileHeader.mimeType !== expectedMime) return { ok: false, error: "The portable file header is inconsistent with its file kind." };
  if (compareVersions(String(file.fileHeader.minimumReaderVersion ?? "0.0.0"), PORTABLE_APP_VERSION) > 0) return { ok: false, error: "This file was created with a newer version of the application. Please update the application to open it safely." };
  if (!PORTABLE_WORKSPACE_TYPES.includes(file.workspace?.type as PortableWorkspaceType)) return { ok: false, error: "The workspace type is missing or unsupported." };
  if (!file.document?.title || typeof file.document.title !== "string") return { ok: false, error: "The file is damaged or incomplete: document title is missing." };
  if (file.scene === undefined) return { ok: false, error: "The file is damaged or incomplete: scene data is missing." };
  if (file.fileHeader.fileKind === "lesson" && (!file.lesson || file.lesson.workspaceType !== file.workspace?.type)) return { ok: false, error: "The lesson workspace type conflicts with the file workspace type." };
  const warnings: string[] = [];
  if (filename && !filename.toLowerCase().endsWith(expectedExtension)) warnings.push(`The filename extension does not match ${expectedExtension}. Internal metadata was used.`);
  if (mimeType && ![expectedMime, "application/json", "text/plain"].includes(mimeType)) warnings.push("The browser-reported MIME type did not match the internal portable-file metadata.");
  const adapterWarnings = countSceneObjects(file.scene) > MAX_PORTABLE_OBJECTS ? ["The scene contains too many objects."] : [];
  if (adapterWarnings.length) return { ok: false, error: adapterWarnings[0] };
  const complete = file as PortableMathFile;
  if (complete.integrity?.contentHash) {
    const actual = await portableContentHash(complete);
    if (actual !== complete.integrity.contentHash) return { ok: false, error: "The file integrity check failed. The file may be damaged or incomplete." };
  } else warnings.push("This file has no integrity hash; its structure was validated before opening.");
  return { ok: true, file: clonePortableValue(complete) as PortableMathFile, warnings };
}

export function serializePortableMathFile(file: PortableMathFile) { return JSON.stringify(file, null, 2); }

export function portableFilename(title: string, type: PortableWorkspaceType, kind: PortableFileKind) {
  const base = cleanText(title, 100).normalize("NFKD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 90) || "untitled";
  return `${base}-${type}${kind === "lesson" ? LESSON_EXTENSION : WORKSPACE_EXTENSION}`;
}

export function downloadPortableFile(file: PortableMathFile) {
  const blob = new Blob([serializePortableMathFile(file)], { type: file.fileHeader.mimeType });
  downloadBlob(portableFilename(file.document.title, file.workspace.type, file.fileHeader.fileKind), blob);
}

export function downloadBlob(filename: string, blob: Blob) {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename.replace(/[\\/:*?"<>|]/g, "-").slice(0, 180);
  anchor.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 1_000);
}

export function createDefaultLesson(type: PortableWorkspaceType, title: string, scene: unknown): PortableLesson {
  return {
    lessonId: crypto.randomUUID(), title, shortDescription: "", subject: "Mathematics", workspaceType: type, topic: "", subtopic: "",
    difficulty: "intermediate", gradeLevel: [], learningObjectives: [], prerequisites: [], instructions: [], hints: [], checkpoints: [],
    solutionSteps: [], expectedResult: "", teacherNotes: "", estimatedDurationMinutes: 20, maximumScore: 100, attemptLimit: null,
    allowSolutionView: true, tags: [], initialScene: clonePortableValue(scene), solutionScene: clonePortableValue(scene), openMode: "practice",
  };
}

export function sceneForLessonMode(file: PortableMathFile, mode: LessonOpenMode) {
  if (!file.lesson) return file.scene;
  return mode === "solution" || mode === "teacher" ? file.lesson.solutionScene : file.lesson.initialScene;
}

export async function portableContentHash(file: PortableMathFile) {
  const copy = clonePortableValue(file) as PortableMathFile;
  copy.integrity = { algorithm: "SHA-256", contentHash: "" };
  const data = new TextEncoder().encode(stableStringify(copy));
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest), byte => byte.toString(16).padStart(2, "0")).join("");
}

export function migratePortableFile(value: unknown): unknown {
  if (!value || typeof value !== "object") return value;
  const record = value as Record<string, unknown>;
  const header = record.fileHeader as Record<string, unknown> | undefined;
  if (header?.schemaVersion === 1) return value;
  return value;
}

function inspectPortableValue(value: unknown) {
  let nodes = 0;
  const visit = (entry: unknown, depth: number): string | null => {
    nodes += 1;
    if (nodes > 100_000) return "The file contains too much nested data to open safely.";
    if (depth > MAX_PORTABLE_DEPTH) return "The file contains data nested too deeply to open safely.";
    if (typeof entry === "string" && entry.length > MAX_PORTABLE_STRING_LENGTH) return "The file contains an oversized text field.";
    if (!entry || typeof entry !== "object") return null;
    if (Array.isArray(entry)) {
      if (entry.length > MAX_PORTABLE_OBJECTS * 20) return "The file contains an oversized list.";
      for (const item of entry) { const error = visit(item, depth + 1); if (error) return error; }
      return null;
    }
    for (const [key, item] of Object.entries(entry as Record<string, unknown>)) {
      if (["__proto__", "prototype", "constructor"].includes(key)) return "The file contains an unsafe object key.";
      const error = visit(item, depth + 1); if (error) return error;
    }
    return null;
  };
  return visit(value, 0);
}

function countSceneObjects(scene: unknown) {
  if (!scene || typeof scene !== "object") return 0;
  const record = scene as Record<string, unknown>;
  const direct = ["objects", "surfaces", "plots", "cells", "construction", "added3dObjects"];
  let count = 0;
  for (const key of direct) {
    const value = record[key];
    if (Array.isArray(value)) count += value.length;
    else if (value && typeof value === "object") count += Object.values(value).reduce((total, child) => total + (Array.isArray(child) ? child.length : 0), 0);
  }
  for (const value of Object.values(record)) if (value && typeof value === "object" && !Array.isArray(value)) count += Math.min(countSceneObjects(value), MAX_PORTABLE_OBJECTS + 1);
  return count;
}

function clonePortableValue<T>(value: T): T { return JSON.parse(JSON.stringify(value)) as T; }
function cleanText(value: string, max: number) { return value.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, "").trim().slice(0, max); }
function cleanStringArray(values: string[], maxItems: number, maxLength: number) { return values.slice(0, maxItems).map(value => cleanText(String(value), maxLength)).filter(Boolean); }
function clampInteger(value: number, min: number, max: number) { return Math.min(max, Math.max(min, Math.round(Number.isFinite(value) ? value : min))); }
function validThumbnail(value?: string) { return Boolean(value && /^data:image\/(png|jpeg|webp|svg\+xml);base64,[A-Za-z0-9+/=]+$/i.test(value) && value.length <= 2_000_000); }
function compareVersions(left: string, right: string) {
  const parts = (value: string) => value.split(".").slice(0, 3).map(part => Number.parseInt(part, 10) || 0);
  const a = parts(left), b = parts(right);
  for (let index = 0; index < 3; index += 1) if (a[index] !== b[index]) return a[index] > b[index] ? 1 : -1;
  return 0;
}

function stableStringify(value: unknown): string {
  if (value === null || typeof value !== "object") return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map(stableStringify).join(",")}]`;
  return `{${Object.keys(value as object).sort().map(key => `${JSON.stringify(key)}:${stableStringify((value as Record<string, unknown>)[key])}`).join(",")}}`;
}
