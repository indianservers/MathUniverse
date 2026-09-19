import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import {
  PORTABLE_WORKSPACE_TYPES,
  type PortableWorkspaceAdapter,
} from "../../workspace/portableWorkspace";
import ShareExportControl from "./ShareExportControl";

describe("ShareExportControl", () => {
  it.each(PORTABLE_WORKSPACE_TYPES)(
    "renders an accessible, unobtrusive trigger for %s",
    (workspaceType) => {
      const adapter: PortableWorkspaceAdapter = {
        workspaceType,
        engine: "test",
        engineVersion: "1",
        title: () => "Test",
        serializeScene: () => ({}),
        deserializeScene: () => undefined,
        getImageTarget: () => null,
        getSceneSummary: () => ({ objectCount: 0, expressionCount: 0 }),
      };
      const markup = renderToStaticMarkup(
        <ShareExportControl adapter={adapter} />,
      );
      expect(markup).toContain('aria-label="Share or export"');
      expect(markup).toContain('title="Share or export"');
      expect(markup).toContain("portable-share-trigger");
      const embeddable = workspaceType !== "cas";
      expect(markup).toContain(`data-can-embed="${embeddable}"`);
      expect(markup).not.toContain("Share &amp; Export");
    },
  );

  it("keeps CAS Share without an embed action in the closed trigger", () => {
    const adapter: PortableWorkspaceAdapter = {
      workspaceType: "cas",
      engine: "test",
      engineVersion: "1",
      title: () => "Computer Algebra Studio",
      serializeScene: () => ({ casNotebookState: { cells: [], assumptions: "", mode: "exact" } }),
      deserializeScene: () => undefined,
      getImageTarget: () => null,
      getSceneSummary: () => ({ objectCount: 2, expressionCount: 2, description: "2 CAS calculations" }),
    };
    const markup = renderToStaticMarkup(<ShareExportControl adapter={adapter} />);
    expect(markup).toContain("Share");
    expect(markup).toContain('data-can-embed="false"');
    expect(markup).not.toContain("Embed on a website");
    expect(markup).not.toContain("twodgraph.js");
  });
});
