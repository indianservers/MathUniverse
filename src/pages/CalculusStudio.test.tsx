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
    expect(html).toContain("Unlock Pro");
    expect(html).toContain("Learning journey");
    expect(html).toContain("Daily visual challenge");
    expect(html).toContain("Try it now");
    expect(html).toContain("View hint");
    expect(html).toContain("Streak:");
    expect(html).toContain("Why visualize?");
    expect(html).toContain("See the math");
    expect(html).toContain("Explore freely");
    expect(html).toContain("Master concepts");
    expect(html).toContain("Derivative Applications");
    expect(html).toContain("Integration Techniques");
    expect(html).toContain("Advanced Calculus surface");
    expect(html).toContain("Multivariable surface and vector field");
    expect(html).toContain("/calculus/advanced");
    expect(html).not.toContain("Your answer");
    expect(html).not.toContain("Check answer");
  });

  it("keeps dedicated lab routes interactive", () => {
    const limits = renderToStaticMarkup(
      <MemoryRouter initialEntries={["/calculus/limits"]}>
        <CalculusStudio page="limits" />
      </MemoryRouter>,
    );
    expect(limits).toContain("Limits");
    expect(limits).toContain("Live Results");
    expect(limits).toContain("Main");

    const de = renderToStaticMarkup(
      <MemoryRouter initialEntries={["/calculus/differential-equations"]}>
        <CalculusStudio page="differential-equations" />
      </MemoryRouter>,
    );
    expect(de).toContain("Slope Fields");
    expect(de).toContain("Separable");
    expect(de).toContain("data-de-mode=\"slope\"");
    expect(de).toContain("Numerical steps (RK4)");
    expect(de).toContain("de-learn-Observe");
  });

  it("switches every differential-equation mode canvas", () => {
    const modes = {
      slope: "Slope field with Euler, RK4, and exact",
      ivp: "Unique IVP solution on the field",
      separable: "Separated solution y = y₀ e^{kt}",
      growth: "Logistic curve approaching K",
      euler: "Euler polygonal steps",
      rk4: "RK4 versus Euler and exact",
    } as const;
    for (const [mode, title] of Object.entries(modes)) {
      const html = renderToStaticMarkup(
        <MemoryRouter initialEntries={[`/calculus/differential-equations?mode=${mode}`]}>
          <CalculusStudio page="differential-equations" />
        </MemoryRouter>,
      );
      expect(html, mode).toContain(`data-de-mode="${mode}"`);
      expect(html, mode).toContain(`data-lab-mode="${mode}"`);
      expect(html, mode).toContain(title);
      expect(html, mode).toContain("de-learn-Challenge");
    }
    const separable = renderToStaticMarkup(
      <MemoryRouter initialEntries={["/calculus/differential-equations?mode=separable"]}>
        <CalculusStudio page="differential-equations" />
      </MemoryRouter>,
    );
    expect(separable).toContain("Rate k");
    expect(separable).toContain("dy/y");
    expect(separable).not.toContain("Click the slope field to set");

    const growth = renderToStaticMarkup(
      <MemoryRouter initialEntries={["/calculus/differential-equations?mode=growth"]}>
        <CalculusStudio page="differential-equations" />
      </MemoryRouter>,
    );
    expect(growth).toContain("Capacity K");
    expect(growth).toContain("carrying capacity");
  });

  it("switches series and integral-application canvases with mode", () => {
    const polar = renderToStaticMarkup(
      <MemoryRouter initialEntries={["/calculus/series-parametric-polar?mode=polar"]}>
        <CalculusStudio page="series-parametric-polar" />
      </MemoryRouter>,
    );
    expect(polar).toContain("Polar trace r = 1 + cos(theta)");
    expect(polar).toContain("data-lab-mode=\"polar\"");

    const convergence = renderToStaticMarkup(
      <MemoryRouter initialEntries={["/calculus/series-parametric-polar?mode=convergence"]}>
        <CalculusStudio page="series-parametric-polar" />
      </MemoryRouter>,
    );
    expect(convergence).toContain("Geometric partial sums");

    const work = renderToStaticMarkup(
      <MemoryRouter initialEntries={["/calculus/integral-applications?mode=work"]}>
        <CalculusStudio page="integral-applications" />
      </MemoryRouter>,
    );
    expect(work).toContain("Work W = ∫ F(x) dx");
    expect(work).toContain("data-lab-mode=\"work\"");
  });
});
