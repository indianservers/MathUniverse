import { describe, expect, it } from "vitest";
import {
  NUMBER_TAB_REDIRECTS,
  factorTreeLabel,
  gcdInt,
  pageFromPath,
  repeatingDecimal,
  terminatingDenominator,
} from "./numberSystemsStudioSession";

describe("number systems studio session", () => {
  it("maps lab routes and legacy tab query values", () => {
    expect(pageFromPath("/number-systems/hierarchy")).toBe("hierarchy");
    expect(NUMBER_TAB_REDIRECTS.space).toBe("hierarchy");
    expect(NUMBER_TAB_REDIRECTS.accuracy).toBe("practice");
  });

  it("factors, gcd, and decimal classification stay exact", () => {
    expect(gcdInt(84, 36)).toBe(12);
    expect(factorTreeLabel(8)).toBe("2^3");
    expect(terminatingDenominator(8)).toBe(true);
    expect(terminatingDenominator(3)).toBe(false);
    expect(repeatingDecimal(1, 3)).toBe("0.(3)");
    expect(repeatingDecimal(5, 8)).toBe("0.625");
  });
});
