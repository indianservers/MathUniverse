import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import IntegrationAreaVisualizerPage from "./IntegrationAreaVisualizerPage";

describe("Integration Area Studio controls", () => {
  it("renders purposeful controls and the requested URL state", () => {
    const html = renderToStaticMarkup(
      <MemoryRouter initialEntries={["/math/integration?v_function=x%5E2&v_g_function=x&v_lower_a=-2&v_upper_b=4&v_partitions_n=50&v_method=midpoint&v_between_curves=0&v_mode=area"]}>
        <IntegrationAreaVisualizerPage />
      </MemoryRouter>,
    );
    for (const label of ["Area", "Approximation", "Between Curves", "3D Solids", "Plot", "Swap", "Left", "Midpoint", "Right", "Trapezoid", "Simpson", "Animate partitions", "Restart", "Reset all", "Pan", "Zoom in", "Zoom out", "Grid", "Trace", "Labels", "Full screen", "Visual", "Steps", "Intuition", "Common mistake"]) {
      expect(html).toContain(label);
    }
    expect(html).toContain("n = 50");
    expect(html).toContain("b = 4");
    expect(html).toContain("Teacher mode");
    expect(html).toContain("Toggle theme");
  });
});
