import { renderToString } from "react-dom/server";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import MockupStudioApp from "../../mockup/MockupStudioApp";
import { parsePolygonMode } from "./polygonMode";

describe("Polygons Lab", () => {
  it("renders five distinct modes from URL aliases", () => {
    const regular = renderToString(<MemoryRouter initialEntries={["/geometry/polygons?mode=regular"]}><MockupStudioApp studioId="geometry" /></MemoryRouter>);
    expect(regular).toContain("Polygons Lab");
    expect(regular).toContain("Build &amp; explore regular n-gons");
    expect(regular).toContain("Regular polygon");
    expect(regular).toContain("Apothem");
    expect(regular).toContain("Create a polygon with exterior angle");

    const angles = renderToString(<MemoryRouter initialEntries={["/geometry/polygons?mode=Interior%20Angles"]}><MockupStudioApp studioId="geometry" /></MemoryRouter>);
    expect(angles).toContain("Triangulation proof");
    expect(angles).toContain("Interior angle sum");
    expect(angles).toContain("900°");

    const tess = renderToString(<MemoryRouter initialEntries={["/geometry/polygons?mode=tessellation"]}><MockupStudioApp studioId="geometry" /></MemoryRouter>);
    expect(tess).toContain("Why does this tessellate");
    expect(tess).toContain("Triangle");
    expect(tess).toContain("Tile");
    expect(tess).toContain("Expand from Center");
    expect(tess).toContain("Perfect tessellation");

    const area = renderToString(<MemoryRouter initialEntries={["/geometry/polygons?mode=area"]}><MockupStudioApp studioId="geometry" /></MemoryRouter>);
    expect(area).toContain("n congruent triangles from O");
    expect(area).toContain("approximately 50");

    const diagonals = renderToString(<MemoryRouter initialEntries={["/geometry/polygons?mode=diagonals"]}><MockupStudioApp studioId="geometry" /></MemoryRouter>);
    expect(diagonals).toContain("exactly 20 diagonals");
    expect(diagonals).toContain("Fan triangulation");
  });

  it("defaults to regular and accepts display names", () => {
    expect(parsePolygonMode(null)).toBe("regular");
    expect(parsePolygonMode("Regular Polygon")).toBe("regular");
    const html = renderToString(<MemoryRouter initialEntries={["/geometry/polygons"]}><MockupStudioApp studioId="geometry" /></MemoryRouter>);
    expect(html).toContain("Regular octagon");
    expect(html).toContain("Skip to figure");
    expect(html).toContain("/geometry/triangles");
    expect(html).toContain("/shapes?shape=hexagon");
    expect(html).toContain("Build &amp; explore regular n-gons");
    expect(html).toContain("role=\"tablist\"");
  });
});
