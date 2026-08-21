import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { PORTABLE_WORKSPACE_TYPES, type PortableWorkspaceAdapter } from "../../workspace/portableWorkspace";
import ShareExportControl from "./ShareExportControl";

describe("ShareExportControl", () => {
  it.each(PORTABLE_WORKSPACE_TYPES)("renders an accessible, unobtrusive trigger for %s", workspaceType => {
    const adapter: PortableWorkspaceAdapter = {
      workspaceType, engine: "test", engineVersion: "1", title: () => "Test", serializeScene: () => ({}),
      deserializeScene: () => undefined, getImageTarget: () => null, getSceneSummary: () => ({ objectCount: 0, expressionCount: 0 }),
    };
    const markup = renderToStaticMarkup(<ShareExportControl adapter={adapter} />);
    expect(markup).toContain('aria-label="Share or export"');
    expect(markup).toContain('title="Share or export"');
    expect(markup).toContain("portable-share-trigger");
  });
});
