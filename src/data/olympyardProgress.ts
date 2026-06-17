import { olympyardQuestions, type OlympyardQuestion } from "./olympyardQuestions";
import { olympyardTopicById, type OlympyardDifficulty, type OlympyardGradeBand } from "./olympyardTopics";

export type OlympyardSessionMode = "topic" | "adaptive" | "mixed" | "weak" | "speed" | "mock";

export type OlympyardTopicProgress = {
  attempted: number;
  correct: number;
};

export type OlympyardMockHistoryEntry = {
  id: string;
  date: string;
  score: number;
  total: number;
  accuracy: number;
  mode: OlympyardSessionMode;
};

export type OlympyardProgress = {
  attempted: number;
  correct: number;
  streak: number;
  lastTopicId?: string;
  lastSession?: string;
  badges: string[];
  topicMastery: Record<string, OlympyardTopicProgress>;
  mockHistory: OlympyardMockHistoryEntry[];
};

export type OlympyardAttemptRecord = {
  questionId: string;
  topicId: string;
  correct: boolean;
};

export type OlympyardQuestionFilters = {
  grade: "all" | OlympyardGradeBand;
  difficulty: "all" | OlympyardDifficulty;
  topicId?: string;
  mode?: OlympyardSessionMode;
  questionCount?: number;
};

export const OLYMPYARD_PROGRESS_STORAGE_KEY = "math-universe-olympyard-progress";

export const initialOlympyardProgress: OlympyardProgress = {
  attempted: 0,
  correct: 0,
  streak: 0,
  badges: [],
  topicMastery: {},
  mockHistory: [],
};

export function normalizeOlympyardProgress(value: OlympyardProgress | null | undefined): OlympyardProgress {
  if (!value || typeof value !== "object") return initialOlympyardProgress;
  return {
    attempted: Math.max(0, Number(value.attempted) || 0),
    correct: Math.max(0, Number(value.correct) || 0),
    streak: Math.max(0, Number(value.streak) || 0),
    lastTopicId: typeof value.lastTopicId === "string" ? value.lastTopicId : undefined,
    lastSession: typeof value.lastSession === "string" ? value.lastSession : undefined,
    badges: Array.isArray(value.badges) ? value.badges.filter((badge): badge is string => typeof badge === "string") : [],
    topicMastery: normalizeTopicMastery(value.topicMastery),
    mockHistory: Array.isArray(value.mockHistory)
      ? value.mockHistory.filter(isMockHistoryEntry).slice(-10)
      : [],
  };
}

export function updateOlympyardProgress(
  current: OlympyardProgress | null | undefined,
  attempts: OlympyardAttemptRecord[],
  options: { lastTopicId?: string; sessionLabel?: string; mockResult?: Omit<OlympyardMockHistoryEntry, "id" | "date"> } = {},
): OlympyardProgress {
  const safe = normalizeOlympyardProgress(current);
  if (!attempts.length && !options.mockResult && !options.lastTopicId) return safe;

  const correctCount = attempts.filter((attempt) => attempt.correct).length;
  const topicMastery = { ...safe.topicMastery };
  for (const attempt of attempts) {
    const currentTopic = topicMastery[attempt.topicId] ?? { attempted: 0, correct: 0 };
    topicMastery[attempt.topicId] = {
      attempted: currentTopic.attempted + 1,
      correct: currentTopic.correct + (attempt.correct ? 1 : 0),
    };
  }

  const attempted = safe.attempted + attempts.length;
  const correct = safe.correct + correctCount;
  const nextBadges = awardOlympyardBadges({ ...safe, attempted, correct, topicMastery });
  const mockHistory = options.mockResult
    ? [
      ...safe.mockHistory,
      {
        ...options.mockResult,
        id: `mock-${Date.now()}`,
        date: new Date().toISOString(),
      },
    ].slice(-10)
    : safe.mockHistory;

  return {
    ...safe,
    attempted,
    correct,
    streak: attempts.length ? (correctCount === attempts.length ? safe.streak + attempts.length : 0) : safe.streak,
    lastTopicId: options.lastTopicId ?? safe.lastTopicId,
    lastSession: options.sessionLabel ?? safe.lastSession,
    badges: nextBadges,
    topicMastery,
    mockHistory,
  };
}

export function selectOlympyardQuestions(filters: OlympyardQuestionFilters, progress?: OlympyardProgress): OlympyardQuestion[] {
  const safeProgress = normalizeOlympyardProgress(progress);
  let pool = olympyardQuestions.filter((question) =>
    (filters.grade === "all" || question.gradeBand === filters.grade) &&
    (filters.difficulty === "all" || question.difficulty === filters.difficulty),
  );

  if (filters.mode === "topic" && filters.topicId) {
    pool = pool.filter((question) => question.topicId === filters.topicId);
  }

  if (filters.mode === "weak") {
    const weakTopicIds = getWeakOlympyardTopics(safeProgress).map((item) => item.topicId);
    pool = pool.filter((question) => weakTopicIds.includes(question.topicId));
    if (!pool.length) pool = olympyardQuestions.filter((question) => question.difficulty !== "speed");
  }

  if (filters.mode === "adaptive") {
    const adaptiveTopicIds = getAdaptiveOlympyardTopics(safeProgress, 5).map((item) => item.topicId);
    pool = interleaveByTopic(pool.filter((question) => adaptiveTopicIds.includes(question.topicId)));
    if (!pool.length) pool = interleaveByTopic(olympyardWarmStartPool());
  }

  if (filters.mode === "speed") {
    pool = pool.filter((question) => question.difficulty === "speed" || (question.estimatedSeconds ?? 999) <= 45);
  }

  if (filters.mode === "mixed" || filters.mode === "mock") {
    pool = interleaveByTopic(pool);
  }

  const fallbackPool = filters.topicId
    ? olympyardQuestions.filter((question) => question.topicId === filters.topicId)
    : olympyardQuestions;
  const finalPool = pool.length ? pool : fallbackPool;
  return finalPool.slice(0, filters.questionCount ?? finalPool.length);
}

export function summarizeOlympyardSession(attempts: Record<string, OlympyardAttemptRecord>, questions: OlympyardQuestion[], elapsedSeconds = 0) {
  const records = Object.values(attempts);
  const correct = records.filter((attempt) => attempt.correct).length;
  const total = questions.length;
  const incorrectQuestions = questions.filter((question) => attempts[question.id] && !attempts[question.id].correct);
  const topicBreakdown = questions.reduce<Record<string, { title: string; attempted: number; correct: number }>>((summary, question) => {
    const topic = olympyardTopicById(question.topicId);
    const current = summary[question.topicId] ?? { title: topic?.title ?? question.topicId, attempted: 0, correct: 0 };
    if (attempts[question.id]) {
      current.attempted += 1;
      current.correct += attempts[question.id].correct ? 1 : 0;
    }
    summary[question.topicId] = current;
    return summary;
  }, {});

  return {
    score: correct,
    total,
    attempted: records.length,
    accuracy: records.length ? Math.round((correct / records.length) * 100) : 0,
    elapsedSeconds: Math.max(0, Math.round(elapsedSeconds)),
    incorrectQuestions,
    topicBreakdown,
    recommendedTopics: recommendOlympyardTopics(topicBreakdown),
  };
}

export function getWeakOlympyardTopics(progress: OlympyardProgress) {
  return Object.entries(normalizeOlympyardProgress(progress).topicMastery)
    .map(([topicId, item]) => ({
      topicId,
      attempted: item.attempted,
      correct: item.correct,
      accuracy: item.attempted ? Math.round((item.correct / item.attempted) * 100) : 0,
    }))
    .filter((item) => item.attempted >= 2 && item.accuracy < 70)
    .sort((left, right) => left.accuracy - right.accuracy);
}

export function getAdaptiveOlympyardTopics(progress: OlympyardProgress, limit = 4) {
  const safe = normalizeOlympyardProgress(progress);
  const stats = olympyardQuestions.reduce<Record<string, { topicId: string; attempted: number; correct: number; total: number; accuracy: number; priority: number }>>((summary, question) => {
    const mastery = safe.topicMastery[question.topicId] ?? { attempted: 0, correct: 0 };
    summary[question.topicId] = summary[question.topicId] ?? {
      topicId: question.topicId,
      attempted: mastery.attempted,
      correct: mastery.correct,
      total: 0,
      accuracy: mastery.attempted ? Math.round((mastery.correct / mastery.attempted) * 100) : 0,
      priority: 0,
    };
    summary[question.topicId].total += 1;
    return summary;
  }, {});

  return Object.values(stats)
    .map((item) => ({
      ...item,
      priority: adaptivePriority(item.attempted, item.accuracy),
    }))
    .sort((left, right) => right.priority - left.priority || left.accuracy - right.accuracy || left.topicId.localeCompare(right.topicId))
    .slice(0, Math.max(1, limit));
}

export function summarizeOlympyardMastery(progress: OlympyardProgress) {
  const safe = normalizeOlympyardProgress(progress);
  const accuracy = safe.attempted ? Math.round((safe.correct / safe.attempted) * 100) : 0;
  const weakTopics = getWeakOlympyardTopics(safe);
  const adaptiveTopics = getAdaptiveOlympyardTopics(safe, 4);
  const masteredTopicCount = Object.values(safe.topicMastery).filter((item) => item.attempted >= 3 && item.correct / item.attempted >= 0.8).length;
  return {
    attempted: safe.attempted,
    correct: safe.correct,
    accuracy,
    streak: safe.streak,
    weakTopics,
    adaptiveTopics,
    masteredTopicCount,
    hasPracticeSignal: safe.attempted > 0,
  };
}

export function formatOlympyardTime(seconds: number) {
  const safe = Math.max(0, Math.round(seconds));
  const minutes = Math.floor(safe / 60);
  const rest = safe % 60;
  return `${minutes}:${String(rest).padStart(2, "0")}`;
}

function normalizeTopicMastery(value: unknown): Record<string, OlympyardTopicProgress> {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  return Object.fromEntries(Object.entries(value).map(([topicId, item]) => {
    const record = item && typeof item === "object" ? item as Partial<OlympyardTopicProgress> : {};
    return [topicId, {
      attempted: Math.max(0, Number(record.attempted) || 0),
      correct: Math.max(0, Number(record.correct) || 0),
    }];
  }));
}

function isMockHistoryEntry(value: unknown): value is OlympyardMockHistoryEntry {
  return Boolean(value && typeof value === "object" && "score" in value && "total" in value);
}

function awardOlympyardBadges(progress: OlympyardProgress) {
  const badges = new Set(progress.badges);
  if (progress.correct >= 10) badges.add("First 10 correct");
  if (progress.streak >= 10) badges.add("Streak builder");
  const geometry = progress.topicMastery["geometry-reasoning"];
  if (geometry && geometry.correct >= 3) badges.add("Geometry beginner");
  const patterns = progress.topicMastery["patterns-sequences"];
  if (patterns && patterns.correct >= 3) badges.add("Pattern master");
  const speedCorrect = olympyardQuestions.filter((question) => question.difficulty === "speed" && (progress.topicMastery[question.topicId]?.correct ?? 0) > 0).length;
  if (speedCorrect >= 3) badges.add("Speed solver");
  return Array.from(badges);
}

function interleaveByTopic(questions: OlympyardQuestion[]) {
  const groups = questions.reduce<Record<string, OlympyardQuestion[]>>((summary, question) => {
    summary[question.topicId] = [...(summary[question.topicId] ?? []), question];
    return summary;
  }, {});
  const topicIds = Object.keys(groups).sort();
  const result: OlympyardQuestion[] = [];
  let index = 0;
  while (result.length < questions.length) {
    for (const topicId of topicIds) {
      const question = groups[topicId][index];
      if (question) result.push(question);
    }
    index += 1;
  }
  return result;
}

function olympyardWarmStartPool() {
  const warmStartTopics = new Set(["number-sense", "fractions-decimals", "algebraic-thinking", "geometry-reasoning", "patterns-sequences"]);
  return olympyardQuestions.filter((question) => warmStartTopics.has(question.topicId) && question.difficulty !== "speed");
}

function adaptivePriority(attempted: number, accuracy: number) {
  if (attempted === 0) return 80;
  if (attempted < 3) return 90;
  if (accuracy < 50) return 100;
  if (accuracy < 70) return 95;
  if (accuracy < 85) return 70;
  return 30;
}

function recommendOlympyardTopics(topicBreakdown: Record<string, { title: string; attempted: number; correct: number }>) {
  return Object.entries(topicBreakdown)
    .map(([topicId, item]) => ({
      topicId,
      title: item.title,
      accuracy: item.attempted ? Math.round((item.correct / item.attempted) * 100) : 0,
    }))
    .filter((item) => item.accuracy < 80)
    .sort((left, right) => left.accuracy - right.accuracy)
    .slice(0, 3);
}
