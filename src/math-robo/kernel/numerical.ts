import {bisection,compositeSimpson} from '../../phase4/numerical';
import {numericValue,safeAst} from './safeExpression';
import {outcome,unsupported,type KernelRequest} from './types';
export function numericalCalculation(r:KernelRequest){
 if(!['root','quadrature','ode'].includes(r.operation))return undefined;
 const ast=safeAst(r.expression??''),args=r.args??[],tolerance=r.tolerance??1e-8,budget=r.maximumIterations??100;
 if(!Number.isFinite(tolerance)||tolerance<1e-12||tolerance>0.1||!Number.isInteger(budget)||budget<1||budget>10000)throw new Error('Tolerance must be 10^-12 to 0.1; iteration budget 1 to 10000.');
 if(args.some(x=>typeof x!=='number'||!Number.isFinite(x)))throw new Error('Numerical arguments must be finite numbers.');
 const variable=r.variable??'x',fn=(x:number)=>numericValue(ast,{[variable]:x});
 if(r.operation==='root'){
  if(args.length!==2||Number(args[0])>=Number(args[1]))throw new Error('Provide an ordered lower/upper bracket.');
  const left=Number(args[0]),right=Number(args[1]);if(fn(right)===0)return outcome('verified_numerical',String(right),right,'Upper endpoint substitution',[],[],0);
  const solved=bisection(fn,left,right,{tolerance,maximumIterations:budget});if(solved.status!=='CONVERGED'||solved.value===undefined)return unsupported(solved.convergence.reason);
  if(Math.abs(fn(solved.value))>Math.sqrt(tolerance))return unsupported('The bracket contracted without a sufficiently small residual; a discontinuity or poor scaling may be present.');
  const result=outcome('verified_numerical',`≈ ${solved.value}`,solved.value,'Bounded bisection; substitution residual',[],['Function must be continuous on the bracket.',`tolerance ${tolerance}; iterations ${solved.convergence.iterations}`],Math.abs(fn(solved.value)));result.errorBound=`Bracket-width bound ≤ ${(right-left)/2**solved.convergence.iterations}; a residual stopping criterion may terminate earlier.`;return result;
 }
 if(r.operation==='quadrature'){
  if(args.length!==2)throw new Error('Provide lower and upper integration limits.');
  for(let n=4;n<=Math.min(8192,budget*8);n*=2){const solved=compositeSimpson(fn,Number(args[0]),Number(args[1]),n,tolerance);if(solved.status==='CONVERGED'){const result=outcome('verified_numerical',`≈ ${solved.value}`,solved.value,'Composite Simpson with step-halving Richardson error estimate',[],[`tolerance ${tolerance}; subintervals ${n}`],solved.residual);result.errorBound=`Estimated absolute quadrature error ${solved.residual}; not a rigorous bound for discontinuous/non-smooth integrands.`;return result;}}
  return unsupported('Quadrature reached its evaluation budget without meeting the estimated tolerance.');
 }
 if(args.length!==3)throw new Error('ODE input requires [initial y, initial t, final t].');
 const [y0,t0,t1]=args.map(Number),f=(t:number,y:number)=>numericValue(ast,{t,y}),solve=(n:number)=>{const h=(t1-t0)/n;let y=y0;for(let i=0;i<n;i++){const t=t0+i*h,k1=f(t,y),k2=f(t+h/2,y+h*k1/2),k3=f(t+h/2,y+h*k2/2),k4=f(t+h,y+h*k3);y+=h*(k1+2*k2+2*k3+k4)/6;if(!Number.isFinite(y))throw new Error('ODE integration overflowed.');}return y;};
 let coarse=solve(4);for(let n=8;n<=Math.min(4096,budget*4);n*=2){const fine=solve(n),error=Math.abs(fine-coarse)/15;if(error<=tolerance){const result=outcome('verified_numerical',`y(${t1}) ≈ ${fine}`,fine,'RK4 with step-halving consistency; initial value supplied separately',[],[`y(${t0})=${y0}`,`local smoothness assumed; tolerance ${tolerance}; steps ${n}`],error);result.errorBound=`Estimated endpoint error ${error}; step consistency is not a proof of global accuracy.`;return result;}coarse=fine;}
 return unsupported('RK4 reached its step budget without meeting the estimated tolerance.');
}
