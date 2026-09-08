import { describe, expect, it } from "vitest";
import * as m from "./modellingEnhancementEngine";
const data = [{x:0,y:1},{x:1,y:3.1},{x:2,y:4.9},{x:3,y:7.1},{x:4,y:8.9}];

describe("Modelling enhancement engine", () => {
  it("covers workflow, units, data import, fitting, selection, residuals, intervals", () => {
    expect(m.modellingWorkflow("growth?", ["closed","constant rate"], ["t","y"], ["y=at+b"]).ready).toBe(true);
    expect(m.checkUnits([{coefficient:1,unit:{L:1}},{coefficient:2,unit:{L:1}}]).consistent).toBe(true);
    expect(m.importObservations("0,1\n1,3").valid).toBe(true);
    const fit = m.fitLinear(data);
    expect(fit.slope).toBeCloseTo(2, 1);
    expect(m.informationCriteria(data, fit.predict, 2).rss).toBeLessThan(.1);
    expect(m.residualDiagnostics(data, fit.predict).rmse).toBeLessThan(.2);
    expect(m.linearParameterIntervals(data).slope[0]).toBeLessThan(2);
  });
  it("covers sensitivity, identifiability, validation, scenarios, interventions and seasonal delay", () => {
    expect(m.sensitivity((p)=>p[0]*p[1],[2,3])[0].derivative).toBeCloseTo(3);
    expect(m.identifiability([[1,2],[2,4],[3,6]]).identifiable).toBe(false);
    expect(m.kFoldValidation(data,2).foldErrors).toHaveLength(2);
    expect(m.compareScenarios((t,p)=>p*t,[0,1],[1,2])).toHaveLength(2);
    expect(m.piecewiseIntervention(10,.1,-.1,2,4).value).toBeCloseTo(10);
    expect(m.seasonalDelay(10,1,2,12,0,3).value).toBe(15);
  });
  it("covers system, compartment, agent, stochastic and numerical models", () => {
    const sir=m.sirStep({s:.9,i:.1,r:0},.5,.2,.1);
    expect(sir.s+sir.i+sir.r).toBeCloseTo(1);
    expect(m.predatorPreyStep({prey:10,predator:2},{growth:.1,interaction:.01,conversion:.005,death:.1},.1).prey).toBeGreaterThan(10);
    expect(m.compartmentStep([100,0],[{from:0,to:1,rate:.1}],1)).toEqual([90,10]);
    expect(m.agentSimulation(20,.5,5,2).history).toHaveLength(6);
    expect(m.monteCarlo((random)=>random(),500,2).mean).toBeCloseTo(.5,1);
    expect(m.odeSolverComparison((_t,y)=>y,1,1,100).rk4).toBeCloseTo(Math.E,6);
  });
  it("covers queueing, calibration, dimensional analysis, sweeps, provenance and exports", () => {
    expect(m.mm1Queue(2,3).expectedSystem).toBe(1);
    expect(m.constrainedCalibration(data,(x,p)=>1+p*x,0,4).parameter).toBeCloseTo(2,1);
    expect(m.dimensionalAnalysis([[1,0,1],[0,1,-1]]).dimensionlessGroups).toBe(1);
    expect(m.parameterSweep((a,b)=>a*b,[1,2],[3,4])[1][1].value).toBe(8);
    expect(m.provenance({model:"linear",parameters:{a:2},assumptions:[],dataHash:"x"}).versionId).toBeTruthy();
    expect(m.exportModelReport({equations:["y=ax"],parameters:{a:2},simulation:data,diagnostics:{}}).generatedSections).toHaveLength(4);
  });
});
