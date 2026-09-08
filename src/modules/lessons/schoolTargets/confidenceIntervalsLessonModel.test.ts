import { expect,it } from "vitest";
import { confidenceRun,gradeConfidenceAnswers,intervalForMean } from "./confidenceIntervalsLessonModel";
it("computes the worked known-sigma interval",()=>{
  const interval=intervalForMean(50,64,12,95);expect(interval.se).toBe(1.5);expect(interval.margin).toBeCloseTo(2.93994597681,9);expect(interval.lower).toBeCloseTo(47.06005402319,9);expect(interval.upper).toBeCloseTo(52.93994597681,9);expect(interval.contains).toBe(true);
  expect(intervalForMean(55,64,12,95).contains).toBe(false);
});
it("uses square-root sample size scaling and larger-confidence widths",()=>{
  const base=intervalForMean(50,64,12,95);expect(intervalForMean(50,256,12,95).margin).toBe(base.margin/2);expect(intervalForMean(50,64,24,95).margin).toBe(base.margin*2);expect(intervalForMean(50,64,12,99).margin).toBeGreaterThan(base.margin);expect(intervalForMean(50,64,12,90).margin).toBeLessThan(base.margin);
});
it("reproduces seeded actual samples and changes them for a new seed",()=>{
  const run=confidenceRun(64,12,95,1);expect(run).toEqual(confidenceRun(64,12,95,1));expect(run.intervals).toHaveLength(100);expect(run.intervals[0].mean).not.toBe(confidenceRun(64,12,95,2).intervals[0].mean);expect(run.covered).toBe(run.intervals.filter(i=>i.lower<=50&&i.upper>=50).length);
  for(const interval of run.intervals){expect((interval.lower+interval.upper)/2).toBeCloseTo(interval.mean,12);expect(interval.upper-interval.lower).toBeCloseTo(2*interval.margin,12);}
});
it("retains sample means and nests intervals as confidence increases",()=>{
  const low=confidenceRun(64,12,90,8),middle=confidenceRun(64,12,95,8),high=confidenceRun(64,12,99,8);
  low.intervals.forEach((interval,i)=>{expect(interval.mean).toBe(high.intervals[i].mean);expect(interval.lower).toBeGreaterThan(middle.intervals[i].lower);expect(middle.intervals[i].lower).toBeGreaterThan(high.intervals[i].lower);});expect(high.covered).toBeGreaterThanOrEqual(low.covered);
});
it("rejects invalid settings and grades all four conceptual answers",()=>{
  for(const [n,sigma] of [[3,12],[401,12],[64,0],[64,31],[NaN,12]])expect(()=>intervalForMean(50,n,sigma,95)).toThrow();expect(()=>confidenceRun(64,12,95,0)).toThrow();expect(()=>confidenceRun(64,12,95,Infinity)).toThrow();expect(gradeConfidenceAnswers([2,2,1,1])).toEqual([true,true,true,true]);expect(gradeConfidenceAnswers([-1,-1,-1,-1])).toEqual([false,false,false,false]);
});
