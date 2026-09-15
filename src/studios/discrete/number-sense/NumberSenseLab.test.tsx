import { renderToString } from "react-dom/server";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import MockupStudioApp from "../../mockup/MockupStudioApp";

function renderSense(url: string) {
  return renderToString(
    <MemoryRouter initialEntries={[url]}>
      <MockupStudioApp studioId="discrete" />
    </MemoryRouter>,
  );
}

describe("Number Sense lab", () => {
  it("renders integer controls, unit hops, and a distinct challenge", () => {
    const html = renderSense("/discrete-world/number-sense?mode=Integers");
    expect(html).toContain("Integers on a number line");
    expect(html).toContain("data-lab-mode=\"Integers\"");
    expect(html).toContain("Compare −7 and −2");
    expect(html).toContain("Which is greater, −7 or −2?");
    expect(html).toContain("Watch the unit ticks");
    expect(html).toContain("unit hops");
    expect(html).toContain("ns-board-proof");
    expect(html).toContain("Count the orange hops");
    expect(html).not.toContain("Place fractions.");
    expect(html).not.toContain("1 or √2/2");
    expect(html).not.toContain("|7-2|");
  });

  it("opens each catalog mode from the URL with unique figures", () => {
    const fractions = renderSense("/discrete-world/number-sense?mode=Fractions");
    expect(fractions).toContain('data-lab-mode="Fractions"');
    expect(fractions).toContain('data-mode-canvas="Fractions"');
    expect(fractions).toContain("3/5 vs 2/3");
    expect(fractions).toContain("Which is larger, 3/5 or 2/3?");

    const decimals = renderSense("/discrete-world/number-sense?mode=Decimals");
    expect(decimals).toContain("1/10 = 0.1");
    expect(decimals).toContain("Which is larger, 0.7 or 0.65?");
    expect(decimals).toContain("ones");

    const ratios = renderSense("/discrete-world/number-sense?mode=Ratios");
    expect(ratios).toContain("double number line");
    expect(ratios).toContain("Simplify 12:18");
    expect(ratios).toContain("order matters");
    expect(ratios).toContain("Pair");
    expect(ratios).not.toContain(">2 &lt; 3<");
    expect(ratios).toContain("Tape");
    expect(ratios).toContain("Equivalent ratio table");

    const powers = renderSense("/discrete-world/number-sense?mode=Powers");
    expect(powers).toContain("2^{");
    expect(powers).toContain("What is 2⁴?");
    expect(powers).toContain("Linear axis");

    const scales = renderSense("/discrete-world/number-sense?mode=Scales");
    expect(scales).toContain("Map scale is a ratio");
    expect(scales).toContain("what does 3 cm represent?");
    expect(scales).toContain("km per cm");
    expect(scales).toContain("Powers of 10 zoom");
  });
});
