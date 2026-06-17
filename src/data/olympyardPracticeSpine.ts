import { getAdaptiveOlympyardTopics, getWeakOlympyardTopics, normalizeOlympyardProgress, summarizeOlympyardMastery, type OlympyardProgress } from "./olympyardProgress";
import { olympyardTopicById } from "./olympyardTopics";

export type PracticeSpineArea = {
  id: string;
  title: string;
  route: string;
  practiceRoute: string;
  topicIds: string[];
  description: string;
};

export const practiceSpineAreas: PracticeSpineArea[] = [
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

export function buildPracticeSpine(progress: OlympyardProgress) {
  const safe = normalizeOlympyardProgress(progress);
  const mastery = summarizeOlympyardMastery(safe);
  const weakTopics = getWeakOlympyardTopics(safe);
  const adaptiveTopics = getAdaptiveOlympyardTopics(safe, 5);
  const primaryTopicId = weakTopics[0]?.topicId ?? adaptiveTopics[0]?.topicId ?? "number-sense";
  const primaryTopic = olympyardTopicById(primaryTopicId);

  return {
    mastery,
    primaryTopic,
    primaryPracticeRoute: `/olympyard/practice/${primaryTopicId}`,
    adaptiveRoute: "/olympyard/mock-test?mode=adaptive",
    weakRoute: "/olympyard/mock-test?mode=weak",
    mixedRoute: "/olympyard/mock-test?mode=mixed",
    speedRoute: "/olympyard/mock-test?mode=speed&timer=1",
    areaReadiness: practiceSpineAreas.map((area) => {
      const topicStats = area.topicIds.map((topicId) => safe.topicMastery[topicId] ?? { attempted: 0, correct: 0 });
      const attempted = topicStats.reduce((sum, item) => sum + item.attempted, 0);
      const correct = topicStats.reduce((sum, item) => sum + item.correct, 0);
      const accuracy = attempted ? Math.round((correct / attempted) * 100) : 0;
      const weak = area.topicIds.some((topicId) => weakTopics.some((topic) => topic.topicId === topicId));
      return {
        ...area,
        attempted,
        accuracy,
        state: attempted === 0 ? "new" : weak ? "review" : accuracy >= 80 ? "strong" : "building",
      };
    }),
  };
}

