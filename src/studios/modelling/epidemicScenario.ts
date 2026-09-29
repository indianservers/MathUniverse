export type EpidemicPoint = { s: number; e: number; i: number; r: number; re: number };

export function epidemicScenario({ beta, gamma, vaccination, infected, population, seir, interventionDay, interventionEndDay = 201, reduction }: { beta: number; gamma: number; vaccination: number; infected: number; population: number; seir: boolean; interventionDay: number; interventionEndDay?: number; reduction: number }): EpidemicPoint[] {
  const n = population;
  let s = Math.max(0, n - infected - vaccination * n);
  let e = seir ? Math.min(infected / 2, n * 0.01) : 0;
  let i = infected - e;
  let r = vaccination * n;
  const result: EpidemicPoint[] = [];
  for (let day = 0; day <= 200; day += 1) {
    const contact = beta * (day >= interventionDay && day < interventionEndDay ? 1 - reduction : 1);
    result.push({ s, e, i, r, re: contact / gamma * s / n });
    const infections = Math.min(s, contact * s * i / n);
    const exposedToInfectious = seir ? Math.min(e, 0.25 * e) : 0;
    const recovered = Math.min(i, gamma * i);
    s -= infections;
    e += infections - exposedToInfectious;
    i += (seir ? exposedToInfectious : infections) - recovered;
    r += recovered;
  }
  return result;
}
