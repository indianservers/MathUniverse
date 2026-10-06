import { createContext, useCallback, useContext, useLayoutEffect, useMemo, useRef, useState, useSyncExternalStore, type Dispatch, type ReactNode, type SetStateAction } from "react";
import { useLocation, useSearchParams } from "react-router-dom";
import { compatibleModel, ModelLedger, serializableModel, type ModelValues } from "./modelLedger";
import { decodeFigState, encodeFigState } from "./studioKernel";

type ModelContext = { ledger: ModelLedger; exact: boolean; setExact: (value: boolean) => void; share: () => Promise<void>; status: string };
const Context = createContext<ModelContext | null>(null);
let exactPreference = false;
export const readExactPreference = () => exactPreference;

export function StudioModelProvider({ children }: { children: ReactNode }) {
  const [params, setParams] = useSearchParams();
  const { pathname } = useLocation();
  const [ledger] = useState(() => {
    const decoded = decodeFigState(params.get("fig"), { version: 1, values: {} as ModelValues });
    return new ModelLedger(decoded.version === 1 && decoded.values && serializableModel(decoded.values) ? decoded.values : {});
  });
  const [exact, setExactState] = useState(params.get("exact") === "1");
  const [status, setStatus] = useState("");
  useLayoutEffect(() => { exactPreference = exact; return () => { exactPreference = false; }; }, [exact]);
  const setExact = useCallback((value: boolean) => { exactPreference = value; setExactState(value); }, []);
  const share = useCallback(async () => {
    const updated = new URLSearchParams(window.location.search);
    updated.set("fig", encodeFigState({ version: 1, values: ledger.values }));
    if (exact) updated.set("exact", "1"); else updated.delete("exact");
    const url = `${window.location.origin}${pathname}?${updated}`;
    setParams(updated, { replace: true });
    try { await navigator.clipboard.writeText(url); setStatus("Link copied with the current model values and selected mode."); }
    catch { setStatus("Figure saved in this page URL. Copy the address to share it."); }
  }, [exact, ledger, pathname, setParams]);
  const context = useMemo(() => ({ ledger, exact, setExact, share, status }), [ledger, exact, setExact, share, status]);
  return <Context.Provider value={context}>{children}</Context.Provider>;
}

export function useStudioModel() {
  const context = useContext(Context);
  const subscribe = context?.ledger.subscribe ?? (() => () => {});
  const version = context?.ledger.version ?? (() => 0);
  useSyncExternalStore(subscribe, version, version);
  return context;
}

export function useStudioState<T>(key: string, initial: T | (() => T), enabled?: boolean): [T, Dispatch<SetStateAction<T>>];
export function useStudioState<T = undefined>(key: string): [T | undefined, Dispatch<SetStateAction<T | undefined>>];
export function useStudioState<T>(key: string, initial?: T | (() => T), enabled = true) {
  const context = useContext(Context);
  const initialRef = useRef<{ value: T | undefined } | null>(null);
  if (!initialRef.current) initialRef.current = { value: typeof initial === "function" ? (initial as () => T)() : initial };
  const defaults = initialRef.current.value;
  const [value, setValue] = useState<T | undefined>(() => enabled && context ? context.ledger.initial(key, defaults) : defaults);
  const valueRef = useRef(value);
  valueRef.current = value;
  const registered = enabled && !!context && serializableModel(defaults);
  useLayoutEffect(() => {
    if (!registered || !context) return;
    return context.ledger.register(key, defaults, valueRef.current, next => { valueRef.current = next as T; setValue(next as T); });
  }, [context?.ledger, defaults, key, registered]);
  const set = useCallback((next: SetStateAction<T | undefined>) => {
    const resolved = typeof next === "function" ? (next as (previous: T | undefined) => T)(valueRef.current) : next;
    if (registered && context && compatibleModel(defaults, resolved)) context.ledger.commit(key, resolved, true);
    else { valueRef.current = resolved; setValue(resolved); }
  }, [context?.ledger, defaults, key, registered]);
  return [value, set] as const;
}
