import { describe, expect, it } from "vitest";
import { activityLink, makeClassCode, startActivity } from "./studioClassroom";

describe("studio classroom", () => {
  it("builds a joinable activity link", () => {
    const code = "AB12CD";
    expect(activityLink("/discrete-world/primes?mode=Sieve", code)).toContain("class=AB12CD");
    expect(makeClassCode().length).toBeGreaterThanOrEqual(4);
  });

  it("stores a started activity when localStorage exists", () => {
    const store: Record<string, string> = {};
    globalThis.localStorage = {
      getItem: (k: string) => store[k] ?? null,
      setItem: (k: string, v: string) => { store[k] = v; },
      removeItem: (k: string) => { delete store[k]; },
      clear: () => { Object.keys(store).forEach((k) => delete store[k]); },
      key: () => null,
      length: 0,
    };
    const started = startActivity("ZZ9", "/geometry/triangles", "Ada");
    expect(started.href).toContain("/geometry/triangles");
  });
});
