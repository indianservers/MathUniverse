export type NCERTPracticeQuestion = {
  id: string;
  conceptId?: string;
  difficulty?: "easy" | "medium" | "exam";
  prompt: string;
  answer: number | string | string[];
  answerType?: "numeric" | "text" | "multiple-choice";
  tolerance?: number;
  hint: string;
  explanation: string;
  commonMistake?: string;
  commonMistakes?: Array<{
    answer: string | number;
    feedback: string;
  }>;
  choices?: string[];
  tags?: string[];
};

export type NCERTPracticeResult = {
  ok: boolean;
  message: string;
  matchedCommonMistake?: boolean;
};
