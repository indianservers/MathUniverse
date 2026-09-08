import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import TableValuesTargetLesson47 from "./TableValuesTargetLesson47";

describe("TableValuesTargetLesson47", () => {
  it("renders a dedicated linked table and graph", () => {
    const html = renderToStaticMarkup(
      <TableValuesTargetLesson47
        lesson={{ id: 47, title: "Table of Values" } as never}
        resetToken={0}
        onInteraction={vi.fn()}
      />,
    );
    expect(html).toContain('data-testid="2d-graphing-mockup-0139"');
    expect(html).toContain('data-dedicated-lesson="47"');
    expect(html).toContain('data-selected="5"');
    expect(html).toContain('aria-label="Drag selected table point"');
    expect(html).toContain("Second differences constant");
    expect(html).toContain("All second differences are 2");
  });
});
