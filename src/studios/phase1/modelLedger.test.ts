import { describe, expect, it } from "vitest";
import { compatibleModel, ModelLedger } from "./modelLedger";
describe("displayed model history", () => {
  it("restores coordinated values, branches after undo, and resets defaults", () => {
    const ledger = new ModelLedger(); let rate = 2, principal = 100;
    ledger.register("rate", 2, 2, n => { rate = n as number; });
    ledger.register("principal", 100, 100, n => { principal = n as number; });
    ledger.commit("rate", 4); ledger.commit("principal", 300);
    ledger.undo(); expect([rate, principal]).toEqual([4, 100]);
    ledger.undo(); expect([rate, principal]).toEqual([2, 100]);
    ledger.redo(); expect(rate).toBe(4);
    ledger.commit("principal", 400); expect(ledger.future).toHaveLength(0);
    ledger.reset(); expect([rate, principal]).toEqual([2, 100]);
    ledger.undo(); expect([rate, principal]).toEqual([4, 400]);
  });
  it("groups synchronous changes from one gesture and keeps separate gestures separate",async()=>{const ledger=new ModelLedger();let x=1,y=2;ledger.register('x',1,1,n=>{x=n as number});ledger.register('y',2,2,n=>{y=n as number});ledger.commit('x',3,true);ledger.commit('y',4,true);expect(ledger.past).toHaveLength(1);await Promise.resolve();ledger.commit('x',5,true);ledger.undo();expect([x,y]).toEqual([3,4]);ledger.undo();expect([x,y]).toEqual([1,2]);ledger.redo();expect([x,y]).toEqual([3,4]);});
  it("keeps live edits and blur commits in one focused-field gesture",async()=>{const ledger=new ModelLedger();let value=3;ledger.register('value',3,3,n=>{value=n as number});ledger.register('notice','', '',()=>{});ledger.beginGesture();ledger.commit('value',4,true);await Promise.resolve();ledger.commit('notice','Committed',true);ledger.endGesture();ledger.undo();expect(value).toBe(3);ledger.redo();expect(value).toBe(4);});
  it("hydrates valid model data and rejects incompatible saved types", () => {
    const ledger = new ModelLedger({ point: { x: 4, y: 3 }, rate: "wrong" });
    expect(ledger.initial("point", { x: 0, y: 0 })).toEqual({ x: 4, y: 3 });
    expect(ledger.initial("rate", 2)).toBe(2);
    expect(compatibleModel([1, 2], ["bad"])).toBe(false);
  });
});
