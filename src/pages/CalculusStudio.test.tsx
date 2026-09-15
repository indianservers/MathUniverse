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

    const de = renderToStaticMarkup(
      <MemoryRouter initialEntries={["/calculus/differential-equations"]}>
        <CalculusStudio page="differential-equations" />
      </MemoryRouter>,
    );
    expect(de).toContain("Slope field");
    expect(de).toContain("Numerical steps (RK4)");
  });
});
