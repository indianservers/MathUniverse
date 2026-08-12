import { describe, expect, it } from "vitest";
import { createMathWorkspacePayload } from "./mathWorkspaces";
import { readWorkspaceTransfer, saveWorkspaceTransfer } from "./workspaceTransfer";

function memoryStorage() {
  const values = new Map<string, string>();
  return { getItem: (key: string) => values.get(key) ?? null, setItem: (key: string, value: string) => values.set(key, value), removeItem: (key: string) => values.delete(key) };
}

describe("workspaceTransfer", () => {
  it("delivers a payload once to its intended workspace", () => {
    const storage = memoryStorage();
    const payload = createMathWorkspacePayload({ sourceWorkspace: "cas", objectType: "expression", label: "f", value: "x^2" });
    saveWorkspaceTransfer(payload, "graphs", storage);

    expect(readWorkspaceTransfer("cas", storage)).toBeNull();
    expect(readWorkspaceTransfer("graphs", storage)).toEqual(payload);
    expect(readWorkspaceTransfer("graphs", storage)).toBeNull();
  });

  it("rejects expired transfers", () => {
    const storage = memoryStorage();
    const payload = createMathWorkspacePayload({ sourceWorkspace: "cas", objectType: "expression", label: "f", value: "x" });
    const envelope = saveWorkspaceTransfer(payload, "graphs", storage);
    expect(readWorkspaceTransfer("graphs", storage, envelope.createdAt + 60 * 60 * 1000 + 1)).toBeNull();
  });
});
