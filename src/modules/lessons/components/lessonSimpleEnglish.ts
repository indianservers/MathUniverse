import { findAdvancedConceptLesson } from "../catalog/advanced/advancedConceptLessons";
import { findLesson } from "../catalog/lessonCatalog";
import { findSchoolLesson } from "../catalog/school/schoolSyllabusCatalog";
import { getStrengthenedFoundationLesson } from "../strengthening/foundationNumberContent";
import type { StrengthenedLesson } from "../strengthening/strengthenedLessonSchema";

export type LessonSimpleEnglish = {
  title: string;
  paragraphs: [string, string, string];
  examplePrompt: string;
  exampleAnswer: string;
};

const cannedCopy =
  /works this concrete case|fills a .{0,80}syllabus gap|Teach .+ as a Class|labelled numerical result|one numerical story on the labelled chart|is the .+ rule used to compute|Read the .+ inputs, apply the exact rule|Compute one .+ value|labelled result|idea you can learn with one small example|is a (?:school mathematics|class \d+|geometry|3[dD](?: mathematics| geometry)?|symbolic mathematics|CAS workspace|lesson-page|platform|spreadsheet|data and probability|precise) (?:idea|command|pattern|capability|skill)\b/i;

function sentence(text: string) {
  const trimmed = text.replace(/\s+/g, " ").trim();
  if (!trimmed) return "";
  return /[.!?]$/.test(trimmed) ? trimmed : `${trimmed}.`;
}

function joinSentences(...parts: Array<string | undefined>) {
  return parts
    .map((part) => (part ? sentence(part) : ""))
    .filter(Boolean)
    .join(" ");
}

function isCanned(text: string | undefined) {
  return !text || cannedCopy.test(text);
}

function pickDefinition(lesson: StrengthenedLesson, fallbackSummary?: string) {
  const original = lesson.definitions.find((item) => !isCanned(item.statement));
  if (original) return original.statement;
  const last = lesson.definitions.at(-1)?.statement;
  if (last && !isCanned(last)) return last;
  if (!isCanned(lesson.basicIdea)) return lesson.basicIdea;
  if (fallbackSummary && !isCanned(fallbackSummary)) return fallbackSummary;
  return `${lesson.title} is a ${lesson.topic.toLowerCase()} idea. Say it in plain words, then check it with one small example`;
}

function pickWorkedExample(lesson: StrengthenedLesson) {
  const original = lesson.workedExamples.find((example) => !/batch\d+-worked/i.test(example.id));
  if (original) return original;
  const scored = [...lesson.workedExamples].sort((left, right) => {
    const score = (example: (typeof lesson.workedExamples)[number]) => {
      const hay = `${example.prompt} ${example.answer}`.toLowerCase();
      const titleHits = lesson.title
        .toLowerCase()
        .split(/[^a-z0-9]+/)
        .filter((word) => word.length > 3)
        .filter((word) => hay.includes(word)).length;
      return titleHits * 3 + (/\d/.test(example.prompt) ? 1 : 0) + example.prompt.length / 40;
    };
    return score(right) - score(left);
  });
  return scored[0];
}

function ensureLength(text: string, extra: string) {
  return text.length >= 80 ? text : joinSentences(text, extra);
}

export function getLessonSimpleEnglish(
  id: number,
  fallback?: { title: string; summary?: string },
): LessonSimpleEnglish | null {
  const lesson = getStrengthenedFoundationLesson(id);
  const title = lesson?.title ?? fallback?.title;
  if (!title) return null;

  if (lesson) {
    const definition = pickDefinition(lesson, fallback?.summary);
    const worked = pickWorkedExample(lesson);
    const workedIsWeak = !worked || isCanned(`${worked.prompt} ${worked.answer}`);
    const life = lesson.realLifeExamples[0];
    const miss = lesson.misconceptions[0];
    const formula = lesson.formulas.find((item) =>
      /[=+\-×÷/^]|alpha|sin|cos|\d/.test(item.expression),
    );
    const formulaLine =
      formula && !isCanned(`${formula.label} ${formula.expression}`)
        ? `A useful rule is ${formula.label}: ${formula.expression}`
        : undefined;
    const what = ensureLength(
      isCanned(lesson.introduction)
        ? joinSentences(
            definition,
            formulaLine,
            `You can learn ${title} by trying one small example instead of long theory`,
          )
        : sentence(lesson.introduction),
      `Say the idea in plain words, then check it with a tiny example of ${title}`,
    );
    const how = ensureLength(
      worked && !workedIsWeak
        ? joinSentences(
            isCanned(lesson.howItWorks)
              ? formula && !isCanned(formula.expression)
                ? `Use ${formula.label}: ${formula.expression}`
                : `Use the definition of ${title}, then check the result`
              : lesson.howItWorks,
            `Example: ${worked.prompt}`,
            worked.steps.slice(0, 2).join(" "),
            `So the answer is ${worked.answer}`,
          )
        : joinSentences(
            isCanned(lesson.howItWorks)
              ? `Try one small case of ${title}. Write each step in plain words, then check the result`
              : lesson.howItWorks,
            "Change one value in the interactive tool and watch what happens",
            "If the same rule works on two small examples, you can trust it on a bigger one",
          ),
      "Change one value and ask whether the same rule still holds",
    );
    const why = ensureLength(
      joinSentences(
        life
          ? `In real life, ${life.context.toLowerCase()}: ${life.connection}`
          : `Use ${title} whenever you need a clear rule, not a guess`,
        miss ? `Watch out: ${miss.mistake} ${miss.correction}` : "Check your answer with a second example before you move on",
      ),
      "If the tiny case fails, fix the rule before you try a harder question",
    );
    const examplePrompt =
      worked && !workedIsWeak
        ? worked.prompt.length > 8
          ? worked.prompt
          : `Try this ${title} question: ${worked.prompt}`
        : `What is one simple example of ${title}?`;
    return {
      title,
      paragraphs: [what, how, why],
      examplePrompt,
      exampleAnswer:
        worked && !workedIsWeak
          ? worked.answer
          : fallback?.summary
            ? `Start from this idea: ${fallback.summary}`
            : "Use the definition, then check with a tiny case.",
    };
  }

  const summary = fallback?.summary?.trim();
  return {
    title,
    paragraphs: [
      joinSentences(
        summary || `${title} is a rule you can learn by looking at a small example`,
        "Say the idea in plain words first, then look at the picture or numbers",
      ),
      joinSentences(
        "Change one value in the interactive tool and watch what happens",
        "If the same rule works on two small examples, you can trust it on a bigger one",
      ),
      joinSentences(
        `A useful habit with ${title} is to check a tiny case before you solve the full question`,
        "If the tiny case fails, fix the rule. If it works, keep going",
      ),
    ],
    examplePrompt: `What is one simple example of ${title}?`,
    exampleAnswer: "Pick a small case, apply the rule, and say the result in one sentence.",
  };
}

export function resolveLessonSimpleEnglish(params: {
  levelSlug?: string;
  lessonSlug?: string;
  categorySlug?: string;
}): LessonSimpleEnglish | null {
  const school = findSchoolLesson(params.levelSlug, params.lessonSlug);
  if (school) {
    return getLessonSimpleEnglish(school.numericId, {
      title: school.title,
      summary: school.content.summary,
    });
  }
  const advanced = findAdvancedConceptLesson(params.lessonSlug);
  if (advanced) {
    return getLessonSimpleEnglish(advanced.numericId, {
      title: advanced.title,
      summary: [advanced.summary, advanced.learn[0]].filter(Boolean).join(" "),
    });
  }
  const catalog = findLesson(params.categorySlug, params.lessonSlug);
  if (catalog) {
    return getLessonSimpleEnglish(catalog.id, {
      title: catalog.title,
      summary: catalog.outcome,
    });
  }
  return null;
}
