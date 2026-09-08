export interface OscillatorParameters { omega:number; x0:number; v0:number; }
export function oscillatorState({omega:w,x0,v0}:OscillatorParameters,t:number,zeta=0) {
  let x:number,v:number;
  if(zeta<1){const q=w*Math.sqrt(1-zeta*zeta),b=(v0+zeta*w*x0)/q,e=Math.exp(-zeta*w*t),c=Math.cos(q*t),s=Math.sin(q*t);x=e*(x0*c+b*s);v=e*(-x0*q*s+b*q*c)-zeta*w*x;}
  else if(zeta===1){const b=v0+w*x0,e=Math.exp(-w*t);x=(x0+b*t)*e;v=b*e-w*x;}
  else {const root=Math.sqrt(zeta*zeta-1),l1=-w/(zeta+root),l2=-w*(zeta+root),c1=(v0-l2*x0)/(l1-l2),c2=x0-c1;x=c1*Math.exp(l1*t)+c2*Math.exp(l2*t);v=l1*c1*Math.exp(l1*t)+l2*c2*Math.exp(l2*t);}
  const a=-w*w*x-2*zeta*w*v,ke=.5*v*v,pe=.5*w*w*x*x;
  return {t,x,v,a,ke,pe,energy:ke+pe};
}
export function oscillatorSummary(p:OscillatorParameters) { const amplitude=Math.hypot(p.x0,p.v0/p.omega);return {amplitude,period:2*Math.PI/p.omega,energy:.5*p.omega*p.omega*amplitude*amplitude}; }
export function oscillatorSamples(p:OscillatorParameters,zeta=0) { const duration=2*oscillatorSummary(p).period;return Array.from({length:401},(_,i)=>oscillatorState(p,duration*i/400,zeta)); }
export function checkOscillatorPractice(x:string,v:string,a:string) { return [x,v,a].map((s,i)=>s.trim()!==""&&Number.isFinite(Number(s))&&Math.abs(Number(s)-[.5,-Math.sqrt(3),-2][i])<=.0006); }
