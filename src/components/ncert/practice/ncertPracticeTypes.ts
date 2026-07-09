export type NCERTPracticeQuestion = {
  id: string;
  prompt: string;
  answer: number | string | string[];
  tolerance?: number;
  hint: string;
  explanation: string;
  commonMistake?: string;
  choices?: string[];
};

export type NCERTPracticeResult = {
  ok: boolean;
  message: string;
};
