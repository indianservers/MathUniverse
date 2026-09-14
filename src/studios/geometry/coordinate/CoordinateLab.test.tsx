import { renderToString } from "react-dom/server";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import MockupStudioApp from "../../mockup/MockupStudioApp";
import { parseCoordMode } from "./coordinateMode";

describe("Coordinate Geometry Lab", () => {
  it("renders the mockup workspace with live AB distance and line forms", () => {
    const html = renderToString(
      <MemoryRouter initialEntries={["/geometry/coordinate"]}>
        <MockupStudioApp studioId="geometry" />
      </MemoryRouter>,
    );
    expect(html).toContain("Coordinate Geometry Lab");
    expect(html).toContain("Explore analytic geometry with points, lines, equations, or loci.");
    expect(html).toContain("−3");
    expect(html).toContain("7.61577");
    expect(html).toContain("x − 2y = -2");
    expect(html).toContain("x − y = 2");
    expect(html).toContain("Snap to Grid");
    expect(html).toContain("Live Object Tree");
    expect(html).toContain("Measurements");
    expect(html).toContain("Find the locus of points equidistant from A and B.");
  });

  it("switches modes from the URL", () => {
    expect(parseCoordMode(null)).toBe("distance");
    expect(parseCoordMode("Section Formula")).toBe("section");
    const locus = renderToString(
      <MemoryRouter initialEntries={["/geometry/coordinate?mode=locus"]}>
        <MockupStudioApp studioId="geometry" />
      </MemoryRouter>,
    );
    expect(locus).toContain('value="locus"');
    expect(locus).toContain("perpendicular bisector");
  });
});
