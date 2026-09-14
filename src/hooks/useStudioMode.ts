import { useSearchParams } from "react-router-dom";

/** Keep studio tabs, reloads, shared URLs, and browser history in sync. */
export function normalizeStudioModeToken(value: string) {
  try {
    return decodeURIComponent(value)
      .trim()
      .toLowerCase()
      .replace(/[+_]+/g, " ")
      .replace(/\s+/g, " ");
  } catch {
    return value.trim().toLowerCase().replace(/[+_]+/g, " ").replace(/\s+/g, " ");
  }
}

export function resolveStudioMode<T extends string>(
  requested: string | null | undefined,
  allowed: readonly T[],
  fallback: T,
) {
  if (!requested) return fallback;
  const token = normalizeStudioModeToken(requested);
  return (
    allowed.find(
      (item) =>
        normalizeStudioModeToken(item) === token ||
        normalizeStudioModeToken(item.replace(/\s+/g, "-")) === token,
    ) ?? fallback
  );
}

export function useStudioMode<T extends string>(
  key: string,
  allowed: readonly T[],
  fallback: T,
) {
  const [params, setParams] = useSearchParams();
  const mode = resolveStudioMode(params.get(key), allowed, fallback);
  const select = (next: T) => {
    setParams((current) => {
      const updated = new URLSearchParams(current);
      if (next === fallback) updated.delete(key);
      else updated.set(key, next);
      return updated;
    });
  };
  return [mode, select] as const;
}
