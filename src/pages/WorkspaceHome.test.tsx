import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import { mathWorkspaces } from "../workspace/mathWorkspaces";
import WorkspaceHome from "./WorkspaceHome";

describe("Workspace Home", () => {
  it("presents exactly the six canonical workspace tools", () => {
    const html = renderToStaticMarkup(<MemoryRouter><WorkspaceHome /></MemoryRouter>);
    expect(mathWorkspaces).toHaveLength(6);
    expect(html).toContain("One workspace.");
    for (const workspace of mathWorkspaces) {
      expect(html).toContain(workspace.name);
      expect(html).toContain(`href="${workspace.route}"`);
    }
    expect(html).not.toContain("Teacher Studio");
    expect(html).not.toContain("Main Menu");
  });
});
