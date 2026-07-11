import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { InferenceRule, PredicateScenario } from "./logicEngine";

export type LogicMode = "student" | "teacher";

type LogicSessionState = {
  expression: string;
  selectedRow: number;
  selectedStep: number;
  inferenceRule: InferenceRule;
  premises: string[];
  predicate: PredicateScenario;
  mode: LogicMode;
  completedExercises: string[];
  setExpression: (expression: string) => void;
  setSelectedRow: (selectedRow: number) => void;
  setSelectedStep: (selectedStep: number) => void;
  setInferenceRule: (inferenceRule: InferenceRule) => void;
  setPremise: (index: number, premise: string) => void;
  setPredicate: (predicate: PredicateScenario) => void;
  setMode: (mode: LogicMode) => void;
  toggleExercise: (id: string) => void;
  importSession: (payload: Partial<Pick<LogicSessionState, "expression" | "premises" | "predicate" | "mode">>) => void;
};

export const defaultPredicate: PredicateScenario = {
  quantifier: "forall",
  predicateName: "Prime",
  variable: "x",
  domain: ["2", "3", "4", "5"],
  trueFor: ["2", "3", "5"],
};

export const useLogicStore = create<LogicSessionState>()(
  persist(
    (set) => ({
      expression: "(P & Q) -> (R xor !P)",
      selectedRow: 0,
      selectedStep: 0,
      inferenceRule: "Modus Ponens",
      premises: ["P", "P -> Q", ""],
      predicate: defaultPredicate,
      mode: "student",
      completedExercises: [],
      setExpression: (expression) => set({ expression, selectedRow: 0, selectedStep: 0 }),
      setSelectedRow: (selectedRow) => set({ selectedRow, selectedStep: 0 }),
      setSelectedStep: (selectedStep) => set({ selectedStep }),
      setInferenceRule: (inferenceRule) => set({ inferenceRule }),
      setPremise: (index, premise) => set((state) => ({
        premises: state.premises.map((item, currentIndex) => currentIndex === index ? premise : item),
      })),
      setPredicate: (predicate) => set({ predicate }),
      setMode: (mode) => set({ mode }),
      toggleExercise: (id) => set((state) => ({
        completedExercises: state.completedExercises.includes(id)
          ? state.completedExercises.filter((item) => item !== id)
          : [...state.completedExercises, id],
      })),
      importSession: (payload) => set((state) => ({
        expression: payload.expression ?? state.expression,
        premises: payload.premises?.slice(0, 3) ?? state.premises,
        predicate: payload.predicate ?? state.predicate,
        mode: payload.mode ?? state.mode,
        selectedRow: 0,
        selectedStep: 0,
      })),
    }),
    {
      name: "math-universe-mathematical-logic-session",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        expression: state.expression,
        inferenceRule: state.inferenceRule,
        premises: state.premises,
        predicate: state.predicate,
        mode: state.mode,
        completedExercises: state.completedExercises,
      }),
    }
  )
);
