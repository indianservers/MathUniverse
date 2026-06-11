import { ncertGapItems, type NCERTGapItem, type NCERTGapStatus } from "./ncertGapAnalysis";
import { allSyllabusTopics, syllabusLevels, type SyllabusTopic } from "./syllabus";

export type SyllabusIntelligenceUnit = {
  unit: string;
  total: number;
  available: number;
  mapped: number;
  future: number;
  priorityScore: number;
  readiness: number;
  workspaceTemplate?: string;
  recommendedRoute: string;
  reason: string;
  topics: SyllabusTopic[];
};

const templateByUnit: Record<string, string> = {
  Algebra: "polynomials",
  Geometry: "quadrilaterals",
  "Coordinate Geometry": "coordinate-geometry",
  Trigonometry: "circles",
  "Number System": "polynomials",
  Calculus: "polynomials",
  "Linear Algebra": "3d-solids",
  "Advanced Mathematics": "3d-solids",
};

const routeByTemplate: Record<string, string> = {
  polynomials: "/workspace?template=polynomials&mode=guided",
  circles: "/workspace?template=circles&mode=guided",
  quadrilaterals: "/workspace?template=quadrilaterals&mode=guided",
  "coordinate-geometry": "/workspace?template=coordinate-geometry&mode=guided",
  "3d-solids": "/workspace?template=3d-solids&mode=guided",
};

const statusWeight: Record<NCERTGapStatus, number> = {
  missing: 5,
  partial: 4,
  strong: 1,
};

export function buildSyllabusIntelligence(topics: SyllabusTopic[] = allSyllabusTopics): SyllabusIntelligenceUnit[] {
  const groups = new Map<string, SyllabusTopic[]>();
  topics.forEach((topic) => groups.set(topic.unit, [...(groups.get(topic.unit) ?? []), topic]));

  return Array.from(groups.entries()).map(([unit, unitTopics]) => {
    const available = unitTopics.filter((topic) => topic.status === "available").length;
    const mapped = unitTopics.filter((topic) => topic.status === "mapped").length;
    const future = unitTopics.filter((topic) => topic.status === "future").length;
    const gapPressure = matchingGapItems(unitTopics).reduce((sum, gap) => sum + statusWeight[gap.status], 0);
    const priorityScore = future * 5 + mapped * 3 + Math.ceil(gapPressure / 2);
    const readiness = Math.round(((available + mapped * 0.55) / Math.max(1, unitTopics.length)) * 100);
    const workspaceTemplate = templateByUnit[unit];
    return {
      unit,
      total: unitTopics.length,
      available,
      mapped,
      future,
      priorityScore,
      readiness,
      workspaceTemplate,
      recommendedRoute: workspaceTemplate ? routeByTemplate[workspaceTemplate] : unitTopics.find((topic) => topic.linkedVisualization.available)?.linkedVisualization.route ?? "/syllabus",
      reason: priorityReason(unit, future, mapped, gapPressure, readiness),
      topics: unitTopics,
    };
  }).sort((a, b) => b.priorityScore - a.priorityScore || a.unit.localeCompare(b.unit));
}

export function recommendedLearningPath(levelId = "All", limit = 6) {
  const topics = levelId === "All" ? allSyllabusTopics : syllabusLevels.find((level) => level.id === levelId)?.topics ?? allSyllabusTopics;
  return topics
    .map((topic) => {
      const gap = ncertGapItems.find((item) => item.classLevel === topic.classLevel && normalizeTitle(item.chapter) === normalizeTitle(topic.title));
      const score = topic.status === "future" ? 8 : topic.status === "mapped" ? 6 : 3;
      const gapBonus = gap ? statusWeight[gap.status] : 0;
      const template = templateForTopic(topic);
      return {
        topic,
        gap,
        score: score + gapBonus,
        workspaceRoute: template ? routeByTemplate[template] : topic.linkedVisualization.route,
        action: gap?.status === "partial" ? "Strengthen with guided workspace" : topic.status === "future" ? "Plan new visualization" : "Launch visual practice",
      };
    })
    .sort((a, b) => b.score - a.score || a.topic.title.localeCompare(b.topic.title))
    .slice(0, limit);
}

export function syllabusCoverageSummary(topics: SyllabusTopic[] = allSyllabusTopics) {
  const available = topics.filter((topic) => topic.status === "available").length;
  const mapped = topics.filter((topic) => topic.status === "mapped").length;
  const future = topics.filter((topic) => topic.status === "future").length;
  return {
    total: topics.length,
    available,
    mapped,
    future,
    readiness: Math.round(((available + mapped * 0.55) / Math.max(1, topics.length)) * 100),
  };
}

function matchingGapItems(topics: SyllabusTopic[]): NCERTGapItem[] {
  return ncertGapItems.filter((gap) => topics.some((topic) => topic.classLevel === gap.classLevel && normalizeTitle(topic.title) === normalizeTitle(gap.chapter)));
}

function templateForTopic(topic: SyllabusTopic) {
  if (/circle/i.test(topic.title)) return "circles";
  if (/quadrilateral|mensuration|surface|solid|3d/i.test(`${topic.title} ${topic.unit}`)) return "3d-solids";
  if (/coordinate|graph|line/i.test(`${topic.title} ${topic.unit}`)) return "coordinate-geometry";
  if (/polynomial|factor|quadratic|equation|algebra/i.test(`${topic.title} ${topic.unit}`)) return "polynomials";
  return templateByUnit[topic.unit];
}

function priorityReason(unit: string, future: number, mapped: number, gapPressure: number, readiness: number) {
  if (future > 0) return `${unit} has ${future} future module${future === 1 ? "" : "s"} and should get purpose-built visual labs.`;
  if (mapped > 0) return `${unit} is partially mapped; guided workspace templates can turn related tools into direct lessons.`;
  if (gapPressure > 0) return `${unit} has NCERT pressure from partial/external coverage and needs clearer launch paths.`;
  return `${unit} is strong at ${readiness}% readiness; use it as a model for other units.`;
}

function normalizeTitle(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "");
}
