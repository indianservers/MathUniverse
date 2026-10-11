import type { NotebookState } from "./casNotebookEngine";

const STORAGE_KEY = "math-universe-cas-studio-v2";

export function readCasNotebookState(
  storage: Pick<Storage, "getItem"> = localStorage,
): NotebookState | null {
  try {
    const value = JSON.parse(
      storage.getItem(STORAGE_KEY) ?? "null",
    ) as NotebookState | null;
    return value?.cells?.length &&
      (value.mode === "exact" || value.mode === "numeric")
      ? {...value,cells:value.cells.map(cell=>({...cell,execution:undefined,conditions:undefined,solutionSet:undefined}))}
      : null;
  } catch {
    return null;
  }
}
export function saveCasNotebookState(
  state: NotebookState,
  storage: Pick<Storage, "setItem"> = localStorage,
) {
  storage.setItem(STORAGE_KEY, JSON.stringify(state));
}
