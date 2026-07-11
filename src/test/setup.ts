import { beforeEach, vi } from "vitest";

function createMemoryStorage(): Storage {
  const store = new Map<string, string>();

  return {
    get length() {
      return store.size;
    },
    clear() {
      store.clear();
    },
    getItem(key: string) {
      return store.has(key) ? store.get(key)! : null;
    },
    key(index: number) {
      return Array.from(store.keys())[index] ?? null;
    },
    removeItem(key: string) {
      store.delete(key);
    },
    setItem(key: string, value: string) {
      store.set(key, String(value));
    },
  };
}

function ensureStorage(name: "localStorage" | "sessionStorage") {
  try {
    if (typeof globalThis[name] !== "undefined") return;
  } catch {
    // Access can throw in restricted DOM-like environments.
  }

  Object.defineProperty(globalThis, name, {
    configurable: true,
    value: createMemoryStorage(),
    writable: true,
  });
}

ensureStorage("localStorage");
ensureStorage("sessionStorage");

beforeEach(() => {
  globalThis.localStorage?.clear();
  globalThis.sessionStorage?.clear();
});

const suppressedWarningPatterns = [
  /useLayoutEffect does nothing on the server/i,
];

function isSuppressedWarning(args: unknown[]) {
  const message = args.map((arg) => String(arg)).join(" ");
  return suppressedWarningPatterns.some((pattern) => pattern.test(message));
}

const originalConsoleError = console.error.bind(console);
const originalConsoleWarn = console.warn.bind(console);

vi.spyOn(console, "error").mockImplementation((...args: unknown[]) => {
  if (isSuppressedWarning(args)) return;
  originalConsoleError(...args);
});

vi.spyOn(console, "warn").mockImplementation((...args: unknown[]) => {
  if (isSuppressedWarning(args)) return;
  originalConsoleWarn(...args);
});
