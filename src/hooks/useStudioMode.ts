import { useSearchParams } from "react-router-dom";

/** Keep studio tabs, reloads, shared URLs, and browser history in sync. */
export function useStudioMode<T extends string>(
  key: string,
  allowed: readonly T[],
  fallback: T,
) {
  const [params, setParams] = useSearchParams();
  const requested = params.get(key) as T;
  const mode = allowed.includes(requested) ? requested : fallback;
  const select = (next: T) => {
    const updated = new URLSearchParams(params);
    if (next === fallback) updated.delete(key);
    else updated.set(key, next);
    setParams(updated);
  };
  return [mode, select] as const;
}
