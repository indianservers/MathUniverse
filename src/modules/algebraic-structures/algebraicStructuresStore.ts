import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { modularTable, rebuildOperationTable, type OperationTable } from "./algebraicStructuresEngine";

export type AlgebraicStructuresMode = "educational" | "quiz";

export type AlgebraicStructuresState = {
  elements: string[];
  table: OperationTable;
  selectedA: string;
  selectedB: string;
  booleanExpression: string;
  gate: "AND" | "OR" | "NOT" | "XOR";
  inputA: boolean;
  inputB: boolean;
  law: "de-morgan" | "distributive" | "associative" | "complement";
  mode: AlgebraicStructuresMode;
  setElements: (elements: string[]) => void;
  setTable: (table: OperationTable) => void;
  useModularTable: (size: number, mode: "add" | "multiply") => void;
  setSelected: (a: string, b: string) => void;
  setBooleanExpression: (expression: string) => void;
  setGate: (gate: "AND" | "OR" | "NOT" | "XOR") => void;
  setInputA: (value: boolean) => void;
  setInputB: (value: boolean) => void;
  setLaw: (law: "de-morgan" | "distributive" | "associative" | "complement") => void;
  setMode: (mode: AlgebraicStructuresMode) => void;
};

const initial = modularTable(4, "add");

export const useAlgebraicStructuresStore = create<AlgebraicStructuresState>()(
  persist(
    (set) => ({
      elements: initial.elements,
      table: initial.table,
      selectedA: "1",
      selectedB: "2",
      booleanExpression: "A & (!B | C)",
      gate: "AND",
      inputA: true,
      inputB: false,
      law: "de-morgan",
      mode: "educational",
      setElements: (elements) => set((state) => ({ elements, table: rebuildOperationTable(elements, state.table) })),
      setTable: (table) => set({ table }),
      useModularTable: (size, mode) => set(modularTable(size, mode)),
      setSelected: (selectedA, selectedB) => set({ selectedA, selectedB }),
      setBooleanExpression: (booleanExpression) => set({ booleanExpression }),
      setGate: (gate) => set({ gate }),
      setInputA: (inputA) => set({ inputA }),
      setInputB: (inputB) => set({ inputB }),
      setLaw: (law) => set({ law }),
      setMode: (mode) => set({ mode }),
    }),
    { name: "math-universe-algebraic-structures-session", storage: createJSONStorage(() => localStorage) }
  )
);
