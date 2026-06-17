import { olympyardTopicById } from "./olympyardTopics";
import { normalizeOlympyardProgressLite, type OlympyardProgressLite } from "./olympyardProgressLite";

export type PracticeSpineAreaLite = {
  id: string;
  title: string;
  route: string;
  practiceRoute: string;
  topicIds: string[];
  description: string;
};

export const practiceSpineAreasLite: PracticeSpineAreaLite[] = [
  {
    id: "foundations",
    title: "Number Foundations",
    route: "/number-systems",
    practiceRoute: "/olympyard/practice/number-sense",
    topicIds: ["number-sense", "fractions-decimals", "divisibility-rules", "factors-multiples"],
    description: "Place value, fractions, divisibility, factors, and number structure.",
  },
  {
    id: "algebra",
    title: "Algebra Thinking",
    route: "/algebra",
    practiceRoute: "/olympyard/practice/algebraic-thinking",
    topicIds: ["algebraic-thinking", "patterns-sequences", "word-problems"],
    description: "Balance models, patterns, story translation, and symbolic reasoning.",
  },
  {
    id: "geometry",
    title: "Geometry Reasoning",
    route: "/geometry",
    practiceRoute: "/olympyard/practice/geometry-reasoning",
    topicIds: ["geometry-reasoning", "area-perimeter", "ratios-proportions"],
    description: "Diagram reading, area/perimeter puzzles, similarity, and proof cues.",
  },
  {
    id: "logic",
    title: "Logic and Counting",
    route: "/combinatorics",
    practiceRoute: "/olympyard/practice/counting-combinatorics",
    topicIds: ["logical-reasoning", "counting-combinatorics", "number-theory"],
    description: "Truth patterns, organized counting, primes, remainders, and cases.",
  },
  {
    id: "data",
    title: "Data and Chance",
    route: "/probability-statistics",
    practiceRoute: "/olympyard/practice/data-interpretation",
    topicIds: ["data-interpretation", "probability-puzzles"],
    description: "Charts, averages, sample spaces, chance comparisons, and quick reads.",
  },
];

export function buildPracticeSpineLite(progress: OlympyardProgressLite) {
  const safe = normalizeOlympyardProgressLite(progress);
  const accuracy = safe.attempted ? Math.round((safe.correct / safe.attempted) * 100) : 0;
  const weakTopics = weakTopicIds(safe);
  const primaryTopicId = weakTopics[0] ?? safe.lastTopicId ?? "number-sense";
  const primaryTopic = olympyardTopicById(primaryTopicId);

  return {
    mastery: {
      attempted: safe.attempted,
      correct: safe.correct,
      accuracy,
      streak: safe.streak,
      hasPracticeSignal: safe.attempted > 0,
    },
    primaryTopic,
    primaryPracticeRoute: `/olympyard/practice/${primaryTopicId}`,
    adaptiveRoute: "/olympyard/mock-test?mode=adaptive",
    weakRoute: "/olympyard/mock-test?mode=weak",
    mixedRoute: "/olympyard/mock-test?mode=mixed",
    speedRoute: "/olympyard/mock-test?mode=speed&timer=1",
    areaReadiness: practiceSpineAreasLite.map((area) => {
      const topicStats = area.topicIds.map((topicId) => safe.topicMastery[topicId] ?? { attempted: 0, correct: 0 });
      const attempted = topicStats.reduce((sum, item) => sum + item.attempted, 0);
      const correct = topicStats.reduce((sum, item) => sum + item.correct, 0);
      const areaAccuracy = attempted ? Math.round((correct / attempted) * 100) : 0;
      const weak = area.topicIds.some((topicId) => weakTopics.includes(topicId));
      return {
        ...area,
        attempted,
        accuracy: areaAccuracy,
        state: attempted === 0 ? "new" : weak ? "review" : areaAccuracy >= 80 ? "strong" : "building",
      };
    }),
  };
}

function weakTopicIds(progress: OlympyardProgressLite) {
  return Object.entries(progress.topicMastery)
    .map(([topicId, item]) => ({
      topicId,
      accuracy: item.attempted ? Math.round((item.correct / item.attempted) * 100) : 0,
      attempted: item.attempted,
    }))
    .filter((item) => item.attempted >= 2 && item.accuracy < 70)
    .sort((left, right) => left.accuracy - right.accuracy)
    .map((item) => item.topicId);
}
