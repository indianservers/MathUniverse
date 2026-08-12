import type { VisualDictionaryTerm } from "../data/mathVisualDictionary";

export type DictionaryProgress = Record<string, { viewed?: string; practiced?: string; mastered?: string }>;

export function dictionarySlug(term: string) {
  return term.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export function findDictionaryTerm(terms: VisualDictionaryTerm[], value: string | null | undefined) {
  if (!value) return undefined;
  const normalized = decodeURIComponent(value).toLowerCase();
  return terms.find((entry) => entry.term.toLowerCase() === normalized || dictionarySlug(entry.term) === normalized);
}

function searchScore(entry: VisualDictionaryTerm, rawQuery: string) {
  const query = rawQuery.trim().toLowerCase();
  if (!query) return 1;
  const term = entry.term.toLowerCase();
  const searchable = [entry.term, entry.category, entry.kind, entry.description, entry.explanation, entry.representation, ...entry.keywords]
    .filter(Boolean).join(" ").toLowerCase();
  if (term === query) return 100;
  if (term.startsWith(query)) return 80;
  if (term.includes(query)) return 60;
  if (searchable.includes(query)) return 40;
  const tokens = query.split(/\s+/).filter(Boolean);
  const matched = tokens.filter((token) => searchable.includes(token)).length;
  return matched ? 10 + matched / tokens.length : 0;
}

export function filterDictionaryTerms(
  terms: VisualDictionaryTerm[],
  filters: { query?: string; letter?: string; category?: string; kind?: string },
) {
  return terms
    .map((entry, index) => ({ entry, index, score: searchScore(entry, filters.query ?? "") }))
    .filter(({ entry, score }) => score > 0
      && (!filters.letter || filters.letter === "All" || entry.term.toUpperCase().startsWith(filters.letter))
      && (!filters.category || filters.category === "All" || entry.category === filters.category)
      && (!filters.kind || filters.kind === "All" || entry.kind === filters.kind))
    .sort((a, b) => b.score - a.score || a.index - b.index)
    .map(({ entry }) => entry);
}

export function relatedDictionaryTerms(terms: VisualDictionaryTerm[], selected: VisualDictionaryTerm, limit = 5) {
  const selectedKeywords = new Set(selected.keywords);
  return terms
    .filter((entry) => entry.term !== selected.term)
    .map((entry) => ({
      entry,
      score: (entry.category === selected.category ? 5 : 0)
        + (entry.kind === selected.kind ? 3 : 0)
        + entry.keywords.filter((keyword) => selectedKeywords.has(keyword)).length,
    }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score || a.entry.term.localeCompare(b.entry.term))
    .slice(0, limit)
    .map(({ entry }) => entry);
}

export function readStoredList(key: string) {
  try {
    const parsed = JSON.parse(localStorage.getItem(key) ?? "[]") as unknown;
    return Array.isArray(parsed) ? parsed.filter((item): item is string => typeof item === "string") : [];
  } catch {
    return [];
  }
}

export function readStoredProgress(key: string): DictionaryProgress {
  try {
    const parsed = JSON.parse(localStorage.getItem(key) ?? "{}") as unknown;
    return parsed && typeof parsed === "object" && !Array.isArray(parsed) ? parsed as DictionaryProgress : {};
  } catch {
    return {};
  }
}
