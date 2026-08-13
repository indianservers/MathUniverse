import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import { mathWorkspaces } from "../../workspace/mathWorkspaces";
import MathWorkspaceLayout from "./MathWorkspaceLayout";

describe("MathWorkspaceLayout", () => {
  it.each(mathWorkspaces)("renders shared responsive controls for $name", (workspace) => {
    const markup = renderToStaticMarkup(
      <MemoryRouter initialEntries={[workspace.route]}>
        <MathWorkspaceLayout workspace={workspace}>
          <main aria-label={`${workspace.name} primary activity`}>Primary activity</main>
        </MathWorkspaceLayout>
      </MemoryRouter>,
    );

    expect(markup).toContain(`data-workspace="${workspace.id}"`);
    expect(markup).toContain(`${workspace.name} workspace controls`);
    expect(markup).toContain("math-workspace-mobile-dock");
    expect(markup).toContain("Primary activity");
    expect(markup).toContain("workspace-suite-bar");
  });
});
