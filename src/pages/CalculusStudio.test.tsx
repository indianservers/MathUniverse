import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import CalculusStudio from "./CalculusStudio";

describe("Calculus studio mockup chrome", () => {
  it("renders the Complex-style learning home", () => {
    const html = renderToStaticMarkup(
      <MemoryRouter initialEntries={["/calculus"]}>
        <CalculusStudio page="home" />
      </MemoryRouter>,
    );
    expect(html).toContain("Welcome to Calculus Studio");
    expect(html).toContain("Explore by topic");
    expect(html).toContain("Continue experiment");
    expect(html).toContain("Your learning journey");
    expect(html).toContain("Challenge of the day");
    expect(html).toContain("Take challenge");
    expect(html).toContain("Topics explored");
    expect(html).toContain("Search topics, e.g. limits, FTC, Taylor series...");
    expect(html).toContain("Observe");
    expect(html).toContain("Understand");
    expect(html).toContain("Why");
    expect(html).toContain("Try");
    expect(html).toContain("Challenge");
    expect(html).toContain("Limits");
    expect(html).toContain("Multivariable");
    expect(html).toContain("/calculus/multivariable-vector");
    expect(html).toContain("50+ UI, UX, and content upgrades");
    expect(html).toContain("cs-sidebar-nav");
    expect(html).not.toContain("Unlock Pro");
    expect(html).not.toContain("The Calculus Journey");
    expect(html).not.toContain("Launch an experiment");
    expect(html).not.toContain("cube roots");
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
    expect(limits).toContain("Unlock Pro");
    expect(limits).toContain("ε–δ rectangle overlay");
    expect(limits).toContain("UI, UX, and content upgrades");

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
