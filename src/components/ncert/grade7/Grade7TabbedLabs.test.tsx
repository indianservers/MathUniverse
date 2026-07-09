import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import Grade7ConstructionsTilingsLab from "./Grade7ConstructionsTilingsLab";

describe("Grade 7 tabbed NCERT labs", () => {
  it("renders the compact scaffold tabs for a Grade 7 lab", () => {
    const html = renderToStaticMarkup(<Grade7ConstructionsTilingsLab />);

    expect(html).toContain("Constructions and Tilings");
    expect(html).toContain("Explore");
    expect(html).toContain("Visual Model");
    expect(html).toContain("Common Mistakes");
    expect(html).toContain("Teacher Notes");
    expect(html).toContain('role="tablist"');
  });
});
