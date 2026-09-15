import { describe, expect, it } from "vitest";
import { inscribedVsCentral, pythagorasTiles, twoColumnClaims } from "./proofMath";

describe("proof math", () => {
  it("keeps a²+b²=c² for a 3-4-5 triangle", () => {
    const tiles = pythagorasTiles(3, 4);
    expect(tiles.c).toBe(5);
    expect(tiles.holds).toBe(true);
  });

  it("shows inscribed angle is half the central angle and two-column claims", () => {
    expect(inscribedVsCentral(80).inscribed).toBe(40);
    expect(twoColumnClaims("Pythagoras", { a: 3, b: 4, tear: 0, arc: 80, k: 2 })[0]?.live).toBe("5");
  });
});
