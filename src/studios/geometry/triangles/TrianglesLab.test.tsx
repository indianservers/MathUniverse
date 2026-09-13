import { renderToString } from "react-dom/server";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import MockupStudioApp from "../../mockup/MockupStudioApp";

function render(url: string) {
  return renderToString(
    <MemoryRouter initialEntries={[url]}>
      <MockupStudioApp studioId="geometry" />
    </MemoryRouter>,
  );
}

describe("Triangles Lab", () => {
  it("keeps Geometry Studio chrome and names the lab correctly", () => {
    const html = render("/geometry/triangles");
    expect(html).toContain("Geometry Studio");
    expect(html).toContain("Triangles Lab");
    expect(html).toContain("Explore triangle geometry through dynamic constructions");
    expect(html).toContain("Triangle Explorer");
    expect(html).toContain("Sides, angles, area");
    expect(html).toContain("aria-pressed=\"true\"");
  });

  it("renders five distinct mode environments from canonical URLs and aliases", () => {
    const explorer = render("/geometry/triangles?mode=explorer");
    expect(explorer).toContain("Draggable triangle ABC");
    expect(explorer).toContain("By sides:");
    expect(explorer).toContain("Create an isosceles triangle with apex angle 40°.");
    expect(explorer).not.toContain("SSA (not a test)");

    const congruence = render("/geometry/triangles?mode=Congruence");
    expect(congruence).toContain("Two corresponding triangles");
    expect(congruence).toContain("SSS");
    expect(congruence).toContain("SAS");
    expect(congruence).toContain("SSA (not a test)");
    expect(congruence).toContain("Construct a pair congruent by SAS.");
    expect(congruence).not.toContain("Draggable triangle ABC");

    const similarity = render("/geometry/triangles?mode=similarity");
    expect(similarity).toContain("Similar triangles ABC and DEF");
    expect(similarity).toContain("Scale factor k");
    expect(similarity).toContain("Area ratio = k²");
    expect(similarity).toContain("Make △DEF exactly 1.5× △ABC.");

    const centers = render("/geometry/triangles?mode=centers");
    expect(centers).toContain("Triangle centers construction");
    expect(centers).toContain("Circumcenter");
    expect(centers).toContain("AG : GM");
    expect(centers).toContain("Move the triangle until the circumcenter lies outside.");

    const inequalities = render("/geometry/triangles?mode=inequalities");
    expect(inequalities).toContain("Triangle inequality construction");
    expect(inequalities).toContain("VALID TRIANGLE");
    expect(inequalities).toContain("a + b &gt; c");
    expect(inequalities).toContain("Create side lengths where the triangle just becomes degenerate.");
  });
});
