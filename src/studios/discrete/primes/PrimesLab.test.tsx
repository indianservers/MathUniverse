import { renderToString } from "react-dom/server";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import { studioMockups } from "../../mockup/studioMockupCatalog";
import PrimesLab from "./PrimesLab";
import { greedyFactorLeaves, greedyFactorPair } from "./primesMath";

const page = studioMockups.discrete!.pages.find((item) => item.id === "primes")!;

function renderPrimes(url: string) {
  return renderToString(
    <MemoryRouter initialEntries={[url]}>
      <PrimesLab page={page} />
    </MemoryRouter>,
  );
}

describe("Factors, Primes & Divisibility Lab", () => {
  it("keeps discrete chrome and animatable sieve at the default tab", () => {
    const html = renderPrimes("/discrete-world/primes");
    expect(html).toContain("Sieve of Eratosthenes");
    expect(html).toContain("Unprocessed");
    expect(html).toContain("Current prime");
    expect(html).toContain("Neither");
    expect(html).toContain("Jump to next prime");
    expect(html).toContain("Select Prime");
    expect(html).not.toContain("Demo only");
  });

  it("renders a sized factor tree for 84 with accurate split pairs", () => {
    const tree = renderPrimes("/discrete-world/primes?mode=Factor+Tree");
    expect(tree).toContain("Choose a factor pair to grow the tree");
    expect(tree).toContain('viewBox="0 0 320 180"');
    expect(tree).toContain(">84</text>");
    expect(tree).toContain('r="40"');
    expect(greedyFactorPair(84)).toEqual([2, 42]);
    expect(greedyFactorLeaves(84).reduce((a, b) => a * b, 1)).toBe(84);

    const gcd = renderPrimes("/discrete-world/primes?mode=GCD+%26+LCM");
    expect(gcd).toContain("GCD &amp; LCM");
    expect(gcd).toContain("hidden until the method finishes");
    expect(gcd).toContain('viewBox="0 0 640 360"');
    expect(gcd).toContain("84 and 60");
    expect(gcd).toContain("COMMON");

    const rules = renderPrimes("/discrete-world/primes?mode=Divisibility+Rules");
    expect(rules).toContain("Build-a-number");

    const patterns = renderPrimes("/discrete-world/primes?mode=Prime+Patterns");
    expect(patterns).toContain("Ulam Spiral");
    expect(patterns).toContain("π(n) hidden for the challenge");
  });
});
