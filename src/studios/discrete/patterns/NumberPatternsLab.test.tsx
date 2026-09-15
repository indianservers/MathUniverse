import { renderToString } from "react-dom/server";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import MockupStudioApp from "../../mockup/MockupStudioApp";

function renderPatterns(url: string) {
  return renderToString(
    <MemoryRouter initialEntries={[url]}>
      <MockupStudioApp studioId="discrete" />
    </MemoryRouter>,
  );
}

describe("Number Patterns Lab", () => {
  it("renders the figurate studio matching the lab chrome", () => {
    const html = renderPatterns("/discrete-world/number-patterns");
    expect(html).toContain("Number Patterns Lab");
    expect(html).toContain("Figurate Numbers");
    expect(html).toContain("Recursive Sequences");
    expect(html).toContain("Pascal Triangle");
    expect(html).toContain("Fractals");
    expect(html).toContain("Animate Build");
    expect(html).toContain("T_n = n(n+1)/2");
    expect(html).toContain("See how each new row adds one more point");
    expect(html).not.toContain("Demo only");
  });

  it("opens recursive, Pascal, and fractal modes from the URL", () => {
    const rec = renderPatterns("/discrete-world/number-patterns?mode=Recursive");
    expect(rec).toContain("Recursive Sequences");
    expect(rec).toContain("aₙ = a₁ + (n−1)d");
    expect(rec).toContain("If 2, 5, 8, ?, 14");

    const pascal = renderPatterns("/discrete-world/number-patterns?mode=Pascal+Triangle");
    expect(pascal).toContain("Pascal");
    expect(pascal).toContain("C(");
    expect(pascal).toContain("What is C(10,3)?");

    const fractals = renderPatterns("/discrete-world/number-patterns?mode=Fractals");
    expect(fractals).toContain("Sierpiński");
    expect(fractals).toContain("Koch");
    expect(fractals).toContain("filled triangles");
  });
});
