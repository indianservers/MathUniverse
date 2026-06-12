export type XYPoint = {
  x: number;
  y: number;
};

export type BodePoint = {
  frequency: number;
  magnitudeDb: number;
  phaseDeg: number;
};

export type BodeResponse = {
  points: BodePoint[];
  cutoffFrequency: number;
  dcGainDb: number;
};

export type FourierSynthesis = {
  points: XYPoint[];
  harmonicAmplitudes: XYPoint[];
  rmsError: number;
};

export type ConvolutionResponse = {
  points: XYPoint[];
  peak: number;
  area: number;
};

export type OdeResponse = {
  points: XYPoint[];
  steadyState: number;
  settlingTime: number;
};

export type HeatRodSimulation = {
  finalProfile: XYPoint[];
  centerline: XYPoint[];
  stabilityRatio: number;
};

export type WaveStringSimulation = {
  profile: XYPoint[];
  energy: number;
};

export type VectorFieldSample = {
  x: number;
  y: number;
  u: number;
  v: number;
};

export type VectorFieldSimulation = {
  samples: VectorFieldSample[];
  divergence: number;
  curl: number;
};

export type StressStrainSimulation = {
  points: XYPoint[];
  yieldStress: number;
  resilience: number;
};

export type EigenModeSimulation = {
  profile: XYPoint[];
  naturalFrequency: number;
  nodes: number[];
};

export function buildBodeResponse(gain: number, timeConstant: number, samples = 80): BodeResponse {
  const safeGain = Math.max(0.05, gain);
  const tau = Math.max(0.02, timeConstant);
  const frequencies = logspace(-1, 2, samples);
  const points = frequencies.map((frequency) => {
    const omegaTau = frequency * tau;
    return {
      frequency,
      magnitudeDb: 20 * Math.log10(safeGain / Math.sqrt(1 + omegaTau * omegaTau)),
      phaseDeg: -(Math.atan(omegaTau) * 180) / Math.PI,
    };
  });
  return {
    points,
    cutoffFrequency: 1 / tau,
    dcGainDb: 20 * Math.log10(safeGain),
  };
}

export function buildFourierSynthesis(terms: number, amplitude: number, samples = 160): FourierSynthesis {
  const safeTerms = clampInteger(terms, 1, 31);
  const safeAmplitude = Math.max(0.1, amplitude);
  const harmonics = Array.from({ length: safeTerms }, (_, index) => index * 2 + 1);
  const points = Array.from({ length: samples }, (_, index) => {
    const x = (index / (samples - 1)) * Math.PI * 2;
    const y = harmonics.reduce((sum, harmonic) => sum + Math.sin(harmonic * x) / harmonic, 0) * (4 * safeAmplitude / Math.PI);
    return { x, y };
  });
  const rmsError = Math.sqrt(points.reduce((sum, point) => {
    const target = point.x === 0 || Math.abs(point.x - Math.PI) < 1e-9 || Math.abs(point.x - Math.PI * 2) < 1e-9 ? 0 : point.x < Math.PI ? safeAmplitude : -safeAmplitude;
    return sum + (point.y - target) ** 2;
  }, 0) / points.length);
  return {
    points,
    harmonicAmplitudes: harmonics.map((harmonic) => ({ x: harmonic, y: 4 * safeAmplitude / (Math.PI * harmonic) })),
    rmsError,
  };
}

export function buildConvolutionResponse(tau: number, pulseWidth: number, duration = 8, samples = 140): ConvolutionResponse {
  const safeTau = Math.max(0.05, tau);
  const safeWidth = Math.max(0.05, pulseWidth);
  const points = Array.from({ length: samples }, (_, index) => {
    const t = (index / (samples - 1)) * duration;
    const y = t <= safeWidth
      ? 1 - Math.exp(-t / safeTau)
      : (1 - Math.exp(-safeWidth / safeTau)) * Math.exp(-(t - safeWidth) / safeTau);
    return { x: t, y };
  });
  return {
    points,
    peak: Math.max(...points.map((point) => point.y)),
    area: trapezoidArea(points),
  };
}

export function solveFirstOrderOde(rate: number, forcing: number, initial: number, duration = 8, step = 0.05): OdeResponse {
  const safeRate = Math.max(0.02, rate);
  const safeStep = Math.max(0.005, step);
  const steadyState = forcing / safeRate;
  const points: XYPoint[] = [];
  let y = initial;
  for (let t = 0; t <= duration + 1e-9; t += safeStep) {
    points.push({ x: round(t), y });
    y = rk4Step(y, safeStep, (value) => forcing - safeRate * value);
  }
  const tolerance = Math.max(0.02, Math.abs(steadyState) * 0.02);
  const settled = points.find((point) => Math.abs(point.y - steadyState) <= tolerance);
  return {
    points,
    steadyState,
    settlingTime: settled?.x ?? duration,
  };
}

export function simulateHeatRod(alpha: number, steps: number, points = 36): HeatRodSimulation {
  const safePoints = clampInteger(points, 8, 80);
  const safeSteps = clampInteger(steps, 1, 500);
  const dx = 1 / (safePoints - 1);
  const dt = 0.0008;
  const stabilityRatio = Math.min(0.49, Math.max(0.01, alpha * dt / (dx * dx)));
  let current = Array.from({ length: safePoints }, (_, index) => {
    const x = index / (safePoints - 1);
    return Math.exp(-80 * (x - 0.5) ** 2);
  });
  const centerline: XYPoint[] = [{ x: 0, y: current[Math.floor(safePoints / 2)] }];
  const sampleStep = Math.max(1, Math.floor(safeSteps / 80));
  for (let step = 1; step <= safeSteps; step += 1) {
    const next = [...current];
    for (let index = 1; index < safePoints - 1; index += 1) {
      next[index] = current[index] + stabilityRatio * (current[index - 1] - 2 * current[index] + current[index + 1]);
    }
    next[0] = 0;
    next[safePoints - 1] = 0;
    current = next;
    if (step === safeSteps || step % sampleStep === 0) centerline.push({ x: step, y: current[Math.floor(safePoints / 2)] });
  }
  return {
    finalProfile: current.map((value, index) => ({ x: index / (safePoints - 1), y: value })),
    centerline,
    stabilityRatio,
  };
}

export function simulateWaveString(mode: number, speed: number, time: number, points = 120): WaveStringSimulation {
  const safeMode = clampInteger(mode, 1, 6);
  const safeSpeed = Math.max(0.1, speed);
  const profile = Array.from({ length: points }, (_, index) => {
    const x = index / (points - 1);
    const y = Math.sin(safeMode * Math.PI * x) * Math.cos(safeMode * Math.PI * safeSpeed * time);
    return { x, y };
  });
  return {
    profile,
    energy: profile.reduce((sum, point) => sum + point.y * point.y, 0) / points,
  };
}

export function buildVectorField(swirl: number, source: number, grid = 7): VectorFieldSimulation {
  const safeGrid = clampInteger(grid, 3, 11);
  const samples: VectorFieldSample[] = [];
  for (let row = 0; row < safeGrid; row += 1) {
    for (let column = 0; column < safeGrid; column += 1) {
      const x = -1 + (2 * column) / (safeGrid - 1);
      const y = -1 + (2 * row) / (safeGrid - 1);
      samples.push({
        x,
        y,
        u: source * x - swirl * y,
        v: swirl * x + source * y,
      });
    }
  }
  return {
    samples,
    divergence: 2 * source,
    curl: 2 * swirl,
  };
}

export function buildStressStrainCurve(youngModulus: number, yieldStrain: number, maxStrain = 0.08, samples = 100): StressStrainSimulation {
  const safeE = Math.max(1, youngModulus);
  const safeYield = Math.min(maxStrain * 0.8, Math.max(0.002, yieldStrain));
  const yieldStress = safeE * safeYield;
  const points = Array.from({ length: samples }, (_, index) => {
    const strain = (index / (samples - 1)) * maxStrain;
    const plasticHardening = yieldStress + safeE * 0.08 * Math.max(0, strain - safeYield);
    const stress = strain <= safeYield ? safeE * strain : plasticHardening;
    return { x: strain, y: stress };
  });
  return {
    points,
    yieldStress,
    resilience: 0.5 * yieldStress * safeYield,
  };
}

export function buildEigenMode(mode: number, stiffness: number, mass: number, points = 120): EigenModeSimulation {
  const safeMode = clampInteger(mode, 1, 5);
  const safeStiffness = Math.max(0.1, stiffness);
  const safeMass = Math.max(0.1, mass);
  const profile = Array.from({ length: points }, (_, index) => {
    const x = index / (points - 1);
    return { x, y: Math.sin(safeMode * Math.PI * x) };
  });
  return {
    profile,
    naturalFrequency: safeMode * Math.sqrt(safeStiffness / safeMass) / (2 * Math.PI),
    nodes: Array.from({ length: safeMode + 1 }, (_, index) => index / safeMode),
  };
}

function logspace(startPower: number, endPower: number, samples: number) {
  return Array.from({ length: samples }, (_, index) => {
    const ratio = index / (samples - 1);
    return 10 ** (startPower + (endPower - startPower) * ratio);
  });
}

function rk4Step(y: number, h: number, derivative: (value: number) => number) {
  const k1 = derivative(y);
  const k2 = derivative(y + (h * k1) / 2);
  const k3 = derivative(y + (h * k2) / 2);
  const k4 = derivative(y + h * k3);
  return y + (h / 6) * (k1 + 2 * k2 + 2 * k3 + k4);
}

function trapezoidArea(points: XYPoint[]) {
  let area = 0;
  for (let index = 1; index < points.length; index += 1) {
    const width = points[index].x - points[index - 1].x;
    area += width * (points[index].y + points[index - 1].y) / 2;
  }
  return area;
}

function clampInteger(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, Math.round(Number.isFinite(value) ? value : min)));
}

function round(value: number) {
  return Math.round(value * 1_000_000) / 1_000_000;
}
