import { useCallback, useMemo } from "react";
import { topics } from "../data/topics";
import { useLocalStorage } from "./useLocalStorage";

type ProgressState = {
  visited: Record<string, boolean>;
  completed: Record<string, boolean>;
  pageProgress: Record<string, number>;
  quizScores: Record<string, number>;
  quizBestScores: Record<string, number>;
  mastery: Record<string, MasteryEvidence>;
};

export type MasteryEvidence = {
  attempts: number;
  totalScore: number;
  firstAssessedAt: number;
  lastAssessedAt: number;
  nextReviewAt: number;
  status: "unassessed" | "developing" | "proficient" | "durable";
  reason: string;
};

const initialProgress: ProgressState = {
  visited: {},
  completed: {},
  pageProgress: {},
  quizScores: {},
  quizBestScores: {},
  mastery: {},
};

function normalizeProgress(value: ProgressState | null | undefined): ProgressState {
  return {
    ...initialProgress,
    ...(value && typeof value === "object" ? value : {}),
    visited: { ...initialProgress.visited, ...(value?.visited ?? {}) },
    completed: { ...initialProgress.completed, ...(value?.completed ?? {}) },
    pageProgress: { ...initialProgress.pageProgress, ...(value?.pageProgress ?? {}) },
    quizScores: { ...initialProgress.quizScores, ...(value?.quizScores ?? {}) },
    quizBestScores: { ...initialProgress.quizBestScores, ...(value?.quizBestScores ?? {}) },
    mastery: { ...initialProgress.mastery, ...(value?.mastery ?? {}) },
  };
}

export function updateMasteryEvidence(previous: MasteryEvidence | undefined, score: number, assessedAt = Date.now()): MasteryEvidence {
  const safeScore = Math.min(100, Math.max(0, score));
  const attempts = (previous?.attempts ?? 0) + 1;
  const totalScore = (previous?.totalScore ?? 0) + safeScore;
  const firstAssessedAt = previous?.firstAssessedAt ?? assessedAt;
  const average = totalScore / attempts;
  const ageDays = (assessedAt - firstAssessedAt) / 86_400_000;
  const status = attempts >= 3 && average >= 85 && ageDays >= 7 ? "durable" : attempts >= 2 && average >= 80 ? "proficient" : "developing";
  const reviewDays = status === "durable" ? 14 : status === "proficient" ? 7 : safeScore >= 70 ? 3 : 1;
  const reason = status === "durable"
    ? `Durable mastery: ${attempts} assessments average ${Math.round(average)}% across at least 7 days.`
    : status === "proficient"
      ? `Proficient: ${attempts} assessments average ${Math.round(average)}%; spaced evidence is still needed.`
      : `Developing: ${attempts} assessed attempt${attempts === 1 ? "" : "s"} average ${Math.round(average)}%.`;
  return { attempts, totalScore, firstAssessedAt, lastAssessedAt: assessedAt, nextReviewAt: assessedAt + reviewDays * 86_400_000, status, reason };
}

export function useProgress() {
  const [progress, setProgress] = useLocalStorage<ProgressState>("math-universe-progress", initialProgress);
  const safeProgress: ProgressState = useMemo(() => normalizeProgress(progress), [progress]);

  const markTopicVisited = useCallback((topicId: string) => {
    setProgress((current) => {
      const base = normalizeProgress(current);
      return {
        ...base,
        visited: { ...base.visited, [topicId]: true },
        pageProgress: { ...base.pageProgress, [topicId]: Math.max(base.pageProgress[topicId] ?? 0, 25) },
      };
    });
  }, [setProgress]);

  const markTopicInteracted = useCallback((topicId: string) => {
    setProgress((current) => {
      const base = normalizeProgress(current);
      return {
        ...base,
        visited: { ...base.visited, [topicId]: true },
        pageProgress: { ...base.pageProgress, [topicId]: Math.max(base.pageProgress[topicId] ?? 0, 75) },
      };
    });
  }, [setProgress]);

  const markTopicCompleted = useCallback((topicId: string) => {
    setProgress((current) => {
      const base = normalizeProgress(current);
      return {
        ...base,
        completed: { ...base.completed, [topicId]: true },
        visited: { ...base.visited, [topicId]: true },
        pageProgress: { ...base.pageProgress, [topicId]: 100 },
      };
    });
  }, [setProgress]);

  const setTopicProgress = useCallback((topicId: string, percentage: number) => {
    setProgress((current) => {
      const base = normalizeProgress(current);
      return {
        ...base,
        pageProgress: { ...base.pageProgress, [topicId]: Math.min(100, Math.max(0, percentage)) },
      };
    });
  }, [setProgress]);

  const saveQuizScore = useCallback((quizId: string, score: number) => {
    setProgress((current) => {
      const base = normalizeProgress(current);
      return {
        ...base,
        quizScores: { ...base.quizScores, [quizId]: score },
        quizBestScores: { ...base.quizBestScores, [quizId]: Math.max(base.quizBestScores[quizId] ?? 0, score) },
        mastery: { ...base.mastery, [quizId]: updateMasteryEvidence(base.mastery[quizId], score) },
      };
    });
  }, [setProgress]);

  const getTopicProgress = useCallback((topicId: string) => {
    if (safeProgress.completed[topicId]) return 100;
    return safeProgress.pageProgress[topicId] ?? (safeProgress.visited[topicId] ? 25 : 0);
  }, [safeProgress.completed, safeProgress.pageProgress, safeProgress.visited]);

  const getOverallProgress = useCallback(() => {
    if (topics.length === 0) return 0;
    const total = topics.reduce((sum, topic) => sum + getTopicProgress(topic.id), 0);
    return Math.round(total / topics.length);
  }, [getTopicProgress]);

  const getTopicMastery = useCallback((topicId: string) => safeProgress.mastery[topicId] ?? null, [safeProgress.mastery]);

  return {
    progress: safeProgress,
    markTopicVisited,
    markTopicInteracted,
    markTopicCompleted,
    setTopicProgress,
    saveQuizScore,
    getTopicProgress,
    getOverallProgress,
    getTopicMastery,
  };
}
