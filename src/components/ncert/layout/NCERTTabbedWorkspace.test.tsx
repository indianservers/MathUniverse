import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import NCERTTabbedWorkspace from "./NCERTTabbedWorkspace";

describe("NCERTTabbedWorkspace", () => {
  it("renders accessible tabs and only the active panel content", () => {
    const html = renderToStaticMarkup(
      <NCERTTabbedWorkspace
        ariaLabel="Demo tabs"
        tabs={[
          { id: "visual", label: "Visual Lab", content: <p>visual content</p> },
          { id: "practice", label: "Practice", content: <p>practice content</p> },
        ]}
      />,
    );

    expect(html).toContain('role="tablist"');
    expect(html).toContain('role="tab"');
    expect(html).toContain('role="tabpanel"');
    expect(html).toContain("Visual Lab");
    expect(html).toContain("Practice");
    expect(html).toContain("visual content");
    expect(html).not.toContain("practice content");
  });
});
