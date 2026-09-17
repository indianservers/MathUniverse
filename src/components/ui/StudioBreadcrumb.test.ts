import { describe, expect, it } from "vitest";
import { mathStudioCrumbs, resolveStudioCrumbs } from "./StudioBreadcrumb";

describe("StudioBreadcrumb trails", () => {
  it("links Home, Mathematics, the studio, and the current tab", () => {
    const crumbs = mathStudioCrumbs(
      { label: "Linear Algebra", to: "/linear-algebra" },
      { label: "Eigenvectors", to: "/linear-algebra?mode=eigenvectors" },
    );
    expect(crumbs.map((item) => `${item.label}:${item.to}`)).toEqual([
      "Home:/",
      "Mathematics:/learn",
      "Linear Algebra:/linear-algebra",
      "Eigenvectors:/linear-algebra?mode=eigenvectors",
    ]);
  });

  it("maps shell labels and inserts Mathematics after Home", () => {
    const crumbs = resolveStudioCrumbs(["Home", "Studio", "Combinatorics"], "/combinatorics");
    expect(crumbs.map((item) => item.to)).toEqual(["/", "/learn", "/math-lab", "/combinatorics"]);
  });
});
