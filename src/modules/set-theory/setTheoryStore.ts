import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { OrderedPair, SetOperation } from "./setTheoryEngine";

export type SetTheoryState = {
  universe: string[];
  setA: string[];
  setB: string[];
  setC: string[];
  relationPairs: OrderedPair[];
  functionPairs: OrderedPair[];
  operation: SetOperation;
  playbackStep: number;
  challengeSeed: number;
  setUniverse: (values: string[]) => void;
  setSetA: (values: string[]) => void;
  setSetB: (values: string[]) => void;
  setSetC: (values: string[]) => void;
  setRelationPairs: (values: OrderedPair[]) => void;
  setFunctionPairs: (values: OrderedPair[]) => void;
  setOperation: (operation: SetOperation) => void;
  setPlaybackStep: (step: number) => void;
  randomizeChallenge: () => void;
};

export const useSetTheoryStore = create<SetTheoryState>()(
  persist(
    (set) => ({
      universe: ["1", "2", "3", "4", "5", "6"],
      setA: ["1", "2", "3", "5"],
      setB: ["2", "4", "5", "6"],
      setC: ["1", "4", "6"],
      relationPairs: [["1", "1"], ["1", "2"], ["2", "2"], ["2", "4"], ["3", "3"], ["4", "4"], ["5", "5"], ["6", "6"]],
      functionPairs: [["1", "a"], ["2", "b"], ["3", "b"], ["5", "c"]],
      operation: "union",
      playbackStep: 0,
      challengeSeed: 1,
      setUniverse: (universe) => set({ universe }),
      setSetA: (setA) => set({ setA }),
      setSetB: (setB) => set({ setB }),
      setSetC: (setC) => set({ setC }),
      setRelationPairs: (relationPairs) => set({ relationPairs }),
      setFunctionPairs: (functionPairs) => set({ functionPairs }),
      setOperation: (operation) => set({ operation, playbackStep: 0 }),
      setPlaybackStep: (playbackStep) => set({ playbackStep }),
      randomizeChallenge: () => set({ challengeSeed: Date.now() }),
    }),
    { name: "math-universe-set-theory-session" }
  )
);
