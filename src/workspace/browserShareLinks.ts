import type { WorkspaceSummary } from "./browserProjectCenter";

export const WORKSPACE_SHARE_SCHEMA = "math-universe.share-capsule";
export const WORKSPACE_SHARE_HASH_PREFIX = "mu-share=";
export const MAX_INLINE_SHARE_URL_LENGTH = 180000;

export type WorkspaceShareCapsule<TWorkspace = unknown, TLesson = unknown> = {
  schema: typeof WORKSPACE_SHARE_SCHEMA;
  version: 1;
  createdAt: string;
  summary: WorkspaceSummary;
  workspace: TWorkspace;
  lesson: TLesson;
};

export function createWorkspaceShareCapsule<TWorkspace, TLesson>(
  workspace: TWorkspace,
  lesson: TLesson,
  summary: WorkspaceSummary
): WorkspaceShareCapsule<TWorkspace, TLesson> {
  return {
    schema: WORKSPACE_SHARE_SCHEMA,
    version: 1,
    createdAt: new Date().toISOString(),
    summary,
    workspace,
    lesson,
  };
}

export function createWorkspaceShareUrl<TWorkspace, TLesson>(
  capsule: WorkspaceShareCapsule<TWorkspace, TLesson>,
  href = window.location.href
) {
  const url = new URL(href);
  url.hash = `${WORKSPACE_SHARE_HASH_PREFIX}${encodeWorkspaceShareCapsule(capsule)}`;
  return url.toString();
}

export function readWorkspaceShareCapsuleFromHash<TWorkspace = unknown, TLesson = unknown>(
  hash = window.location.hash
): WorkspaceShareCapsule<TWorkspace, TLesson> | null {
  const payload = hash.startsWith(`#${WORKSPACE_SHARE_HASH_PREFIX}`) ? hash.slice(WORKSPACE_SHARE_HASH_PREFIX.length + 1) : "";
  if (!payload) return null;
  return decodeWorkspaceShareCapsule<TWorkspace, TLesson>(payload);
}

export function encodeWorkspaceShareCapsule<TWorkspace, TLesson>(capsule: WorkspaceShareCapsule<TWorkspace, TLesson>) {
  return base64UrlEncode(JSON.stringify(capsule));
}

export function decodeWorkspaceShareCapsule<TWorkspace = unknown, TLesson = unknown>(payload: string): WorkspaceShareCapsule<TWorkspace, TLesson> | null {
  try {
    const parsed = JSON.parse(base64UrlDecode(payload)) as unknown;
    return isWorkspaceShareCapsule(parsed) ? parsed as WorkspaceShareCapsule<TWorkspace, TLesson> : null;
  } catch {
    return null;
  }
}

export function isWorkspaceShareCapsule(value: unknown): value is WorkspaceShareCapsule {
  return Boolean(value && typeof value === "object" && "schema" in value && (value as { schema?: unknown }).schema === WORKSPACE_SHARE_SCHEMA);
}

export function shareSizeLabel(characterCount: number) {
  if (characterCount < 1000) return `${characterCount} chars`;
  if (characterCount < 1000000) return `${Math.round(characterCount / 100) / 10}k chars`;
  return `${Math.round(characterCount / 100000) / 10}m chars`;
}

function base64UrlEncode(value: string) {
  const bytes = new TextEncoder().encode(value);
  let binary = "";
  for (let index = 0; index < bytes.length; index += 1) binary += String.fromCharCode(bytes[index]);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function base64UrlDecode(value: string) {
  const base64 = value.replace(/-/g, "+").replace(/_/g, "/").padEnd(Math.ceil(value.length / 4) * 4, "=");
  const binary = atob(base64);
  const bytes = Uint8Array.from(binary, (character) => character.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}
