import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import WorkspaceChromeThemeToggle from "./WorkspaceChromeThemeToggle";

describe("WorkspaceChromeThemeToggle", () => {
  it("renders one compact control announcing the current theme", () => {
    const markup = renderToStaticMarkup(
      <WorkspaceChromeThemeToggle theme="default" storageKey="test-chrome" onChange={() => undefined} />,
    );
    expect(markup).toContain("Theme: Dark");
    expect(markup.match(/<button/g)).toHaveLength(1);
    expect(markup).toContain("studio-theme-button");
  });
});
