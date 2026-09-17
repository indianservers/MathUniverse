import { describe, expect, it } from "vitest";
import { avalancheBits, caesar, dhMix, modPow, toyHash } from "./cryptoMath";

describe("crypto math", () => {
  it("shifts Caesar and recovers RSA-style modPow trail", () => {
    expect(caesar("ABC", 0)).toBe("ABC");
    expect(caesar("A", 1)).toBe("B");
    expect(modPow(72, 17, 61 * 53).value).toBeGreaterThan(0);
  });

  it("shows avalanche and a shared DH secret", () => {
    expect(toyHash("cat")).not.toBe(toyHash("bat"));
    expect(avalancheBits("cat", "bat")).toBeGreaterThan(0);
    const mix = dhMix(6, 15, 5, 23);
    expect(mix.shared).toBe(modPow(mix.A, 15, 23).value);
  });
});
