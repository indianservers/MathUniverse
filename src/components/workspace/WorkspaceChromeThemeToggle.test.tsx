import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import WorkspaceChromeThemeToggle from "./WorkspaceChromeThemeToggle";

describe("WorkspaceChromeThemeToggle", () => {
  it("exposes Default, Glow, and Light without changing other controls", () => {
    const markup = renderToStaticMarkup(
      <WorkspaceChromeThemeToggle theme="default" storageKey="test-chrome" onChange={() => undefined} />,
    );
    expect(markup).toContain("Default theme");
    expect(markup).toContain("Glow theme");
    expect(markup).toContain("Light theme");
    expect(markup).toContain('aria-pressed="true"');
  });
});
