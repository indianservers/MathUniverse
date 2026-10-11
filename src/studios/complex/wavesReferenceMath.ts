export function circuitValues(f: number, l: number, c: number, r: number) {
  const omega = 2 * Math.PI * f,
    xl = omega * l,
    xc = c === 0 ? 0 : 1 / (omega * c),
    x = xl - xc,
    magnitude = Math.hypot(r, x),
    phase = magnitude === 0 ? null : Math.atan2(x, r);
  return {
    omega,
    xl,
    xc,
    x,
    magnitude,
    phase,
    powerFactor: phase === null ? null : Math.cos(phase),
    current: magnitude === 0 ? null : 1 / magnitude,
  };
}
export function circuitSignal(cycle: number, phase: number) {
  return { voltage: Math.cos(cycle), current: Math.cos(cycle - phase) };
}
