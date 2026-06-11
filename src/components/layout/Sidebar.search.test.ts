import { describe, expect, it } from "vitest";
import { filterNavItems, normalizeSearchText } from "./Sidebar";
import { navSections, type NavItem } from "./navItems";

const mathTopics = navSections.find((section) => section.title === "Math Topics");

function searchableTitles(query: string) {
  if (!mathTopics) return [];
  const terms = normalizeSearchText(query).split(" ").filter(Boolean);
  return filterNavItems(mathTopics.items, terms, mathTopics.title).flatMap(flattenTitles);
}

function flattenTitles(item: NavItem): string[] {
  return [item.title, ...(item.children ?? []).flatMap(flattenTitles)];
}

describe("Sidebar menu search", () => {
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
});
