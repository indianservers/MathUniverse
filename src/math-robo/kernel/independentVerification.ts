import type {MathAstNode} from '../../math-foundation/types';
import {executionOutcome,noEvidence,type VerificationEvidence} from '../../math-foundation/executionOutcome';
import {safeAst} from './safeExpression';
import type {KernelRequest,KernelResult} from './types';
type Rat={n:bigint;d:bigint};
const abs=(n:bigint)=>n<0n?-n:n;
function fraction(n:bigint,d=1n):Rat{if(!d)throw new Error('Zero denominator.');let a=abs(n),b=abs(d);while(b)[a,b]=[b,a%b];const sign=d<0n?-1n:1n;return {n:sign*n/(a||1n),d:sign*d/(a||1n)};}
const add=(a:Rat,b:Rat)=>fraction(a.n*b.d+b.n*a.d,a.d*b.d),mul=(a:Rat,b:Rat)=>fraction(a.n*b.n,a.d*b.d),negative=(a:Rat)=>({...a,n:-a.n}),same=(a:Rat,b:Rat)=>a.n*b.d===b.n*a.d;
function literal(text:string):Rat{const m=text.match(/^(-?\d+)(?:\.(\d+))?$/);if(!m)throw new Error('Not a rational literal.');return fraction(BigInt(m[1]+(m[2]??'')),10n**BigInt(m[2]?.length??0));}
/** Different arithmetic implementation from MathValue/evaluateMath and CAS:
 * certificates compare cross-products of independently accumulated fractions. */
function exact(node:MathAstNode,values:Record<string,string>={}):Rat{
 if(node.type==='LITERAL')return literal(node.value);
 if(node.type==='SYMBOL'&&values[node.name]!==undefined)return exact(safeAst(values[node.name]));
 if(node.type==='UNARY_OPERATION'){const a=exact(node.operand,values);return node.operator==='-'?negative(a):a;}
 if(node.type==='BINARY_OPERATION'){const a=exact(node.left,values),b=exact(node.right,values);
  if(node.operator==='+')return add(a,b);if(node.operator==='-')return add(a,negative(b));if(node.operator==='*')return mul(a,b);if(node.operator==='/')return mul(a,fraction(b.d,b.n));
  if(b.d!==1n||abs(b.n)>64n||a.n===0n&&b.n<=0n)throw new Error('Unsupported or undefined rational power.');const power=abs(b.n),result=fraction(a.n**power,a.d**power);return b.n<0n?fraction(result.d,result.n):result;
 }
 throw new Error('Outside independent rational certificate support.');
}
type Poly=Map<string,Rat>;
const constant=(r:Rat):Poly=>new Map(r.n?[['',r]]:[]);
const powers=(key:string)=>Object.fromEntries(key?key.split('*').map(p=>{const [name,n]=p.split('^');return [name,Number(n??1)];}):[]);
const keyFor=(p:Record<string,number>)=>Object.keys(p).sort().filter(k=>p[k]).map(k=>`${k}^${p[k]}`).join('*');
function sum(a:Poly,b:Poly):Poly{const out=new Map(a);for(const [key,value]of b){const total=add(out.get(key)??fraction(0n),value);if(total.n)out.set(key,total);else out.delete(key);}return out;}
function product(a:Poly,b:Poly):Poly{if(a.size*b.size>20000)throw new Error('Independent verification complexity budget.');let out:Poly=new Map();for(const [ka,va]of a)for(const [kb,vb]of b){const p=powers(ka);for(const [name,n]of Object.entries(powers(kb)))p[name]=(p[name]??0)+n;out=sum(out,new Map([[keyFor(p),mul(va,vb)]]));if(out.size>4096)throw new Error('Independent verification term budget.');}return out;}
function polynomial(node:MathAstNode):Poly{
 if(node.type==='LITERAL')return constant(literal(node.value));if(node.type==='SYMBOL'&&!['e','i','pi'].includes(node.name))return new Map([[`${node.name}^1`,fraction(1n)]]);
 if(node.type==='UNARY_OPERATION')return new Map([...polynomial(node.operand)].map(([k,v])=>[k,node.operator==='-'?negative(v):v]));
 if(node.type==='BINARY_OPERATION'){const a=polynomial(node.left),b=polynomial(node.right);if(node.operator==='+')return sum(a,b);if(node.operator==='-')return sum(a,new Map([...b].map(([k,v])=>[k,negative(v)])));if(node.operator==='*')return product(a,b);
  if(node.operator==='/'&&b.size===1&&b.has(''))return new Map([...a].map(([k,v])=>[k,mul(v,fraction(b.get('')!.d,b.get('')!.n))]));
  if(node.operator==='^'){const n=exact(node.right);if(n.d!==1n||n.n<0n||n.n>16n)throw new Error('Independent polynomial exponent budget.');let out=constant(fraction(1n));for(let i=0n;i<n.n;i++)out=product(out,a);return out;}
 }
 throw new Error('Outside independent polynomial support.');
}
function derivative(p:Poly,variable:string):Poly{let out:Poly=new Map();for(const [key,value]of p){const exp=powers(key),n=exp[variable]??0;if(n){exp[variable]=n-1;out=sum(out,new Map([[keyFor(exp),mul(value,fraction(BigInt(n)))]]));}}return out;}
const equalPoly=(a:Poly,b:Poly)=>a.size===b.size&&[...a].every(([key,value])=>b.has(key)&&same(value,b.get(key)!));
const certificate=(method:string,conditions:string[]):VerificationEvidence=>({level:'exact_symbolic',passed:true,independent:true,method,assumptions:conditions});
export function independentlyVerifyKernel(request:KernelRequest,result:KernelResult):VerificationEvidence{
 if(result.status==='unsupported')return noEvidence();
 const conditions=[...(request.assumptions??[]),...result.conditions];
 if(request.operation==='equivalent'&&result.value===false&&conditions.length)return noEvidence('Polynomial inequality alone does not establish a counterexample under restricting assumptions.');
 try{
  const input=request.expression?safeAst(request.expression):undefined;
  const answer=()=>safeAst(result.exact??result.answer);
  let passed:boolean|undefined,method='';
  if(input&&['evaluate','substitute'].includes(request.operation)){passed=same(exact(input,request.values),exact(answer()));method='Independent rational accumulation and exact cross-product equality';}
  else if(input&&['simplify','expand','factor'].includes(request.operation)){passed=equalPoly(polynomial(input),polynomial(answer()));method='Independent sparse multivariate coefficient identity';}
  else if(input&&request.operation==='differentiate'){passed=equalPoly(derivative(polynomial(input),request.variable??'x'),polynomial(answer()));method='Independent coefficient differentiation identity';}
  else if(input&&request.operation==='integrate'&&request.args?.length===2){const variable=request.variable??'x',lo=exact(safeAst(String(request.args[0]))),hi=exact(safeAst(String(request.args[1])));let value=fraction(0n);for(const [key,c]of polynomial(input)){const ps=powers(key);if(Object.keys(ps).some(k=>k!==variable))throw new Error('Multivariable definite integral certificate unavailable.');const n=BigInt((ps[variable]??0)+1),term=add(fraction(hi.n**n,hi.d**n),negative(fraction(lo.n**n,lo.d**n)));value=add(value,mul(c,mul(fraction(1n,n),term)));}passed=same(value,exact(answer()));method='Independent coefficient integration and exact bound substitution';}
  else if(input&&request.operation==='integrate'){passed=equalPoly(polynomial(input),derivative(polynomial(answer()),request.variable??'x'));method='Independent derivative of the returned polynomial antiderivative; additive constants permitted';}
  else if(input&&request.operation==='equivalent'&&request.other){passed=equalPoly(polynomial(input),polynomial(safeAst(request.other)))===result.value;method='Independent multivariate coefficient equality/inequality';}
  else if(input&&request.operation==='decimal'){
   const original=exact(input),reported=exact(safeAst(result.approximation??result.answer)),error=add(original,negative(reported)),bound=fraction(1n,2n*10n**BigInt(request.precision??20));passed=abs(error.n)*bound.d<=bound.n*error.d;method='Independent exact rational rounding-error bound';
  }else if(request.operation==='mod'){
   const a=BigInt(String(request.args?.[0]??request.expression)),b=BigInt(String(request.args?.[1])),r=BigInt(String(result.value));passed=b>0n&&r>=0n&&r<b&&(a-r)%b===0n;method='Independent modular congruence and canonical residue interval';
  }else if(request.operation==='base'){
   const a=BigInt(String(request.args?.[0]??request.expression)),base=BigInt(String(request.args?.[1])),text=String(result.value),negative=text.startsWith('-');let decoded=0n;for(const ch of text.replace(/^-/,'').toLowerCase()){const digit=BigInt(parseInt(ch,36));if(digit>=base)throw new Error('Invalid base digit.');decoded=decoded*base+digit;}passed=(negative?-decoded:decoded)===a;method='Independent positional reconstruction of base representation';
  }
  if(passed===true)return {...certificate(method,conditions),level:request.operation==='decimal'?'numerical_consistency':'exact_symbolic'};
  if(passed===false)return {level:'contradicted',independent:true,passed:false,method,assumptions:conditions,counterexample:{input:request,expected:'Independent mathematical invariant',actual:result.answer,reason:'Returned result contradicts the invariant.'}};
 }catch{/* Unsupported certificate classes are not replaced by sampling or solver trust. */}
 return noEvidence('Completed solver result; this independent verifier does not cover its expression or operation class.');
}
export function certifyKernel(request:KernelRequest,result:KernelResult,requestId:string=crypto.randomUUID()):KernelResult{
 if(result.execution&&['invalid_input','unsupported','cancelled','timeout','internal_error'].includes(result.execution.status))return result;
 if(result.status==='unsupported'){result.execution=executionOutcome('unsupported',requestId,result.answer);return result;}
 const evidence=independentlyVerifyKernel(request,result);
 result.execution=executionOutcome(evidence.level==='contradicted'?'internal_error':evidence.independent&&evidence.passed?'verified':'valid_unverified',requestId,result.answer,evidence);
 if(evidence.level==='contradicted'){result.status='unsupported';result.verification={passed:false,method:evidence.method};result.answer='Independent verification contradicted the solver result.';}
 return result;
}
