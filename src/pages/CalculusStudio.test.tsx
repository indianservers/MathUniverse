import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import CalculusStudio from "./CalculusStudio";

describe("Calculus studio mockup chrome", () => {
  it("renders the home journey, launch labs, and daily challenge", () => {
    const html = renderToStaticMarkup(
      <MemoryRouter initialEntries={["/calculus"]}>
        <CalculusStudio page="home" />
      </MemoryRouter>,
    );
    expect(html).toContain("The Calculus Journey");
    expect(html).toContain("Launch an experiment");
    expect(html).toContain("Save this studio");
    expect(html).toContain("Learning journey");
    expect(html).toContain("Daily visual challenge");
    expect(html).toContain("Try it now");
    expect(html).toContain("Streak:");
    expect(html).toContain("Why visualize?");
    expect(html).toContain("Observe");
    expect(html).toContain("Derivative Applications");
    expect(html).toContain("Integration Techniques");
    expect(html).toContain("Advanced Calculus surface");
    expect(html).toContain("Multivariable surface and vector field");
    expect(html).toContain("/calculus/advanced");
    expect(html).toContain("Save this studio");
    expect(html).toContain("Check answer");
    expect(html).toContain("Your answer");
    expect(html).toContain("50+ UI, UX, and content upgrades");
    expect(html).toContain("d⁄dx Derivatives");
    expect(html).toContain("cs-sidebar-nav");
  });

  it("keeps dedicated lab routes interactive", () => {
    const limits = renderToStaticMarkup(
      <MemoryRouter initialEntries={["/calculus/limits"]}>
        <CalculusStudio page="limits" />
      </MemoryRouter>,
    );
    expect(limits).toContain("Limits");
    expect(limits).toContain("Live Results");
    expect(limits).toContain("ε–δ rectangle overlay");
    expect(limits).toContain("UI, UX, and content upgrades");

    const de = renderToStaticMarkup(
      <MemoryRouter initialEntries={["/calculus/differential-equations"]}>
        <CalculusStudio page="differential-equations" />
      </MemoryRouter>,
    );
    expect(de).toContain("Slope field");
    expect(de).toContain("Numerical steps (RK4)");
  });
});
