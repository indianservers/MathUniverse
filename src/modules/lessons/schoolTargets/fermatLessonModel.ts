export function floorPowerRoot(value: bigint, exponent: number) {
  if (value < 0n || !Number.isInteger(exponent) || exponent < 2 || exponent > 10) throw new Error("Invalid root domain.");
  let low = 0n, high = value + 1n;
  while (high - low > 1n) { const mid = (low + high) / 2n; if (mid ** BigInt(exponent) <= value) low = mid; else high = mid; }
  return low;
}
export function compareFermatPowers(a: number, b: number, n: number) {
  if (![a,b].every(v => Number.isInteger(v) && v >= 1 && v <= 100) || !Number.isInteger(n) || n < 2 || n > 10) throw new Error("Positive sides up to 100 and exponent 2 to 10 required.");
  const ap = BigInt(a) ** BigInt(n), bp = BigInt(b) ** BigInt(n), sum = ap + bp, lower = floorPowerRoot(sum,n), lowerPower = lower ** BigInt(n), upper = lower + 1n;
  return { ap, bp, sum, lower, upper, lowerPower, upperPower: upper ** BigInt(n), equal: lowerPower === sum };
}
export function searchFermat(limit: number, exponent: number, constrain: boolean) {
  if (!Number.isInteger(limit) || limit < 5 || limit > 100 || !Number.isInteger(exponent) || exponent < 2 || exponent > 10) throw new Error("Unsupported search domain.");
  const powers = Array.from({length:limit+1},(_,i) => BigInt(i) ** BigInt(exponent));
  const candidates = new Map(powers.slice(1).map((p,i) => [p,i+1]));
  const solutions: {a:number;b:number;c:number}[] = [];
  let pairs = 0, candidateTriples = 0;
  for(let a=1;a<=limit;a++) for(let b=a;b<=limit;b++) {
    pairs++; candidateTriples += limit - (constrain ? b : 1) + 1;
    const c = candidates.get(powers[a]+powers[b]);
    if(c !== undefined && (!constrain || c >= b)) solutions.push({a,b,c});
  }
  return {limit,exponent,constrain,pairs,candidateTriples,solutions};
}
export function checkFermatPractice(triple: string[], cube: string, reason: string) {
  if(triple.length!==3 || triple.some(v => !/^\d+$/.test(v.trim()) || v.trim().length>6)) return false;
  const [a,b,c]=triple.map(v=>BigInt(v.trim()));
  return a>0n && b>0n && c>0n && a*a+b*b===c*c && cube.trim()==="91" && reason==="finite";
}
