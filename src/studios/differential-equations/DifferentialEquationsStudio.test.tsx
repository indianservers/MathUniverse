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
    expect((home.match(/class="de-lab-card tone-/g) ?? [])).toHaveLength(22);
    expect((home.match(/class="de-artwork"/g) ?? []).length).toBeGreaterThanOrEqual(22);
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
    expect(html("/differential-equations/explorer")).toContain("Equation explorer");
    expect(html("/differential-equations/method-selector")).toContain("Choose a method");
    expect(html("/differential-equations/exact")).toContain("Exactness");
    expect(html("/differential-equations/heun")).toContain("Improved Euler");
    expect(html("/differential-equations/slope-fields")).toContain("Slope fields");
    expect(home).toContain("Higher-order equations");
    expect(html("/differential-equations/higher-order-linear")).toContain("Characteristic roots");
    expect(html("/differential-equations/cauchy-euler")).toContain("Indicial equation");
    expect(html("/differential-equations/systems")).toContain("stable node");
    expect(html("/differential-equations/mechanical-oscillations")).toContain("Spring and mass");
    expect(html("/differential-equations/newton-cooling")).toContain("Temperature gap");
  });
});
