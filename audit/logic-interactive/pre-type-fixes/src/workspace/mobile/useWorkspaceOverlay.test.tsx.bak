import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import WorkspaceToolbar from "./WorkspaceToolbar";
import { nextWorkspaceOverlay } from "./useWorkspaceOverlay";
import { isOutsideDismissTarget } from "./useOutsideDismiss";

describe("mobile workspace overlay", () => {
  it("toggles the same panel closed without reopening", () => {
    expect(nextWorkspaceOverlay(null, "menu")).toBe("menu");
    expect(nextWorkspaceOverlay("menu", "menu")).toBe(null);
  });

  it("keeps only one major panel open", () => {
    expect(nextWorkspaceOverlay("tools", "objects")).toBe("objects");
    expect(nextWorkspaceOverlay("objects", "tools")).toBe("tools");
  });
});

describe("outside dismiss", () => {
  it("keeps the open panel when the tap is inside it", () => {
    const root = { contains: () => true } as unknown as HTMLElement;
    const panel = {
      closest: (selector: string) =>
        selector.includes("[data-mws-panel]") ? {} : null,
    };
    expect(isOutsideDismissTarget(panel, "[data-mws-panel]", root)).toBe(
      false,
    );
  });

  it("dismisses when the tap is on the canvas", () => {
    const root = { contains: () => true } as unknown as HTMLElement;
    const canvas = { closest: () => null };
    expect(isOutsideDismissTarget(canvas, "[data-mws-panel]", root)).toBe(
      true,
    );
  });
});

describe("workspace toolbar", () => {
  it("marks the active tool with pressed state and mode data", () => {
    const html = renderToStaticMarkup(
      <WorkspaceToolbar
        label="Graph workspace tools"
        items={[
          {
            id: "trace",
            label: "Trace",
            icon: <span>T</span>,
            active: true,
            onSelect: () => undefined,
          },
          {
            id: "more",
            label: "More",
            icon: <span>M</span>,
            pressed: true,
            onSelect: () => undefined,
          },
        ]}
      />,
    );
    expect(html).toContain('aria-pressed="true"');
    expect(html).toContain('data-tool-state="mode"');
    expect(html).toContain('data-tool-state="open"');
    expect(html).toContain("data-mws-toolbar");
    expect(html).toContain("Trace");
  });
});
