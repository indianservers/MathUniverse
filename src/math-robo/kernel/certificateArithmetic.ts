import type {MathAstNode} from '../../math-foundation/types';

/** Certificate arithmetic is deliberately separate from values.ts, exact.ts,
 * geometryPrecision.ts, Nerdamer and all construction/solver routines. */
export type Q={n:bigint;d:bigint};
export const abs=(n:bigint)=>n<0n?-n:n;
export function q(n:bigint,d=1n):Q{
 if(!d)throw new Error('Zero certificate denominator.');
 let a=abs(n),b=abs(d);while(b)[a,b]=[b,a%b];const sign=d<0n?-1n:1n;
 return {n:sign*n/(a||1n),d:sign*d/(a||1n)};
}
export const z=q(0n),one=q(1n),neg=(a:Q)=>q(-a.n,a.d);
export const add=(a:Q,b:Q)=>q(a.n*b.d+b.n*a.d,a.d*b.d);
export const sub=(a:Q,b:Q)=>add(a,neg(b));
export const mul=(a:Q,b:Q)=>q(a.n*b.n,a.d*b.d);
export const div=(a:Q,b:Q)=>q(a.n*b.d,a.d*b.n);
export const eq=(a:Q,b:Q)=>a.n*b.d===b.n*a.d;
export const sign=(a:Q)=>a.n<0n?-1:a.n>0n?1:0;
export const text=(a:Q)=>a.d===1n?String(a.n):`${a.n}/${a.d}`;
export function readQ(source:string):Q{
 if(source.length>16384)throw new Error('Certificate rational length budget.');
 const match=source.match(/^(-?\d+)(?:\/(\d+))?$/);return match?q(BigInt(match[1]),BigInt(match[2]??'1')):literal(source);
}
export function readRadical(source:string):A{
 const match=source.match(/^sqrt\((.*)\)$/);return match?algebraic(z,one,readQ(match[1])):scalar(readQ(source));
}
export function literal(s:string):Q{
 const m=s.match(/^([+-]?\d+)(?:\.(\d+))?$/);if(!m)throw new Error('Unsupported certificate literal.');
 const negative=m[1].startsWith('-');const digits=m[1].replace(/^[+-]/,'')+(m[2]??'');
 return q(BigInt(digits)*(negative?-1n:1n),10n**BigInt(m[2]?.length??0));
}
/** Decode through the binary string, independently of the solver's bit decoder. */
export function binary(x:number):Q{
 if(!Number.isFinite(x))throw new Error('Nonfinite certificate coordinate.');
 if(x===0)return z;const s=Math.abs(x).toString(2),parts=s.split('.'),digits=parts.join('');
 return q(BigInt('0b'+digits)*(x<0?-1n:1n),1n<<BigInt(parts[1]?.length??0));
}
export function approximate(a:Q):number{
 const n=abs(a.n),ns=Math.max(0,n.toString(2).length-52),ds=Math.max(0,a.d.toString(2).length-52);
 const out=Number(n>>BigInt(ns))/Number(a.d>>BigInt(ds))*2**(ns-ds)*(a.n<0n?-1:1);
 if(!Number.isFinite(out))throw new Error('Certificate output precision exceeded.');return out;
}
function isqrt(n:bigint):bigint{
 if(n<0n)throw new Error('Negative square root.');if(n<2n)return n;
 let x=1n<<BigInt(Math.ceil(n.toString(2).length/2));for(;;){const y=(x+n/x)/2n;if(y>=x)return x;x=y;}
}
export function sqrtQ(a:Q):Q|undefined{if(a.n<0n)return;const n=isqrt(a.n),d=isqrt(a.d);return n*n===a.n&&d*d===a.d?q(n,d):undefined;}

// Real quadratic field u + v sqrt(r). Non-square r is strictly positive.
export type A={u:Q;v:Q;r:Q};
export const scalar=(u:Q):A=>({u,v:z,r:z});
export function algebraic(u:Q,v:Q,r:Q):A{
 if(!v.n||!r.n)return scalar(u);const root=sqrtQ(r);return root?scalar(add(u,mul(v,root))):{u,v,r};
}
function field(a:A,b:A):Q{if(a.v.n&&b.v.n&&!eq(a.r,b.r))throw new Error('Multiple quadratic fields unsupported.');return a.v.n?a.r:b.r;}
export const aNeg=(a:A)=>algebraic(neg(a.u),neg(a.v),a.r);
export const aAdd=(a:A,b:A)=>algebraic(add(a.u,b.u),add(a.v,b.v),field(a,b));
export const aSub=(a:A,b:A)=>aAdd(a,aNeg(b));
export function aMul(a:A,b:A):A{const r=field(a,b);return algebraic(add(mul(a.u,b.u),mul(mul(a.v,b.v),r)),add(mul(a.u,b.v),mul(a.v,b.u)),r);}
export function aDiv(a:A,b:A):A{
 const norm=sub(mul(b.u,b.u),mul(mul(b.v,b.v),b.r));if(!norm.n)throw new Error('Undefined original denominator.');
 const out=aMul(a,algebraic(b.u,neg(b.v),b.r));return algebraic(div(out.u,norm),div(out.v,norm),out.r);
}
export function aSign(a:A):number{
 if(!a.v.n)return sign(a.u);if(!a.u.n)return sign(a.v);if(sign(a.u)===sign(a.v))return sign(a.u);
 return sign(sub(mul(a.u,a.u),mul(mul(a.v,a.v),a.r)))*sign(a.u);
}
export const aEqual=(a:A,b:A)=>aSign(aSub(a,b))===0;
export function evaluate(n:MathAstNode,variable?:string,value?:A):A{
 if(n.type==='LITERAL')return scalar(literal(n.value));
 if(n.type==='SYMBOL'&&n.name===variable&&value)return value;
 if(n.type==='UNARY_OPERATION'){const a=evaluate(n.operand,variable,value);return n.operator==='-'?aNeg(a):a;}
 if(n.type==='FUNCTION_CALL'&&n.name==='sqrt'&&n.arguments.length===1){const a=evaluate(n.arguments[0],variable,value);if(a.v.n||a.u.n<0n)throw new Error('Unsupported nested radical.');return algebraic(z,one,a.u);}
 if(n.type==='BINARY_OPERATION'){
  const a=evaluate(n.left,variable,value),b=evaluate(n.right,variable,value);
  if(n.operator==='+')return aAdd(a,b);if(n.operator==='-')return aSub(a,b);if(n.operator==='*')return aMul(a,b);if(n.operator==='/')return aDiv(a,b);
  if(n.operator==='^'&&!b.v.n&&b.u.d===1n&&abs(b.u.n)<=64n){if(!aSign(a)&&b.u.n<=0n)throw new Error('Undefined power.');let out=scalar(one);for(let i=0n;i<abs(b.u.n);i++)out=aMul(out,a);return b.u.n<0n?aDiv(scalar(one),out):out;}
 }
 throw new Error('Outside certificate algebra.');
}
export function aText(a:A):string{return !a.v.n?text(a.u):`(${text(a.u)})+(${text(a.v)})*sqrt(${text(a.r)})`;}

export type P=Q[];
export function trim(p:P):P{p=[...p];while(p.length>1&&!p.at(-1)!.n)p.pop();return p;}
export const pAdd=(a:P,b:P)=>trim(Array.from({length:Math.max(a.length,b.length)},(_,i)=>add(a[i]??z,b[i]??z)));
export const pNeg=(a:P)=>a.map(neg);
export function pMul(a:P,b:P):P{
 if(a.length+b.length>66)throw new Error('Certificate degree budget.');const out:P=Array.from({length:a.length+b.length-1},()=>z);
 a.forEach((x,i)=>b.forEach((y,j)=>out[i+j]=add(out[i+j],mul(x,y))));return trim(out);
}
export function pDivide(a:P,b:P):{quotient:P;remainder:P}{
 a=trim(a);b=trim(b);if(!b.some(x=>x.n))throw new Error('Zero polynomial denominator.');
 const quotient:P=Array.from({length:Math.max(1,a.length-b.length+1)},()=>z);
 while(a.some(x=>x.n)&&a.length>=b.length){const shift=a.length-b.length,k=div(a.at(-1)!,b.at(-1)!);quotient[shift]=k;const row=[...a];b.forEach((x,i)=>row[i+shift]=sub(row[i+shift],mul(k,x)));a=trim(row);}
 return {quotient:trim(quotient),remainder:a};
}
export function pGcd(a:P,b:P):P{for(let i=0;b.some(x=>x.n);i++){if(i>66)throw new Error('Certificate GCD budget.');[a,b]=[b,pDivide(a,b).remainder];}return a.some(x=>x.n)?a.map(x=>div(x,a.at(-1)!)):[one];}
export type RF={n:P;d:P};
export function rationalForm(node:MathAstNode,v:string):RF{
 try{const constant=evaluate(node);if(!constant.v.n)return {n:[constant.u],d:[one]};}catch{/* Reconstruct variable expressions recursively. */}
 if(node.type==='LITERAL')return {n:[literal(node.value)],d:[one]};
 if(node.type==='SYMBOL'&&node.name===v)return {n:[z,one],d:[one]};
 if(node.type==='UNARY_OPERATION'){const a=rationalForm(node.operand,v);return {...a,n:node.operator==='-'?pNeg(a.n):a.n};}
 if(node.type==='BINARY_OPERATION'){
  const a=rationalForm(node.left,v);
  if(node.operator==='^'){
   const exp=evaluate(node.right);if(exp.v.n||exp.u.d!==1n||abs(exp.u.n)>16n)throw new Error('Certificate power budget.');
   let out:RF={n:[one],d:[one]};for(let i=0n;i<abs(exp.u.n);i++)out={n:pMul(out.n,a.n),d:pMul(out.d,a.d)};
   if(exp.u.n<=0n&&!a.n.some(x=>x.n))throw new Error('Undefined power.');return exp.u.n<0n?{n:out.d,d:out.n}:out;
  }
  const b=rationalForm(node.right,v);
  if(node.operator==='+'||node.operator==='-'){const bTerm=pMul(b.n,a.d);return {n:pAdd(pMul(a.n,b.d),node.operator==='-'?pNeg(bTerm):bTerm),d:pMul(a.d,b.d)};}
  if(node.operator==='*')return {n:pMul(a.n,b.n),d:pMul(a.d,b.d)};
  if(node.operator==='/'){if(!b.n.some(x=>x.n))throw new Error('Zero polynomial denominator.');return {n:pMul(a.n,b.d),d:pMul(a.d,b.n)};}
 }
 throw new Error('Outside rational equation certificate support.');
}
export function roots(p:P):A[]{
 p=trim(p);if(p.length>3)throw new Error('Certificate requires degree at most two.');if(p.length===1)return [];
 if(p.length===2)return [scalar(div(neg(p[0]),p[1]))];
 const d=sub(mul(p[1],p[1]),mul(q(4n),mul(p[2],p[0])));if(d.n<0n)return [];
 const u=div(neg(p[1]),mul(q(2n),p[2])),v=div(one,mul(q(2n),p[2]));
 return d.n===0n?[scalar(u)]:[algebraic(u,v,d),algebraic(u,neg(v),d)];
}
export function restrictions(sources:string[],variable:string):(value:A)=>boolean{
 const tests=sources.map(source=>{
  if(new RegExp(`^${variable} (?:is real|in R)$`,'i').test(source))return ()=>true;
  const m=source.match(/^([a-z])\s*(>=|<=|!=|>|<|=)\s*([+-]?\d+(?:\.\d+)?(?:\/\d+)?)$/i);
  if(!m||m[1]!==variable)throw new Error('Outside supported solving assumptions.');
  const parts=m[3].split('/'),limit=scalar(parts.length===1?literal(parts[0]):div(literal(parts[0]),literal(parts[1])));
  return (value:A)=>{const s=aSign(aSub(value,limit));return m[2]==='>'?s>0:m[2]==='<'?s<0:m[2]==='>='?s>=0:m[2]==='<='?s<=0:m[2]==='!='?s!==0:s===0;};
 });return value=>tests.every(test=>test(value));
}
