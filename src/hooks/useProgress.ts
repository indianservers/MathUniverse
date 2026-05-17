import { useCallback, useMemo } from "react";
import { topics } from "../data/topics";
import { useLocalStorage } from "./useLocalStorage";

type ProgressState = {
  visited: Record<string, boolean>;
  completed: Record<string, boolean>;
  pageProgress: Record<string, number>;
  quizScores: Record<string, number>;
  quizBestScores: Record<string, number>;
};

const initialProgress: ProgressState = {
  visited: {},
  completed: {},
  pageProgress: {},
  quizScores: {},
  quizBestScores: {},
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
  };
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

  return {
    progress: safeProgress,
    markTopicVisited,
    markTopicInteracted,
    markTopicCompleted,
    setTopicProgress,
    saveQuizScore,
    getTopicProgress,
    getOverallProgress,
  };
}
