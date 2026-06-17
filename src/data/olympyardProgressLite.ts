export type OlympyardTopicProgressLite = {
  attempted: number;
  correct: number;
};

export type OlympyardProgressLite = {
  attempted: number;
  correct: number;
  streak: number;
  lastTopicId?: string;
  lastSession?: string;
  badges: string[];
  topicMastery: Record<string, OlympyardTopicProgressLite>;
  mockHistory: unknown[];
};

export const OLYMPYARD_PROGRESS_STORAGE_KEY = "math-universe-olympyard-progress";

export const initialOlympyardProgressLite: OlympyardProgressLite = {
  attempted: 0,
  correct: 0,
  streak: 0,
  badges: [],
  topicMastery: {},
  mockHistory: [],
};

export function normalizeOlympyardProgressLite(value: OlympyardProgressLite | null | undefined): OlympyardProgressLite {
  if (!value || typeof value !== "object") return initialOlympyardProgressLite;
  return {
    attempted: Math.max(0, Number(value.attempted) || 0),
    correct: Math.max(0, Number(value.correct) || 0),
    streak: Math.max(0, Number(value.streak) || 0),
    lastTopicId: typeof value.lastTopicId === "string" ? value.lastTopicId : undefined,
    lastSession: typeof value.lastSession === "string" ? value.lastSession : undefined,
    badges: Array.isArray(value.badges) ? value.badges.filter((badge): badge is string => typeof badge === "string") : [],
    topicMastery: normalizeTopicMasteryLite(value.topicMastery),
    mockHistory: Array.isArray(value.mockHistory) ? value.mockHistory.slice(-10) : [],
  };
}

function normalizeTopicMasteryLite(value: unknown): Record<string, OlympyardTopicProgressLite> {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  return Object.fromEntries(Object.entries(value).map(([topicId, item]) => {
    const record = item && typeof item === "object" ? item as Partial<OlympyardTopicProgressLite> : {};
    return [topicId, {
      attempted: Math.max(0, Number(record.attempted) || 0),
      correct: Math.max(0, Number(record.correct) || 0),
    }];
  }));
}
