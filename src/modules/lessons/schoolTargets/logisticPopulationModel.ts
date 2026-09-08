export function logisticPopulation(r:number,K:number,P0:number,t:number) {
  if(P0===0)return 0;
  return K*P0/(P0+(K-P0)*Math.exp(-r*t));
}
export function logisticRate(r:number,K:number,P:number) { return r*P*(1-P/K); }
export function logisticPopulationModel(r:number,K:number,P0:number) {
  const inflectionTime=P0>0&&P0<K/2?Math.log((K-P0)/P0)/r:P0===K/2?0:null;
  return { inflectionTime, maxRate:r*K/4, state:P0===0?"zero":P0===K?"equilibrium":P0>K?"decreasing":"increasing",
    samples:Array.from({length:401},(_,i)=>({t:i/20,P:logisticPopulation(r,K,P0,i/20),exponential:P0*Math.exp(r*i/20)})),
    snapshot:[0,2,4,6,8,10,14,20].map(t=>({t,P:logisticPopulation(r,K,P0,t),exponential:P0*Math.exp(r*t)})),
    rates:Array.from({length:201},(_,i)=>{const P=K*1.3*i/200;return {P,rate:logisticRate(r,K,P)};}) };
}
export function logisticInterpretation(P0:number,K:number) {
  if(P0===0)return "The population stays at zero. A small positive population would grow away from zero.";
  if(P0===K)return "The population stays at carrying capacity K.";
  if(P0>K)return "The population decreases toward K from above; it does not cross K.";
  if(P0<K/2)return "The population initially speeds up, then slows after K/2 and approaches K from below.";
  return "The population increases toward K from below, slowing throughout the future interval.";
}
