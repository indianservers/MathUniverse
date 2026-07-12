import { describe, expect, it } from "vitest";
import { filterNavItems, normalizeSearchText } from "./Sidebar";
import { navSections, type NavItem } from "./navItems";

const mathTopics = navSections.find((section) => section.title === "Math Topics");

function searchableTitles(query: string) {
  if (!mathTopics) return [];
  const terms = normalizeSearchText(query).split(" ").filter(Boolean);
  return filterNavItems(mathTopics.items, terms, mathTopics.title).flatMap(flattenTitles);
}

function searchableTitlesInAllSections(query: string) {
  const terms = normalizeSearchText(query).split(" ").filter(Boolean);
  return navSections.flatMap((section) => filterNavItems(section.items, terms, section.title).flatMap(flattenTitles));
}

function flattenTitles(item: NavItem): string[] {
  return [item.title, ...(item.children ?? []).flatMap(flattenTitles)];
}

describe("Sidebar menu search", () => {
  it("finds NCERT and AR/XR first-class dashboard entries", () => {
    const home = navSections.find((section) => section.title === "Home");
    const ar = navSections.find((section) => section.title === "AR / XR");
    expect(home).toBeDefined();
    expect(ar).toBeDefined();
    expect(ar?.items.map((item) => item.title)).toContain("AR Math Lab");
    const terms = normalizeSearchText("ncert class 12").split(" ").filter(Boolean);
    const titles = filterNavItems(home?.items ?? [], terms, home?.title ?? "Home").flatMap(flattenTitles);
    expect(titles).toContain("NCERT Dashboard");
    expect(searchableTitlesInAllSections("ar xr webxr")).toContain("AR Math Lab");
    expect(searchableTitlesInAllSections("camera preview")).toContain("Camera Preview");
    expect(searchableTitlesInAllSections("geometry solids")).toContain("AR Geometry Solids");
  });

  it.each([
    "hcf",
    "H.C.F",
    "gcd",
    "lcm",
    "L C M",
    "highest common factor",
    "least common multiple",
    "euclid",
    "prime factorization",
  ])("finds Class 10 Real Numbers for %s", (query) => {
    expect(searchableTitles(query)).toContain("Class 10 Real Numbers");
  });

  it.each([
    ["ven", "Interactive Venn Diagrams"],
    ["venn diagram", "Interactive Venn Diagrams"],
    ["set theory", "Set Theory and Relations"],
    ["relations", "Relations and Matrices"],
    ["hasse", "Hasse Diagram and Partial Orders"],
    ["truth table", "Truth Tables"],
    ["permutation", "Permutations and Combinations"],
    ["graph theory", "Graph Theory"],
  ])("finds implemented submenu topic %s", (query, expectedTitle) => {
    expect(searchableTitles(query)).toContain(expectedTitle);
  });

  it("promotes implemented modules into the main Math Topics menu", () => {
    expect(searchableTitles("set theory")).toContain("Set Theory and Relations");
    expect(searchableTitles("mathematical logic")).toContain("Mathematical Logic");
    expect(searchableTitles("combinatorics")).toContain("Combinatorics");
    expect(searchableTitles("statistics probability")).toContain("Statistics and Probability");
  });
});
