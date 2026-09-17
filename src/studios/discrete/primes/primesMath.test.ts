import { describe, expect, it } from "vitest";
import {
  applySieveSteps,
  alternatingDigitSum,
  divisorCount,
  divisibilityTest,
  divisors,
  euclideanSteps,
  factorPairs,
  formatFactorization,
  gcd,
  gcdLcmIdentity,
  generatePrimes,
  isPrime,
  lcm,
  missingFactor,
  parseStudioInt,
  primeFactors,
  primeGaps,
  primePi,
  greedyFactorLeaves,
  greedyFactorPair,
  twoDifferentPairs,
  twinPrimes,
  ulamSpiral,
  vennPrimeFactors,
  wilsonHolds,
  wilsonResidue,
  bezoutCertificate,
  goldbachPairs,
  bertrandPrime,
  tenMod,
  tensDigitChoicesDiv4,
  hammingDigits,
  vennThree,
  eulerLucky,
} from "./primesMath";

describe("primesMath engine", () => {
  it("rejects decimals and empty input", () => {
    expect(parseStudioInt("", 1, 10).ok).toBe(false);
    expect(parseStudioInt("3.5", 1, 10).ok).toBe(false);
    expect(parseStudioInt("12", 1, 10).ok).toBe(false);
    expect(parseStudioInt("7", 2, 1000)).toEqual({ ok: true, value: 7 });
    expect(parseStudioInt("-3", 1, 10).ok).toBe(false);
    expect(parseStudioInt("NaN", 1, 10).ok).toBe(false);
  });

  it("never treats 1 as prime and matches known prime lists", () => {
    expect(isPrime(0)).toBe(false);
    expect(isPrime(1)).toBe(false);
    expect(isPrime(2)).toBe(true);
    expect(isPrime(91)).toBe(false);
    expect(isPrime(97)).toBe(true);
    expect(generatePrimes(30)).toEqual([2, 3, 5, 7, 11, 13, 17, 19, 23, 29]);
    expect(primePi(100)).toBe(25);
    expect(primePi(1000)).toBe(168);
  });

  it("factorizes 84 and 360 uniquely", () => {
    expect(formatFactorization(primeFactors(84))).toBe("2^2 × 3 × 7");
    expect(formatFactorization(primeFactors(360))).toBe("2^3 × 3^2 × 5");
    expect(divisorCount(84)).toBe(12);
    expect(divisors(24)).toEqual([1, 2, 3, 4, 6, 8, 12, 24]);
    expect(factorPairs(84).some(([a, b]) => a * b === 84)).toBe(true);
    expect(twoDifferentPairs(60)?.map((p) => p.join("x")).length).toBe(2);
    expect(greedyFactorLeaves(84).reduce((a, b) => a * b, 1)).toBe(84);
    expect(greedyFactorLeaves(84).sort((a, b) => a - b)).toEqual([2, 2, 3, 7]);
    expect(greedyFactorPair(84)).toEqual([2, 42]);
  });

  it("computes gcd, lcm, identity, and Euclid rows", () => {
    expect(gcd(84, 60)).toBe(12);
    expect(lcm(84, 60)).toBe(420);
    expect(gcd(0, 18)).toBe(18);
    expect(lcm(0, 18)).toBe(0);
    const id = gcdLcmIdentity(84, 60);
    expect(id.left).toBe(5040);
    expect(id.right).toBe(5040);
    expect(id.holds).toBe(true);
    const rows = euclideanSteps(84, 60);
    expect(rows.map((r) => r.r)).toEqual([24, 12, 0]);
    expect(gcd(17, 31)).toBe(1);
  });

  it("runs the sieve without treating 1 as prime", () => {
    const done = applySieveSteps(30, 10_000);
    expect(done.primes).toEqual([2, 3, 5, 7, 11, 13, 17, 19, 23, 29]);
    expect(done.states[1]).toBe("neither");
    expect(done.done).toBe(true);
    const mid = applySieveSteps(30, 0);
    expect(mid.states[2]).toBe("current");
    expect(mid.states[4]).toBe("candidate");
  });

  it("checks divisibility rules used in the lab", () => {
    expect(divisibilityTest(123456, 2).divisible).toBe(true);
    expect(divisibilityTest(123456, 3).divisible).toBe(true);
    expect(divisibilityTest(123456, 4).divisible).toBe(true);
    expect(divisibilityTest(123456, 6).divisible).toBe(true);
    expect(divisibilityTest(123456, 8).divisible).toBe(true);
    expect(divisibilityTest(123456, 9).divisible).toBe(false);
    expect(divisibilityTest(203, 7).divisible).toBe(true);
    expect(divisibilityTest(918082, 11).divisible).toBe(true);
    expect(alternatingDigitSum(918082).value).toBe(22);
    expect(divisibilityTest(360, 7).divisible).toBe(false);
    expect(divisibilityTest(360, 8).divisible).toBe(true);
    expect(divisibilityTest(360, 12).divisible).toBe(true);
  });

  it("builds prime gaps, twins, and an Ulam spiral", () => {
    expect(primeGaps(20)[0]).toEqual({ prime: 2, next: 3, gap: 1 });
    expect(twinPrimes(100)).toHaveLength(8);
    const spiral = ulamSpiral(9);
    expect(spiral[0]).toMatchObject({ n: 1, x: 0, y: 0 });
    expect(spiral.find((p) => p.n === 2)).toMatchObject({ x: 1, y: 0 });
    expect(spiral.find((p) => p.n === 3)).toMatchObject({ x: 1, y: 1 });
    expect(vennPrimeFactors(18, 24).common.sort()).toEqual([2, 3]);
    expect(missingFactor(126, [2, 7])).toBe(9);
  });

  it("keeps Bézout, Goldbach, Wilson, Bertrand, and 11-from-the-right accurate", () => {
    const bez = bezoutCertificate(84, 60);
    expect(bez.g).toBe(12);
    expect(84 * bez.x + 60 * bez.y).toBe(12);
    expect(goldbachPairs(28)).toContainEqual([5, 23]);
    expect(wilsonResidue(7)).toBe(6);
    expect(wilsonHolds(7)).toBe(true);
    expect(wilsonHolds(8)).toBe(false);
    expect(bertrandPrime(8)).toBe(11);
    expect(tenMod(3)).toBe(1);
    expect(tenMod(11)).toBe(10);
    expect(tensDigitChoicesDiv4(4)).toEqual([0, 2, 4, 6, 8]);
    expect(hammingDigits(3428, 3426)).toBe(1);
    expect(divisorCount(180)).toBe(18);
    expect(divisorCount(100)).toBe(9);
    expect(eulerLucky(0)).toBe(41);
    expect(alternatingDigitSum(918082, true).value % 11 === 0).toBe(true);
    expect(divisibilityTest(918082, 11).divisible).toBe(true);
    expect(divisibilityTest(75, 25).divisible).toBe(true);
    const three = vennThree(12, 18, 30);
    expect(three.abc.sort()).toEqual([2, 3]);
  });
});
