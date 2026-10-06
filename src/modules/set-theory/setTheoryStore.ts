import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { OrderedPair, SetOperation } from "./setTheoryEngine";

export type SetTheoryState = {
  names: [string,string,string,string];
  setNames: (names:[string,string,string,string]) => void;
  relationDomain: string[];
  relationCodomain: string[];
  mappingDomain: string[];
  mappingCodomain: string[];
  setRelationDomain: (values:string[]) => void;
  setRelationCodomain: (values:string[]) => void;
  setMappingDomain: (values:string[]) => void;
  setMappingCodomain: (values:string[]) => void;
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
      names: ["Students in the class", "Math Lovers", "Science Lovers", "Coding Lovers"],
      setNames: (names) => set({names}),
      relationDomain: ["1","2","3","4"], relationCodomain: ["1","2","3","4"],
      mappingDomain: ["1","2","3","4"], mappingCodomain: ["a","b","c","d"],
      setRelationDomain: (relationDomain) => set({relationDomain}),
      setRelationCodomain: (relationCodomain) => set({relationCodomain}),
      setMappingDomain: (mappingDomain) => set({mappingDomain}),
      setMappingCodomain: (mappingCodomain) => set({mappingCodomain}),
      universe: ["1", "2", "3", "4", "5", "6"],
      setA: ["1", "2", "3", "5"],
      setB: ["2", "4", "5", "6"],
      setC: ["1", "4", "6"],
      relationPairs: [["1","2"],["1","4"],["2","2"],["3","1"],["3","3"],["4","2"],["4","3"]],
      functionPairs: [["1","a"],["2","b"],["3","b"],["4","c"]],
      operation: "union",
      playbackStep: 0,
      challengeSeed: 1,
      setUniverse: (universe) => set(s=>({ universe, setA:s.setA.filter(x=>universe.includes(x)),setB:s.setB.filter(x=>universe.includes(x)),setC:s.setC.filter(x=>universe.includes(x)) })),
      setSetA: (setA) => set(s=>({ setA:Array.from(new Set(setA)), universe:Array.from(new Set([...s.universe,...setA])) })),
      setSetB: (setB) => set(s=>({ setB:Array.from(new Set(setB)), universe:Array.from(new Set([...s.universe,...setB])) })),
      setSetC: (setC) => set(s=>({ setC:Array.from(new Set(setC)), universe:Array.from(new Set([...s.universe,...setC])) })),
      setRelationPairs: (relationPairs) => set({ relationPairs }),
      setFunctionPairs: (functionPairs) => set({ functionPairs }),
      setOperation: (operation) => set({ operation, playbackStep: 0 }),
      setPlaybackStep: (playbackStep) => set({ playbackStep }),
      randomizeChallenge: () => set({ challengeSeed: Date.now() }),
    }),
    { name: "math-universe-set-theory-session", storage: createJSONStorage(() => localStorage) }
  )
);
