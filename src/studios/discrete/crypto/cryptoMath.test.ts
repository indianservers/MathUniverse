import { describe, expect, it } from "vitest";
import { avalancheBits, caesar, dhMix, modInverse, modPow, toyHash } from "./cryptoMath";

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

  it("round trips a short encoded message with a valid toy RSA key", () => {
    const n = 61 * 53, phi = 60 * 52, e = 17, d = modInverse(e, phi);
    const message = "MATH";
    const codes = [...message].map((letter) => letter.charCodeAt(0));
    const ciphertext = codes.map((code) => modPow(code, e, n).value);
    expect(String.fromCharCode(...ciphertext.map((code) => modPow(code, d, n).value))).toBe(message);
  });
});
