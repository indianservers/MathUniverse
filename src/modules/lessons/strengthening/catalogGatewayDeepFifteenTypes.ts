import type { GatewayExamItem } from "./catalogGatewayEnhancements";

export type DeepFifteen = {
  id: number;
  canvas: { title: string; layers: readonly string[]; forbidden: string };
  trap: { wrong: string; right: string };
  identity: string;
  secondMisconception: { wrong: string; correction: string };
  counterexample: { setup: string; result: string };
  boardExam: GatewayExamItem;
  spoken: string;
  keyboard: { keys: string; action: string };
  handoff: { sentence: string; href: string; label: string };
  generator: { seed: string; items: readonly [string, string, string] };
  errorHatch: { trigger: string; message: string };
  copyExact: string;
  workedFromLive: readonly [string, string, string];
  probe: GatewayExamItem;
  unlockGate: { requirement: string; checkLabel: string };
};
