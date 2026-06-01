import { create } from "zustand";
import { persist } from "zustand/middleware";

export type CombinatoricsState = {
  items: string[];
  n: number;
  r: number;
  allowRepeat: boolean;
  constraint: string;
  pascalRows: number;
  binomialPower: number;
  multinomialPower: number;
  selectedTerm: number;
  challengeSeed: number;
  setItems: (items: string[]) => void;
  setN: (n: number) => void;
  setR: (r: number) => void;
  setAllowRepeat: (allowRepeat: boolean) => void;
  setConstraint: (constraint: string) => void;
  setPascalRows: (pascalRows: number) => void;
  setBinomialPower: (binomialPower: number) => void;
  setMultinomialPower: (multinomialPower: number) => void;
  setSelectedTerm: (selectedTerm: number) => void;
  randomizeChallenge: () => void;
};

export const useCombinatoricsStore = create<CombinatoricsState>()(
  persist(
    (set) => ({
      items: ["A", "B", "C", "D"],
      n: 6,
      r: 3,
      allowRepeat: false,
      constraint: "",
      pascalRows: 8,
      binomialPower: 5,
      multinomialPower: 3,
      selectedTerm: 0,
      challengeSeed: 1,
      setItems: (items) => set({ items }),
      setN: (n) => set({ n }),
      setR: (r) => set({ r }),
      setAllowRepeat: (allowRepeat) => set({ allowRepeat }),
      setConstraint: (constraint) => set({ constraint }),
      setPascalRows: (pascalRows) => set({ pascalRows }),
      setBinomialPower: (binomialPower) => set({ binomialPower, selectedTerm: 0 }),
      setMultinomialPower: (multinomialPower) => set({ multinomialPower }),
      setSelectedTerm: (selectedTerm) => set({ selectedTerm }),
      randomizeChallenge: () => set({ challengeSeed: Date.now() }),
    }),
    { name: "math-universe-combinatorics-session" }
  )
);
