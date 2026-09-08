export type GrowthContext = "bacteria" | "radioactive";
export function growthValue(k: number, initial: number, t: number) {
  return initial * Math.exp(k * t);
}
export function growthModel(k: number, initial: number, window: number) {
  const magnitude = Math.abs(k), interval = magnitude === 0 ? null : Math.LN2 / magnitude;
  return {
    state: k > 0 ? "Growth" : k < 0 ? "Decay" : "Constant",
    interval,
    samples: Array.from({ length: 321 }, (_, i) => {
      const t = window * i / 320;
      return { t, growth: growthValue(magnitude,initial,t), decay: growthValue(-magnitude,initial,t) };
    }),
    markers: interval === null ? [] : [1,2].filter(n => n*interval <= window).map(n => ({ n, t:n*interval, growth:initial*2**n, decay:initial/2**n })),
    rows: [0,1,2,3].map(n => {const t = interval === null ? n*window/3 : n*interval;return {t,y:growthValue(k,initial,t)};}),
  };
}
export function checkGrowthChallenge(coefficient:string, rate:string, halfLife:string, amount:string) {
  const near=(input:string,answer:number,tolerance:number)=>input.trim()!=="" && Number.isFinite(Number(input)) && Math.abs(Number(input)-answer)<=tolerance;
  return [near(coefficient,80,.00001)&&near(rate,-.4,.00001),near(halfLife,Math.LN2/.4,.005),near(amount,growthValue(-.4,80,3),.005)];
}
export function growthPreset(context:GrowthContext) { return { k:context === "bacteria"?.35:-.35, initial:100, window:8 }; }
