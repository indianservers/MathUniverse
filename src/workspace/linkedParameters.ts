export type LinkedParameter = {
  name: string;
  value: number;
  min: number;
  max: number;
  step: number;
  integer: boolean;
  updatedAt: number;
};

const STORAGE_KEY = "math-universe-linked-parameters-v1";

export function readLinkedParameters(storage: Pick<Storage, "getItem"> = localStorage): Record<string, LinkedParameter> {
  try { return JSON.parse(storage.getItem(STORAGE_KEY) ?? "{}") as Record<string, LinkedParameter>; }
  catch { return {}; }
}
export function saveLinkedParameter(parameter: Omit<LinkedParameter, "updatedAt">, storage: Pick<Storage, "getItem" | "setItem"> = localStorage) {
  const next = { ...readLinkedParameters(storage), [parameter.name]: { ...parameter, updatedAt: Date.now() } };
  storage.setItem(STORAGE_KEY, JSON.stringify(next));
  return next[parameter.name];
}
