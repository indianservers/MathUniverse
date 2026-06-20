import { describe, expect, it } from "vitest";
import { functionProperties } from "./setTheoryEngine";

describe("functionProperties", () => {
  it("accepts a clean bijection from domain to codomain", () => {
    expect(functionProperties(["1", "2", "3"], ["a", "b", "c"], [["1", "a"], ["2", "b"], ["3", "c"]])).toEqual({
      isFunction: true,
      injective: true,
      surjective: true,
      bijective: true,
    });
  });

  it("rejects outputs that are not in the codomain", () => {
    expect(functionProperties(["1", "2"], ["a", "b"], [["1", "x"], ["2", "b"]])).toMatchObject({
      isFunction: false,
      injective: false,
      surjective: false,
      bijective: false,
    });
  });

  it("distinguishes many-to-one functions from injective functions", () => {
    expect(functionProperties(["1", "2"], ["a", "b"], [["1", "a"], ["2", "a"]])).toEqual({
      isFunction: true,
      injective: false,
      surjective: false,
      bijective: false,
    });
  });
});
