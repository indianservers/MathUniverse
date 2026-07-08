import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { describe, expect, it } from "vitest";
import ARMathLab from "./ARMathLab";

function renderARMathLabRoute() {
  return renderToStaticMarkup(
    <MemoryRouter initialEntries={["/modules/ar-math-lab"]}>
      <Routes>
        <Route path="/modules/ar-math-lab" element={<ARMathLab />} />
      </Routes>
    </MemoryRouter>,
  );
}

describe("ARMathLab", () => {
  it("renders the Phase 6 route shell", () => {
    const html = renderARMathLabRoute();

    expect(html).toContain("AR Math Lab");
    expect(html).toContain("Create 3D math objects");
    expect(html).toContain("z = sin(x) * sin(y)");
    expect(html).toContain("AR Status");
    expect(html).toContain("Controls");
    expect(html).toContain("Advanced tools");
    expect(html).toContain("Performance Mode");
    expect(html).toContain("Measure");
    expect(html).toContain("Animate");
    expect(html).toContain("Practice");
    expect(html).toContain("Compare");
    expect(html).toContain("Scene");
    expect(html).toContain("Generate Graph");
    expect(html).toContain("Generate Solid");
    expect(html).toContain("Geometry Builder");
    expect(html).toContain("Graph settings");
    expect(html).toContain("Generated objects");
    expect(html).toContain("Start AR");
    expect(html).toContain("Camera");
    expect(html).toContain("3D Preview");
    expect(html).toContain("ARSessionManager");
  });
});
