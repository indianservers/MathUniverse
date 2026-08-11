export type SimulationModel = {
  id: string;
  name: string;
  category: "motion" | "dynamics" | "probability" | "optimization";
  parameters: [string, number, number, number][];
  sample: (t: number, values: Record<string, number>) => number;
  equation: string;
  note: string;
};

const model = (definition: SimulationModel) => definition;

export const SIMULATION_MODELS: SimulationModel[] = [
  model({ id: "projectile", name: "Projectile height", category: "motion", parameters: [["speed", 18, 2, 40], ["gravity", 9.8, 1, 15]], equation: "h(t)=v0 t-g t^2/2", note: "Ideal vertical motion without drag.", sample: (t, p) => Math.max(0, p.speed * t - 0.5 * p.gravity * t * t) }),
  model({ id: "spring", name: "Spring oscillator", category: "motion", parameters: [["amplitude", 3, 0.2, 6], ["frequency", 2, 0.2, 6]], equation: "x(t)=A cos(omega t)", note: "Undamped simple harmonic motion.", sample: (t, p) => p.amplitude * Math.cos(p.frequency * t) }),
  model({ id: "damped-spring", name: "Damped oscillator", category: "motion", parameters: [["damping", 0.25, 0, 1], ["frequency", 3, 0.5, 7]], equation: "x(t)=e^(-ct) cos(omega t)", note: "Exponential damping envelope.", sample: (t, p) => 5 * Math.exp(-p.damping * t) * Math.cos(p.frequency * t) }),
  model({ id: "wave", name: "Traveling wave probe", category: "motion", parameters: [["speed", 2, 0.2, 6], ["frequency", 3, 0.5, 8]], equation: "u(0,t)=sin(omega t-vt)", note: "Value observed at one point of a traveling wave.", sample: (t, p) => Math.sin((p.frequency - p.speed) * t) }),
  model({ id: "beats", name: "Acoustic beats", category: "motion", parameters: [["f1", 4, 1, 8], ["f2", 4.5, 1, 8]], equation: "sin(f1 t)+sin(f2 t)", note: "Interference between nearby frequencies.", sample: (t, p) => Math.sin(p.f1 * t) + Math.sin(p.f2 * t) }),
  model({ id: "logistic", name: "Logistic population", category: "dynamics", parameters: [["rate", 1.2, 0.1, 3], ["capacity", 10, 2, 20]], equation: "P(t)=K/(1+9e^(-rt))", note: "Closed-form logistic growth from P(0)=K/10.", sample: (t, p) => p.capacity / (1 + 9 * Math.exp(-p.rate * t)) }),
  model({ id: "cooling", name: "Newton cooling", category: "dynamics", parameters: [["rate", 0.5, 0.05, 2], ["ambient", 2, -5, 8]], equation: "T(t)=Ta+(T0-Ta)e^(-kt)", note: "Temperature relaxes toward ambient.", sample: (t, p) => p.ambient + (10 - p.ambient) * Math.exp(-p.rate * t) }),
  model({ id: "charging", name: "Capacitor charging", category: "dynamics", parameters: [["tau", 2, 0.2, 6], ["voltage", 8, 1, 14]], equation: "V(t)=V0(1-e^(-t/tau))", note: "First-order RC charging curve.", sample: (t, p) => p.voltage * (1 - Math.exp(-t / p.tau)) }),
  model({ id: "decay", name: "Radioactive decay", category: "dynamics", parameters: [["halfLife", 3, 0.5, 8], ["amount", 10, 1, 20]], equation: "N(t)=N0 2^(-t/H)", note: "Exponential decay parameterized by half-life.", sample: (t, p) => p.amount * 2 ** (-t / p.halfLife) }),
  model({ id: "predator", name: "Predator-prey pulse", category: "dynamics", parameters: [["coupling", 1.1, 0.2, 3], ["phase", 1, 0, 6.28]], equation: "x(t)=4+2sin(ct)+sin(2ct+phi)", note: "A bounded qualitative population pulse, not a full Lotka-Volterra solver.", sample: (t, p) => 4 + 2 * Math.sin(p.coupling * t) + Math.sin(2 * p.coupling * t + p.phase) }),
  model({ id: "lorenz-x", name: "Lorenz x projection", category: "dynamics", parameters: [["sigma", 10, 4, 18], ["rho", 28, 10, 40]], equation: "x'=sigma(y-x), y'=x(rho-z)-y, z'=xy-8z/3", note: "RK4 integration, displaying the x coordinate.", sample: lorenzSample }),
  model({ id: "logistic-map", name: "Logistic map", category: "dynamics", parameters: [["r", 3.72, 2.5, 4], ["seed", 0.21, 0.01, 0.99]], equation: "x[n+1]=r x[n](1-x[n])", note: "Discrete nonlinear iteration.", sample: (t, p) => iterate(Math.floor(t * 8), p.seed, (x) => p.r * x * (1 - x)) * 10 }),
  model({ id: "coin-mean", name: "Coin mean convergence", category: "probability", parameters: [["probability", 0.5, 0.05, 0.95], ["seed", 3, 1, 20]], equation: "mean_n=(X1+...+Xn)/n", note: "Deterministic seeded Bernoulli experiment.", sample: (t, p) => seededMean(Math.max(1, Math.floor(t * 18)), p.probability, p.seed) * 10 }),
  model({ id: "random-walk", name: "Random walk", category: "probability", parameters: [["bias", 0.5, 0.05, 0.95], ["seed", 7, 1, 20]], equation: "S[n]=sum Xi, Xi in {-1,1}", note: "Deterministic seeded one-dimensional walk.", sample: (t, p) => seededWalk(Math.floor(t * 10), p.bias, p.seed) }),
  model({ id: "normal", name: "Normal density scan", category: "probability", parameters: [["mean", 0, -4, 4], ["sigma", 1, 0.2, 3]], equation: "phi(x)=e^-((x-mu)^2/(2sigma^2))/(sigma sqrt(2pi))", note: "The timeline acts as the horizontal variable.", sample: (t, p) => 18 * Math.exp(-((t - 5 - p.mean) ** 2) / (2 * p.sigma ** 2)) / (p.sigma * Math.sqrt(2 * Math.PI)) }),
  model({ id: "poisson", name: "Poisson event curve", category: "probability", parameters: [["rate", 3, 0.5, 8], ["events", 2, 0, 8]], equation: "P(X=k)=e^-lambda lambda^k/k!", note: "Probability changes as the timeline scales lambda.", sample: (t, p) => 10 * Math.exp(-p.rate * t / 5) * (p.rate * t / 5) ** Math.round(p.events) / factorial(Math.round(p.events)) }),
  model({ id: "gradient", name: "Gradient descent", category: "optimization", parameters: [["learningRate", 0.2, 0.02, 0.8], ["start", 7, -9, 9]], equation: "x[n+1]=x[n]-eta*2x[n]", note: "Iterative minimization of f(x)=x^2.", sample: (t, p) => iterate(Math.floor(t * 4), p.start, (x) => x - p.learningRate * 2 * x) }),
  model({ id: "newton", name: "Newton root search", category: "optimization", parameters: [["start", 5, 0.2, 9], ["target", 2, 0.2, 8]], equation: "x[n+1]=(x[n]+a/x[n])/2", note: "Newton iteration for sqrt(a).", sample: (t, p) => iterate(Math.floor(t * 4), p.start, (x) => 0.5 * (x + p.target / x)) }),
  model({ id: "annealing", name: "Cooling schedule", category: "optimization", parameters: [["temperature", 9, 1, 15], ["rate", 0.75, 0.2, 0.98]], equation: "T[n]=T0 alpha^n", note: "Geometric simulated-annealing temperature schedule.", sample: (t, p) => p.temperature * p.rate ** Math.floor(t * 3) }),
  model({ id: "fourier", name: "Fourier square wave", category: "optimization", parameters: [["terms", 5, 1, 15], ["frequency", 2, 0.5, 5]], equation: "4/pi sum sin((2k+1)wt)/(2k+1)", note: "Finite odd-harmonic Fourier synthesis.", sample: (t, p) => fourier(t, Math.round(p.terms), p.frequency) }),
];

export function defaultSimulationParameters(model: SimulationModel) {
  return Object.fromEntries(model.parameters.map(([name, value]) => [name, value]));
}

export function simulationSeries(model: SimulationModel, values: Record<string, number>, count = 220) {
  return Array.from({ length: count }, (_, index) => {
    const t = index / (count - 1) * 10;
    const value = model.sample(t, values);
    return { t, value: Number.isFinite(value) ? value : 0 };
  });
}

function iterate(count: number, initial: number, next: (value: number) => number) {
  let value = initial;
  for (let index = 0; index < count; index += 1) value = next(value);
  return value;
}

function random(seed: number) {
  const value = Math.sin(seed * 12.9898) * 43758.5453;
  return value - Math.floor(value);
}

function seededMean(count: number, probability: number, seed: number) {
  let total = 0;
  for (let index = 0; index < count; index += 1) total += random(seed + index) < probability ? 1 : 0;
  return total / count;
}

function seededWalk(count: number, probability: number, seed: number) {
  let value = 0;
  for (let index = 0; index < count; index += 1) value += random(seed + index) < probability ? 1 : -1;
  return value;
}

function factorial(value: number) {
  let result = 1;
  for (let index = 2; index <= value; index += 1) result *= index;
  return result;
}

function fourier(t: number, terms: number, frequency: number) {
  let value = 0;
  for (let index = 0; index < terms; index += 1) value += Math.sin((2 * index + 1) * frequency * t) / (2 * index + 1);
  return 4 * value / Math.PI;
}

function lorenzSample(t: number, p: Record<string, number>) {
  let x = 1;
  let y = 1;
  let z = 1;
  const dt = 0.008;
  const steps = Math.floor(t / dt);
  for (let index = 0; index < steps; index += 1) {
    const dx = p.sigma * (y - x);
    const dy = x * (p.rho - z) - y;
    const dz = x * y - (8 / 3) * z;
    x += dx * dt;
    y += dy * dt;
    z += dz * dt;
  }
  return x / 3;
}
