import { clamp } from "./probabilityMath";

export function simulateCoinFlips(trials: number, p = 0.5) {
  const safeTrials = clamp(Math.floor(trials), 1, 10000);
  let successes = 0;
  const running: number[] = [];
  for (let trial = 1; trial <= safeTrials; trial += 1) {
    if (Math.random() < p) successes += 1;
    if (trial <= 120 || trial % Math.ceil(safeTrials / 120) === 0) running.push(successes / trial);
  }
  return { successes, trials: safeTrials, running };
}

export function simulateDiceRolls(trials: number) {
  const safeTrials = clamp(Math.floor(trials), 1, 10000);
  const counts = [0, 0, 0, 0, 0, 0];
  let sum = 0;
  const running: number[] = [];
  for (let trial = 1; trial <= safeTrials; trial += 1) {
    const roll = Math.floor(Math.random() * 6) + 1;
    counts[roll - 1] += 1;
    sum += roll;
    if (trial <= 120 || trial % Math.ceil(safeTrials / 120) === 0) running.push(sum / trial);
  }
  return { counts, average: sum / safeTrials, trials: safeTrials, running };
}

export function simulateBirthdayParadox(peopleCount: number, trials: number) {
  const safePeople = clamp(Math.floor(peopleCount), 2, 80);
  const safeTrials = clamp(Math.floor(trials), 1, 5000);
  let matches = 0;
  for (let trial = 0; trial < safeTrials; trial += 1) {
    const seen = new Set<number>();
    let match = false;
    for (let person = 0; person < safePeople; person += 1) {
      const birthday = Math.floor(Math.random() * 365);
      if (seen.has(birthday)) match = true;
      seen.add(birthday);
    }
    if (match) matches += 1;
  }
  return { people: safePeople, trials: safeTrials, matches, estimate: matches / safeTrials };
}

export function simulateMontyHall(trials: number, strategy: "stay" | "switch") {
  const safeTrials = clamp(Math.floor(trials), 1, 10000);
  let wins = 0;
  for (let trial = 0; trial < safeTrials; trial += 1) {
    const car = Math.floor(Math.random() * 3);
    const pick = Math.floor(Math.random() * 3);
    const win = strategy === "stay" ? pick === car : pick !== car;
    if (win) wins += 1;
  }
  return { wins, trials: safeTrials, winRate: wins / safeTrials };
}
