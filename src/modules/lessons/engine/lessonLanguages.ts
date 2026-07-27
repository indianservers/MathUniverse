import type { LessonContent, LessonDefinition, LessonLanguageCode, LessonLanguageOption, LessonLocalizationPack } from "../types";

export const lessonLanguageOptions: readonly LessonLanguageOption[] = [
  { code: "en", nativeName: "English", englishName: "English" },
  { code: "hi", nativeName: "हिन्दी", englishName: "Hindi" },
  { code: "bn", nativeName: "বাংলা", englishName: "Bengali" },
  { code: "te", nativeName: "తెలుగు", englishName: "Telugu" },
  { code: "ta", nativeName: "தமிழ்", englishName: "Tamil" },
  { code: "mr", nativeName: "मराठी", englishName: "Marathi" },
  { code: "gu", nativeName: "ગુજરાતી", englishName: "Gujarati" },
  { code: "kn", nativeName: "ಕನ್ನಡ", englishName: "Kannada" },
  { code: "ml", nativeName: "മലയാളം", englishName: "Malayalam" },
  { code: "pa", nativeName: "ਪੰਜਾਬੀ", englishName: "Punjabi" },
  { code: "or", nativeName: "ଓଡ଼ିଆ", englishName: "Odia" },
  { code: "as", nativeName: "অসমীয়া", englishName: "Assamese" },
  { code: "ur", nativeName: "اردو", englishName: "Urdu", direction: "rtl" },
] as const;

type LazyPack = () => Promise<{ default: LessonLocalizationPack }>;

const lessonLanguageLoaders: Partial<Record<LessonLanguageCode, LazyPack>> = {
  hi: () => import("../locales/hi"),
  bn: () => import("../locales/bn"),
  te: () => import("../locales/te"),
  ta: () => import("../locales/ta"),
  mr: () => import("../locales/mr"),
  gu: () => import("../locales/gu"),
  kn: () => import("../locales/kn"),
  ml: () => import("../locales/ml"),
  pa: () => import("../locales/pa"),
  or: () => import("../locales/or"),
  as: () => import("../locales/as"),
  ur: () => import("../locales/ur"),
};

export function isLessonLanguageCode(value: string): value is LessonLanguageCode {
  return lessonLanguageOptions.some((option) => option.code === value);
}

export async function loadLessonLocalizationPack(code: LessonLanguageCode) {
  if (code === "en") return null;
  const loader = lessonLanguageLoaders[code];
  if (!loader) return null;
  return (await loader()).default;
}

export async function loadLessonLocalizedContent(code: LessonLanguageCode, lesson: LessonDefinition): Promise<LessonContent> {
  const pack = await loadLessonLocalizationPack(code);
  return pack?.contentForLesson(lesson) ?? lesson.content;
}
