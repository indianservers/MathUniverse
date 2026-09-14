import { renderToString } from "react-dom/server";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import MockupStudioApp from "../../mockup/MockupStudioApp";

function renderCircles(url: string) {
  return renderToString(
    <MemoryRouter initialEntries={[url]}>
      <MockupStudioApp studioId="geometry" />
    </MemoryRouter>,
  );
}

describe("Circles Lab modes", () => {
  it("defaults to Chords and keeps Geometry Studio chrome", () => {
    const html = renderCircles("/geometry/circles");
    expect(html).toContain("Circles Lab");
    expect(html).toContain("Explore circle geometry through constructions, measurements and dynamic relationships.");
    expect(html).toContain("Geometry Studio");
    expect(html).toContain("Equal chords, bisectors and distances");
    expect(html).toContain("aria-selected=\"true\"");
    expect(html).toContain("Chord construction with circle centre O");
    expect(html).toContain("Distance OM");
  });

  it("opens each documented mode URL with a distinct construction", () => {
    const chords = renderCircles("/geometry/circles?mode=Chords");
    const tangents = renderCircles("/geometry/circles?mode=Tangents");
    const angles = renderCircles("/geometry/circles?mode=Angles");
    const power = renderCircles("/geometry/circles?mode=Power%20of%20a%20Point");
    const arcs = renderCircles("/geometry/circles?mode=Arcs%20%26%20Sectors");

    expect(chords).toContain("Chord controls");
    expect(chords).toContain("Lock equal chords");

    expect(tangents).toContain("Tangent construction with contact point T");
    expect(tangents).toContain("Tangent controls");
    expect(tangents).toContain("External point mode");
    expect(tangents).toContain("Distance OP");

    expect(angles).toContain("Circle angle explorer");
    expect(angles).toContain("Inscribed ∠ACB");
    expect(angles).toContain("Central ∠AOB");

    expect(power).toContain("Power of a point laboratory");
    expect(power).toContain("PA × PB");
    expect(power).toContain("Power of P");

    expect(arcs).toContain("Arc and sector explorer");
    expect(arcs).toContain("Sector area");
    expect(arcs).toContain("Animate sector sweep");
  });

  it("accepts canonical keys, sub-modes, and studio tools", () => {
    expect(renderCircles("/geometry/circles?mode=power")).toContain("Power of a point laboratory");
    expect(renderCircles("/geometry/circles?mode=arcs")).toContain("Arc and sector explorer");
    expect(renderCircles("/geometry/circles?mode=Angles&kind=cyclic")).toContain("Cyclic Quadrilateral");
    expect(renderCircles("/geometry/circles?mode=power&kind=radical")).toContain("Radical Axis");
    expect(renderCircles("/geometry/circles?mode=Chords")).toContain("Teacher mode");
    expect(renderCircles("/geometry/circles?mode=Chords")).toContain("Snap to 30");
    expect(renderCircles("/geometry/circles?mode=Chords")).toContain("Copy share URL");
  });
});