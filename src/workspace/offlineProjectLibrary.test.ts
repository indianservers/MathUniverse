import { beforeEach, describe, expect, it, vi } from "vitest";
import { clearOfflineProjectLibrary, duplicateOfflineProject, exportOfflineProjectBundle, importOfflineProjectBundle, readOfflineProjectLibrary, removeOfflineProject, saveOfflineProject, searchOfflineProjects, type OfflineProjectEntry } from "./offlineProjectLibrary";

type Snapshot = { value: number };

function entry(id: string, value: number): OfflineProjectEntry<Snapshot> {
  return { id, title: `Project ${id}`, savedAt: value, summary: `value ${value}`, snapshot: { value } };
}

describe("offline project library", () => {
  const store = new Map<string, string>();

  beforeEach(() => {
    store.clear();
    vi.stubGlobal("localStorage", {
      getItem: vi.fn((key: string) => store.get(key) ?? null),
      setItem: vi.fn((key: string, value: string) => {
        store.set(key, value);
      }),
      removeItem: vi.fn((key: string) => {
        store.delete(key);
      }),
      clear: vi.fn(() => {
        store.clear();
      }),
    });
    localStorage.clear();
  });

  it("saves newest entries first and replaces duplicate ids", () => {
    saveOfflineProject(entry("a", 1));
    saveOfflineProject(entry("b", 2));
    saveOfflineProject(entry("a", 3));

    const projects = readOfflineProjectLibrary<Snapshot>();
    expect(projects.map((project) => project.id)).toEqual(["a", "b"]);
    expect(projects[0].snapshot.value).toBe(3);
  });

  it("caps the browser library to 48 projects", () => {
    for (let index = 0; index < 60; index += 1) saveOfflineProject(entry(String(index), index));

    const projects = readOfflineProjectLibrary<Snapshot>();
    expect(projects).toHaveLength(48);
    expect(projects[0].id).toBe("59");
    expect(projects.at(-1)?.id).toBe("12");
  });

  it("adds folders, tags, versions, duplicate, search, and bundle import/export", () => {
    saveOfflineProject({ ...entry("a", 1), folder: "Geometry", tags: ["circle"] });
    saveOfflineProject({ ...entry("a", 2), folder: "Geometry", tags: ["circle"] });

    expect(readOfflineProjectLibrary<Snapshot>()[0].version).toBe(2);
    expect(searchOfflineProjects<Snapshot>("geometry circle")).toHaveLength(1);

    const duplicated = duplicateOfflineProject<Snapshot>("a", "Circle copy");
    expect(duplicated[0].title).toBe("Circle copy");
    expect(duplicated[0].parentId).toBe("a");

    const bundle = exportOfflineProjectBundle<Snapshot>();
    clearOfflineProjectLibrary();
    expect(importOfflineProjectBundle<Snapshot>(bundle).length).toBeGreaterThan(0);
  });

  it("removes and clears projects without throwing on corrupted storage", () => {
    saveOfflineProject(entry("a", 1));
    expect(removeOfflineProject<Snapshot>("a")).toEqual([]);
    saveOfflineProject(entry("b", 2));
    clearOfflineProjectLibrary();
    expect(readOfflineProjectLibrary<Snapshot>()).toEqual([]);

    vi.mocked(localStorage.getItem).mockReturnValueOnce("{broken");
    expect(readOfflineProjectLibrary<Snapshot>()).toEqual([]);
    vi.restoreAllMocks();
  });
});
