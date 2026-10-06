export type ModelValues = Record<string, unknown>;
type Binding = { set: (value: unknown) => void; initial: unknown };

/** Only model data belongs in saved figures; DOM nodes, functions and class instances do not. */
export function serializableModel(value: unknown): boolean {
  if (value === null || value === undefined || typeof value === "string" || typeof value === "boolean") return true;
  if (typeof value === "number") return Number.isFinite(value);
  if (Array.isArray(value)) return value.every(serializableModel);
  return typeof value === "object" && Object.getPrototypeOf(value) === Object.prototype && Object.values(value).every(serializableModel);
}

export function compatibleModel(initial: unknown, saved: unknown): boolean {
  if (!serializableModel(saved)) return false;
  if (initial === undefined || initial === null) return true;
  if (Array.isArray(initial)) return Array.isArray(saved) && (initial.length === 0 || saved.every(item => compatibleModel(initial[0], item)));
  if (typeof initial === "object") return !!saved && typeof saved === "object" && !Array.isArray(saved) && Object.entries(initial).every(([key, value]) => key in (saved as ModelValues) && compatibleModel(value, (saved as ModelValues)[key]));
  return typeof initial === typeof saved;
}

const copy = (values: ModelValues): ModelValues => Object.fromEntries(Object.entries(values).map(([key, value]) => [key, value === undefined ? undefined : structuredClone(value)]));

export class ModelLedger {
  values: ModelValues = {};
  bindings = new Map<string, Binding>();
  past: ModelValues[] = [];
  future: ModelValues[] = [];
  defaults: ModelValues = {};
  private coalescing = false;
  private gestureActive = false;
  beginGesture = () => { this.gestureActive = true; this.coalescing = false; };
  endGesture = () => { this.gestureActive = false; this.coalescing = false; };
  revision = 0;
  listeners = new Set<() => void>();
  constructor(readonly saved: ModelValues = {}) {}
  subscribe = (listener: () => void) => { this.listeners.add(listener); return () => { this.listeners.delete(listener); }; };
  version = () => this.revision;
  notify() { this.revision++; this.listeners.forEach(listener => listener()); }
  initial<T>(key: string, initial: T): T {
    const source = Object.prototype.hasOwnProperty.call(this.values, key) ? this.values : this.saved;
    return Object.prototype.hasOwnProperty.call(source, key) && compatibleModel(initial, source[key]) ? source[key] as T : initial;
  }
  register(key: string, initial: unknown, value: unknown, set: (value: unknown) => void) {
    this.bindings.set(key, { initial, set });
    this.defaults[key] = initial;
    if (!Object.prototype.hasOwnProperty.call(this.values, key)) {
      this.values[key] = value;
      this.past.forEach(snapshot => { snapshot[key] = value; });
      this.future.forEach(snapshot => { snapshot[key] = value; });
    }
    this.notify();
    return () => { this.bindings.delete(key); };
  }
  commit(key: string, next: unknown, coalesce = false) {
    if (!serializableModel(next)) return;
    if (JSON.stringify(this.values[key]) === JSON.stringify(next)) return;
    if (!coalesce || !this.coalescing) this.past.push(copy(this.values));
    if (coalesce && !this.coalescing) { this.coalescing = true; queueMicrotask(() => { if (!this.gestureActive) this.coalescing = false; }); }
    if (this.past.length > 100) this.past.shift();
    this.future = [];
    this.values = { ...this.values, [key]: next };
    this.bindings.get(key)?.set(next);
    this.notify();
  }
  apply(values: ModelValues) {
    this.values = copy(values);
    this.bindings.forEach((binding, key) => { if (key in values && compatibleModel(binding.initial, values[key])) binding.set(values[key]); });
    this.notify();
  }
  undo = () => { this.coalescing = false; const previous = this.past.pop(); if (previous) { this.future.push(copy(this.values)); this.apply(previous); } };
  redo = () => { this.coalescing = false; const next = this.future.pop(); if (next) { this.past.push(copy(this.values)); this.apply(next); } };
  reset = () => {
    this.coalescing = false;
    const next = { ...this.values };
    Object.entries(this.defaults).forEach(([key, value]) => { next[key] = value; });
    if (JSON.stringify(next) === JSON.stringify(this.values)) return;
    this.past.push(copy(this.values)); this.future = []; this.apply(next);
  };
}
