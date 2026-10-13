import { compileFunctionExpression } from '../../utils/functionParser';
export type BernoulliModel={p:string;q:string;n:number;x0:number;y0:number};
export type BernoulliPoint={x:number;y:number};
export function bernoulliCurve(model:BernoulliModel,xMin=-2,xMax=4,step=.008):BernoulliPoint[]{
 const p=compileFunctionExpression(model.p),q=compileFunctionExpression(model.q);
 if(!Number.isInteger(model.n)||model.n<0||model.n>5||!Number.isFinite(model.x0)||!Number.isFinite(model.y0))throw new Error('Use an integer exponent from 0 to 5 and finite initial values.');
 if(!Number.isFinite(p(model.x0))||!Number.isFinite(q(model.x0)))throw new Error('P(x) and Q(x) must be finite at the initial point.');
 if(model.y0===0&&model.n>0)return Array.from({length:Math.ceil((xMax-xMin)/step)+1},(_,i)=>({x:Math.min(xMax,xMin+i*step),y:0}));
 const nonlinear=model.n>1, v0=nonlinear?model.y0**(1-model.n):model.y0;
 const reconstruct=(v:number)=>nonlinear?Math.sign(model.y0)*Math.abs(v)**(1/(1-model.n)):v;
 const field=(x:number,v:number)=>nonlinear?(1-model.n)*(q(x)-p(x)*v):model.n===1?(q(x)-p(x))*v:q(x)-p(x)*v;
 const march=(end:number)=>{const direction=end>=model.x0?1:-1;let x=model.x0,v=v0;const points:BernoulliPoint[]=[{x,y:model.y0}];const iterations=Math.ceil(Math.abs(end-x)/step);
  for(let i=0;i<iterations;i++){const h=direction*Math.min(step,Math.abs(end-x));const a=field(x,v),b=field(x+h/2,v+h*a/2),c=field(x+h/2,v+h*b/2),d=field(x+h,v+h*c);const next=v+h*(a+2*b+2*c+d)/6;
   if(!Number.isFinite(next)||(nonlinear&&next*v0<=0))break;v=next;x+=h;const y=reconstruct(v);if(!Number.isFinite(y)||Math.abs(y)>1e5)break;points.push({x,y});
  }return points;
 };
 return [...march(Math.min(xMin,model.x0)).reverse(),...march(Math.max(xMax,model.x0)).slice(1)].filter(p=>p.x>=xMin-1e-9&&p.x<=xMax+1e-9);
}
export function defaultBernoulliValue(n:number,x:number){if(n===0)return .5+.5*Math.exp(-x*x);if(n===1)return Math.exp(-x*x/2);return (2/(1+Math.exp((n-1)*x*x)))**(1/(n-1));}
