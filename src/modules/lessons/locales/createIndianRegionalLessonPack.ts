import type { LessonContent, LessonDefinition, LessonFormula, LessonLanguageCode, LessonLocalizationPack } from "../types";

type LessonPhraseSet = {
  code: LessonLanguageCode;
  nativeName: string;
  englishName: string;
  direction?: "ltr" | "rtl";
  labels: {
    summaryLead: string;
    summaryBridge: string;
    explanation: string;
    ideaWatch: string;
    ideaChallenge: string;
    workedConnection: string;
    controlsUse: string;
    controlsAfter: string;
    controlsReset: string;
    examplePrefix: string;
    knowWhy: string;
    knowTest: string;
    knowFormula: string;
    knowRealLife: string;
  };
};

const importantTerms = {
  concept: "concept",
  visualModel: "visual model",
  formula: "formula",
  answer: "answer",
  objective: "objective",
  interaction: "interaction",
  output: "output",
  representation: "representation",
  prediction: "prediction",
  challenge: "challenge",
  example: "example",
  reset: "reset",
};

export function createIndianRegionalLessonPack(phrases: LessonPhraseSet): LessonLocalizationPack {
  return {
    code: phrases.code,
    nativeName: phrases.nativeName,
    englishName: phrases.englishName,
    direction: phrases.direction,
    contentForLesson: (lesson) => createLocalizedContent(lesson, phrases),
  };
}

function createLocalizedContent(lesson: LessonDefinition, phrases: LessonPhraseSet): LessonContent {
  const formulas = localizeFormulas(lesson.content.formulas);
  return {
    summary: `${lesson.title} (${importantTerms.concept}) ${phrases.labels.summaryLead} ${lesson.topic}. ${lesson.purpose} (${importantTerms.objective}). ${phrases.labels.summaryBridge} ${lesson.workspace} (${importantTerms.visualModel}), ${importantTerms.formula}, ${importantTerms.answer}.`,
    explanation: `${phrases.labels.explanation} ${lesson.interactions} (${importantTerms.interaction}).`,
    keyIdeas: [
      `${lesson.description} (${importantTerms.concept})`,
      `${phrases.labels.ideaWatch} ${lesson.contract.observableOutputs.join(", ")} (${importantTerms.output}).`,
      `${phrases.labels.ideaChallenge} ${importantTerms.formula}, ${importantTerms.visualModel}, ${importantTerms.answer}.`,
    ],
    realWorldExamples: localizedExamples(lesson, phrases),
    controlGuide: [
      `${phrases.labels.controlsUse} ${lesson.contract.requiredControlIds.join(", ")} (${lesson.contract.requiredInteractionVerbs.join(", ")}).`,
      `${lesson.contract.keyboardAlternative} (keyboard alternative)`,
      `${phrases.labels.controlsAfter} ${lesson.contract.observableOutputs.join(", ")} (${importantTerms.representation}).`,
      `${phrases.labels.controlsReset} ${lesson.contract.resetAssertions.join(", ")} (${importantTerms.reset}).`,
    ],
    formulas,
    workedConnection: `${phrases.labels.workedConnection} ${lesson.contract.requiredControlIds.join(" / ")}; ${importantTerms.prediction}, ${importantTerms.visualModel}, ${importantTerms.formula}, ${importantTerms.answer}.`,
    knowMore: [
      `${phrases.labels.knowWhy}: ${lesson.outcome}`,
      `${phrases.labels.knowTest}: ${lesson.contract.requiredInteractionVerbs.join(", ")} (${importantTerms.challenge}).`,
      `${phrases.labels.knowFormula}: ${formulas[0]?.label ?? "Formula"} ${formulas[0]?.explanation ?? ""}`,
      `${phrases.labels.knowRealLife}: ${lesson.content.realWorldExamples[0]}`,
    ],
  };
}

function localizedExamples(lesson: LessonDefinition, phrases: LessonPhraseSet) {
  return lesson.content.realWorldExamples.map((example) => `${phrases.labels.examplePrefix}: ${example} (${lesson.title}; ${importantTerms.example}).`);
}

function localizeFormulas(formulas: LessonFormula[]) {
  return formulas.map((item) => ({
    ...item,
    label: `${item.label} (${importantTerms.formula})`,
    explanation: `${item.explanation} (${importantTerms.concept})`,
  }));
}
