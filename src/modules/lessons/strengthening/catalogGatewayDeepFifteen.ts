import { gatewayEnhancementIds } from "./catalogGatewayEnhancements";
import { deepFifteenCore } from "./catalogGatewayDeepFifteenCore";
import { deepFifteenSchoolAdvanced } from "./catalogGatewayDeepFifteenSchool";
import type { DeepFifteen } from "./catalogGatewayDeepFifteenTypes";

export type { DeepFifteen } from "./catalogGatewayDeepFifteenTypes";

export const gatewayDeepFifteen: Record<number, DeepFifteen> = {
  ...deepFifteenCore,
  ...deepFifteenSchoolAdvanced,
};

export const gatewayDeepFifteenIds = gatewayEnhancementIds;

export function fillDeepTemplate(template: string, live: string, t: number) {
  const n = 1 + Math.round(t * 8);
  return template.replaceAll("{live}", live).replaceAll("{n}", String(n)).replaceAll("{t}", t.toFixed(2));
}

export function deepFifteenSlots(spec: DeepFifteen) {
  return [
    { key: "canvas", title: "1. Topic canvas object", body: spec.canvas.title },
    { key: "trap", title: "2. Trap overlay", body: spec.trap.wrong },
    { key: "identity", title: "3. Linked identity", body: spec.identity },
    { key: "misconception", title: "4. Second misconception", body: spec.secondMisconception.wrong },
    { key: "counterexample", title: "5. Counterexample", body: spec.counterexample.setup },
    { key: "board", title: "6. Board-exam item", body: spec.boardExam.prompt },
    { key: "spoken", title: "7. Spoken sentence", body: spec.spoken },
    { key: "keyboard", title: "8. Keyboard handle", body: spec.keyboard.keys },
    { key: "handoff", title: "9. Next-lesson handoff", body: spec.handoff.sentence },
    { key: "generator", title: "10. Seeded generator", body: spec.generator.seed },
    { key: "hatch", title: "11. Error hatch", body: spec.errorHatch.trigger },
    { key: "copy", title: "12. Copy exact answer", body: spec.copyExact },
    { key: "worked", title: "13. Live worked example", body: spec.workedFromLive[0] },
    { key: "probe", title: "14. Yes/no probe", body: spec.probe.prompt },
    { key: "gate", title: "15. Unlock gate", body: spec.unlockGate.requirement },
  ] as const;
}
