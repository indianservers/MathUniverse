import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import MockupStudioApp from "../mockup/MockupStudioApp";
import DifferentialEquationsHome from "./DifferentialEquationsHome";
import { differentialEquationRouteFor } from "./routes";
import { studioMockups } from "../mockup/studioMockupCatalog";

function html(route: string) {
  return renderToStaticMarkup(
    <MemoryRouter initialEntries={[route]}>
      <MockupStudioApp studioId="differential-equations" />
    </MemoryRouter>,
  );
}

describe("Differential Equations Studio", () => {
  it("keeps the featured cards and gives every lab an illustrated launch card", () => {
    const home = renderToStaticMarkup(
      <MemoryRouter><DifferentialEquationsHome studio={studioMockups["differential-equations"]} /></MemoryRouter>,
    );
    expect((home.match(/class="de-feature-card/g) ?? [])).toHaveLength(12);
    expect((home.match(/class="de-lab-card tone-/g) ?? [])).toHaveLength(25);
    expect((home.match(/class="de-artwork"/g) ?? []).length).toBeGreaterThanOrEqual(25);
    for (const id of studioMockups["differential-equations"].pages.filter((item) => item.id !== "home").map((item) => item.id)) {
      expect(home).toContain(`data-lab-id="${id}"`);
    }
    expect(differentialEquationRouteFor("explorer")).toBe("/differential-equations/equation-explorer");
    expect(differentialEquationRouteFor("slope-fields")).toBe("/differential-equations/direction-fields");
    expect(differentialEquationRouteFor("homogeneous-first-order")).toBe("/differential-equations/homogeneous");
    expect(differentialEquationRouteFor("growth-models")).toBe("/differential-equations/growth");
    expect(differentialEquationRouteFor("mechanical-oscillations")).toBe("/differential-equations/oscillations");
  });

  it("renders the studio home and routes each first-order lab", () => {
    const home = html("/differential-equations");
    expect(home).toContain("Differential Equations Studio");
    expect(home).toContain("First-order equations");
    expect(home).toContain("/differential-equations/exact");
    expect(html("/differential-equations/explorer")).toContain("Solution Curves and Direction Field");
    expect(html("/differential-equations/method-selector")).toContain("Analyze Your Equation");
    expect(html("/differential-equations/exact")).toContain("Exactness Test");
    expect(html("/differential-equations/heun")).toContain("Heun Approximation");
    expect(html("/differential-equations/slope-fields")).toContain("Interactive Canvas");
    expect(home).toContain("Higher-order equations");
    expect(html("/differential-equations/higher-order-linear")).toContain("Characteristic Equation");
    expect(html("/differential-equations/cauchy-euler")).toContain("Indicial equation");
    expect(html("/differential-equations/systems")).toContain("stable spiral");
    expect(html("/differential-equations/mechanical-oscillations")).toContain("Spring–Mass System");
    expect(html("/differential-equations/newton-cooling")).toContain("Temperature Over Time");
  });
});
