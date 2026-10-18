export const lfoSolution = (x: number, c = 2 / 3) => Math.exp(x) / 3 + c * Math.exp(-2 * x);
export const lfoDerivative = (x: number, c = 2 / 3) => Math.exp(x) / 3 - 2 * c * Math.exp(-2 * x);
export const lfoMu = (x: number) => Math.exp(2 * x);
export const lfoTerms = (x: number, c = 2 / 3) => [lfoMu(x) * lfoDerivative(x, c), 2 * lfoMu(x) * lfoSolution(x, c), Math.exp(3 * x)];
export const lfoResidual = (x: number, c = 2 / 3) => lfoDerivative(x, c) + 2 * lfoSolution(x, c) - Math.exp(x);
export function lfoRK4(x: number, h = .02) {
  if (!Number.isFinite(x) || !Number.isFinite(h) || h <= 0) throw new RangeError('Finite x and positive step required');
  let t = 0, y = 1;
  const count = Math.ceil(Math.abs(x) / h), step = count ? x / count : 0;
  const f = (a: number, b: number) => Math.exp(a) - 2 * b;
  for (let i = 0; i < count; i++) {
    const a=f(t,y),b=f(t+step/2,y+step*a/2),c=f(t+step/2,y+step*b/2),d=f(t+step,y+step*c);
    y += step*(a+2*b+2*c+d)/6; t += step;
  }
  return y;
}
export const lfoPractice = [
  (x: number, c = 0) => c*Math.exp(x)+(Math.sin(x)-Math.cos(x))/2,
  (x: number) => Math.exp(2*x)*(x/5-1/25)+(51/25)*Math.exp(-3*x),
  (x: number, c = 0) => x*x*x/2+c*x,
];
