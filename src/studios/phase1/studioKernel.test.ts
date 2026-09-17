import { describe, expect, it } from "vitest";
import { challengeMatches, decodeFigState, encodeFigState, formatExactApprox } from "./studioKernel";

describe("phase 1 studio kernel", () => {
  it("labels integers exactly and approximations to digits", () => {
    expect(formatExactApprox(3, true)).toBe("3");
    expect(formatExactApprox(1.5, true)).toBe("3/2");
    expect(formatExactApprox(Math.SQRT2, true)).toBe("√2");
    expect(formatExactApprox(1.23456, false, 2)).toBe("1.23");
  });

  it("round-trips figure state in a share token", () => {
    const fig = { tx: 2, rot: 90, k: 1.5 };
    expect(decodeFigState(encodeFigState(fig), { tx: 0, rot: 0, k: 1 })).toEqual(fig);
    expect(decodeFigState("not-base64", { tx: 1 })).toEqual({ tx: 1 });
  });

  it("grades live challenges from the current figure", () => {
    expect(challengeMatches("5", 5)).toBe(true);
    expect(challengeMatches("1/2", 0.5)).toBe(true);
    expect(challengeMatches("2", 5)).toBe(false);
  });
});
