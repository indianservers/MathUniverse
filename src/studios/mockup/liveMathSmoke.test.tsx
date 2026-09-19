import { renderToString } from "react-dom/server";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import NumberSystems from "../../pages/NumberSystems";
import MockupStudioApp from "./MockupStudioApp";

function html(route: string, studioId: string) {
  return renderToString(<MemoryRouter initialEntries={[route]}><MockupStudioApp studioId={studioId} /></MemoryRouter>);
}

describe("live math lab smoke", () => {
  it("computes modelling canvases from live state", () => {
    const motion = html("/mathematical-modelling/motion", "modelling");
    expect(motion).toContain('aria-label="Scenario"');
    expect(motion).not.toContain("Overall R²</b>0.97");
    const epi = html("/mathematical-modelling/epidemics?mode=SEIR", "modelling");
    expect(epi).toContain(">E ");
    expect(epi).toContain("Live metrics (Day");
    expect(epi).toContain("<span>Day</span>");
    expect(html("/mathematical-modelling/numerical?mode=Random+Walk", "modelling")).toContain("Random walk");
    expect(html("/mathematical-modelling/numerical?mode=Iteration", "modelling")).toContain("Iteration orbit");
    expect(html("/mathematical-modelling/finance", "modelling")).toContain("Future value (nominal)");
    expect(html("/mathematical-modelling/population?mode=Age+Structured", "modelling")).toContain("Youth");
  });

  it("computes statistics and discrete live values", () => {
    expect(html("/probability-statistics/data-explorer?set=dice", "statistics")).toContain("Dice faces");
    expect(html("/probability-statistics/clt", "statistics")).toContain("SE = 10/√n");
    expect(html("/probability-statistics/anova", "statistics")).toContain("F = MSB/MSW");
    expect(html("/discrete-world/sets", "discrete")).toContain("|A ∪ B| for A={1,2,3}");
    expect(html("/discrete-world/graphs?mode=Coloring", "discrete")).toContain("tab=algorithms");
    expect(html("/discrete-world/graphs?mode=Connectivity", "discrete")).toContain("tab=properties");
    expect(html("/geometry/ar?mode=Point", "geometry")).toContain("POINT TOOL");
  });

  it("mentions live p/q on the rational check", () => {
    const ns = renderToString(<MemoryRouter initialEntries={["/number-systems/rational"]}><NumberSystems /></MemoryRouter>);
    expect(ns).toContain("live p/q is");
  });
});
