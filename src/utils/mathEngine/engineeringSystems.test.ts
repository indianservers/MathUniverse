import { describe, expect, it } from "vitest";
import {
  buildBodeResponse,
  buildConvolutionResponse,
  buildEigenMode,
  buildFourierSynthesis,
  buildStressStrainCurve,
  buildVectorField,
  simulateHeatRod,
  simulateWaveString,
  solveFirstOrderOde,
} from "./engineeringSystems";

describe("engineeringSystems", () => {
  it("builds first-order Bode response with expected cutoff and rolloff", () => {
    const response = buildBodeResponse(2, 0.5, 32);

    expect(response.cutoffFrequency).toBeCloseTo(2);
    expect(response.dcGainDb).toBeCloseTo(20 * Math.log10(2));
    expect(response.points[0].magnitudeDb).toBeGreaterThan(response.points.at(-1)?.magnitudeDb ?? 0);
    expect(response.points.at(-1)?.phaseDeg).toBeLessThan(response.points[0].phaseDeg);
  });

  it("improves square-wave Fourier approximation as terms increase", () => {
    const few = buildFourierSynthesis(3, 1);
    const many = buildFourierSynthesis(15, 1);

    expect(few.harmonicAmplitudes).toHaveLength(3);
    expect(many.harmonicAmplitudes).toHaveLength(15);
    expect(many.rmsError).toBeLessThan(few.rmsError);
  });

  it("computes convolution and ODE responses with physical metrics", () => {
    const convolution = buildConvolutionResponse(0.8, 1.4);
    const ode = solveFirstOrderOde(0.8, 1.6, 0);

    expect(convolution.peak).toBeGreaterThan(0);
    expect(convolution.area).toBeGreaterThan(0);
    expect(ode.steadyState).toBeCloseTo(2);
    expect(ode.points.at(-1)?.y).toBeCloseTo(ode.steadyState, 1);
    expect(ode.settlingTime).toBeGreaterThan(0);
  });

  it("simulates heat and wave PDE profiles", () => {
    const heat = simulateHeatRod(0.9, 120);
    const wave = simulateWaveString(2, 1.1, 0.4);

    expect(heat.stabilityRatio).toBeGreaterThan(0);
    expect(heat.stabilityRatio).toBeLessThanOrEqual(0.49);
    expect(heat.finalProfile).toHaveLength(36);
    expect(heat.centerline.length).toBeGreaterThan(1);
    expect(wave.profile).toHaveLength(120);
    expect(wave.energy).toBeGreaterThanOrEqual(0);
  });

  it("reports vector field divergence and curl", () => {
    const field = buildVectorField(0.7, 0.2, 5);

    expect(field.samples).toHaveLength(25);
    expect(field.divergence).toBeCloseTo(0.4);
    expect(field.curl).toBeCloseTo(1.4);
  });

  it("builds stress-strain and eigenmode simulations", () => {
    const stress = buildStressStrainCurve(210, 0.01);
    const eigen = buildEigenMode(3, 210, 12);

    expect(stress.yieldStress).toBeCloseTo(2.1);
    expect(stress.resilience).toBeGreaterThan(0);
    expect(eigen.nodes).toEqual([0, 1 / 3, 2 / 3, 1]);
    expect(eigen.naturalFrequency).toBeGreaterThan(0);
    expect(eigen.profile).toHaveLength(120);
  });
});
