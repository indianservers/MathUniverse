export type DerivativeExpr={kind:'coefficient'}|{kind:'derivative';order:number}|{kind:'add'|'multiply';terms:DerivativeExpr[]}|{kind:'power';base:DerivativeExpr;exponent:number}|{kind:'transcendental';arg:DerivativeExpr};
export const coefficient:DerivativeExpr={kind:'coefficient'};
export const D=(order:number):DerivativeExpr=>({kind:'derivative',order});
export const add=(...terms:DerivativeExpr[]):DerivativeExpr=>({kind:'add',terms});
export const multiply=(...terms:DerivativeExpr[]):DerivativeExpr=>({kind:'multiply',terms});
export const power=(base:DerivativeExpr,exponent:number):DerivativeExpr=>({kind:'power',base,exponent});
export const transcendental=(arg:DerivativeExpr):DerivativeExpr=>({kind:'transcendental',arg});
export function highestDerivative(e:DerivativeExpr):number{switch(e.kind){case'coefficient':return 0;case'derivative':return e.order;case'power':return e.exponent===0?0:highestDerivative(e.base);case'transcendental':return highestDerivative(e.arg);default:return Math.max(0,...e.terms.map(highestDerivative));}}
export function polynomialDegree(e:DerivativeExpr,highest:number):number|null{switch(e.kind){case'coefficient':return 0;case'derivative':return e.order===highest?1:0;case'transcendental':return highestDerivative(e.arg)>0?null:0;case'power':{if(e.exponent===0||highestDerivative(e.base)===0)return 0;const degree=polynomialDegree(e.base,highest);return degree===null||!Number.isInteger(e.exponent)||e.exponent<0?null:degree*e.exponent;}default:{const terms=e.terms.map(t=>polynomialDegree(t,highest));if(terms.some(n=>n===null))return null;return e.kind==='add'?Math.max(0,...terms as number[]):(terms as number[]).reduce((a,b)=>a+b,0);}}}
export function classifyDerivativeEquation(original:DerivativeExpr,cleared=original){const order=highestDerivative(original);return{order,degree:polynomialDegree(cleared,order),initialPolynomial:polynomialDegree(original,order)!==null,polynomial:polynomialDegree(cleared,order)!==null};}
export const anatomy=classifyDerivativeEquation(add(power(D(3),2),power(D(1),4),coefficient));
export const orderDegreeExamples=[
 {id:1,name:"y'' + (y')^3",latex:String.raw`y''+(y')^3=0`,...classifyDerivativeEquation(add(D(2),power(D(1),3))),explanation:'The highest derivative is y″. Its exponent is 1; the cube belongs to a lower derivative.'},
 {id:2,name:"(y'')^2 + y'",latex:String.raw`(y'')^2+y'=0`,...classifyDerivativeEquation(add(power(D(2),2),D(1))),explanation:'The highest derivative is y″ and its exponent is 2. This gives order 2 and degree 2.'},
 {id:3,name:"sin(y') + y",latex:String.raw`\sin(y')+y=0`,...classifyDerivativeEquation(add(transcendental(D(1)),coefficient)),explanation:'A sine of a derivative is not polynomial in derivatives. Order is 1; degree is not defined.'},
 {id:4,name:"sqrt(y'') + y",latex:String.raw`\sqrt{y''}+y=0`,...classifyDerivativeEquation(add(power(D(2),.5),coefficient),add(D(2),coefficient)),explanation:'The original equation requires y ≤ 0. Squaring gives y″ = y². With that restriction retained, its polynomial form has order 2 and degree 1.'},
];
export type ExampleSort='default'|'order'|'degree'|'name';
export function sortOrderDegreeExamples(sort:ExampleSort,descending=false){return [...orderDegreeExamples].sort((a,b)=>{if(sort==='default')return a.id-b.id;if(sort==='name')return(descending?-1:1)*a.name.localeCompare(b.name)||a.id-b.id;const av=a[sort],bv=b[sort];if(av===null||bv===null)return av===bv?a.id-b.id:av===null?1:-1;return(descending?-1:1)*(av-bv)||a.id-b.id;});}
export const orderDegreePractice=[
 {latex:String.raw`y'''-5y''+(y')^2+y=0`,...classifyDerivativeEquation(add(D(3),multiply(coefficient,D(2)),power(D(1),2),coefficient)),solution:'The highest derivative is y‴ and it occurs to the first power: order 3, degree 1.'},
 {latex:String.raw`e^{y'}+y=0`,...classifyDerivativeEquation(add(transcendental(D(1)),coefficient)),solution:'The exponential contains y′. Order is 1, but degree is not defined.'},
 {latex:String.raw`\dfrac{d^2y}{dx^2}+\left(\dfrac{dy}{dx}\right)^{-1}+y=0`,...classifyDerivativeEquation(add(D(2),power(D(1),-1),coefficient),add(multiply(D(1),D(2)),multiply(coefficient,D(1)),coefficient)),solution:'For y′ ≠ 0, multiply by y′: y′y″ + yy′ + 1 = 0. This polynomial has order 2 and degree 1.'},
];
export const degreeLabel=(value:number|null)=>value===null?'Not defined':String(value);
export const defaultOrderDegreeAnswers=()=>['','','','Not defined','',''];
export function gradeOrderDegreeAnswers(answers:string[]){return orderDegreePractice.flatMap((p,i)=>[answers[i*2]===String(p.order),answers[i*2+1]===degreeLabel(p.degree)]);}
