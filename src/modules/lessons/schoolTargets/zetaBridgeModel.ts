import { add,multiply,divide,type Complex } from "../../../studios/complex/complexEnhancementEngine";
import { isPrime } from "../../../visual-proofs/utils/numberTheoryMath";
export const bridgePrimes=Array.from({length:600},(_,i)=>i+2).filter(isPrime).slice(0,100);
const coefficients=[1/12,-1/720,1/30240,-1/1209600,1/47900160,-691/1307674368000];
export function zetaNumerical(re:number,im=0,N=128):Complex|null {
  if(re===1&&im===0)return null;
  const s={re,im},power=(n:number,shift=0)=>{const log=Math.log(n),amplitude=Math.exp((-re+shift)*log);return {re:amplitude*Math.cos(-im*log),im:amplitude*Math.sin(-im*log)};};
  // Euler-Maclaurin tail, DLMF 25.2(iii): six Bernoulli corrections.
  let sum={re:0,im:0};for(let n=1;n<N;n++)sum=add(sum,power(n));
  sum=add(sum,add(divide(power(N,1),{re:re-1,im}),multiply({re:.5,im:0},power(N))));
  let rising={re:1,im:0};for(let j=1;j<=11;j++){rising=multiply(rising,add(s,{re:j-1,im:0}));if(j%2===1)sum=add(sum,multiply(multiply({re:coefficients[(j-1)/2],im:0},rising),power(N,-j)));}
  return sum;
}
export function zetaBridge(s:number,N:number,K:number) {
  let sum=0,product=1;const sums=Array.from({length:N},(_,i)=>{const n=i+1,term=n**(-s);sum+=term;return {n,term,value:sum};}),products=bridgePrimes.slice(0,K).map(p=>{const factor=1/(1-p**(-s));product*=factor;return {p,factor,value:product};});
  const target=zetaNumerical(s)!.re;
  return {sums,products,target,sum,product,sumError:target-sum,productError:target-product,tailLower:(N+1)**(1-s)/(s-1),tailUpper:N**(1-s)/(s-1)};
}
export function primeFactorization(n:number) {const result:{prime:number;power:number}[]=[];let remaining=n;for(const p of bridgePrimes){if(p*p>remaining)break;let power=0;while(remaining%p===0){remaining/=p;power++;}if(power)result.push({prime:p,power});}if(remaining>1)result.push({prime:remaining,power:1});return result;}
