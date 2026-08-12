import type { MathWorkspacePayload } from "./mathWorkspaces";

export type WorkspaceTransferTarget = "cas" | "graphs" | "graphs-3d" | "spreadsheet" | "geometry" | "geometry-3d";

export type WorkspaceTransferEnvelope = {
  payload: MathWorkspacePayload;
  target: WorkspaceTransferTarget;
  createdAt: number;
};

const STORAGE_KEY = "math-universe-workspace-transfer-v1";
const MAX_AGE_MS = 60 * 60 * 1000;

export function saveWorkspaceTransfer(payload: MathWorkspacePayload, target: WorkspaceTransferTarget, storage: Pick<Storage, "setItem"> = localStorage) {
  const envelope: WorkspaceTransferEnvelope = { payload, target, createdAt: Date.now() };
  storage.setItem(STORAGE_KEY, JSON.stringify(envelope));
  return envelope;
}
export function readWorkspaceTransfer(target: WorkspaceTransferTarget, storage: Pick<Storage, "getItem" | "removeItem"> = localStorage, now = Date.now()) {
  try {
    const raw = storage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const envelope = JSON.parse(raw) as WorkspaceTransferEnvelope;
    if (envelope.target !== target || envelope.payload?.version !== 1 || now - envelope.createdAt > MAX_AGE_MS) return null;
    storage.removeItem(STORAGE_KEY);
    return envelope.payload;
  } catch {
    storage.removeItem(STORAGE_KEY);
    return null;
  }
}
