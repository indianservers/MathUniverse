import type {MathAstNode} from '../../math-foundation/types';
import {rationalAdd as add,rationalSubtract as sub,rationalMultiply as mul,rationalDivide as div} from '../../math-foundation/values';
import {rational,zero,fractionText,exactSquareRoot,polynomial,type Fraction} from './exact';
import {rationalForm,plus,times,divide,polyGcd,trim,type Poly} from './polynomials';
import {safeAst} from './safeExpression';
import {domainConditions} from './domains';
import {outcome,unsupported,type KernelRequest,type RealSolutionSet} from './types';

type Root={a:Fraction;b:Fraction;d:Fraction};
const one:Fraction={numerator:1n,denominator:1n},two:Fraction={numerator:2n,denominator:1n};
const negative=(a:Fraction)=>({...a,numerator:-a.numerator});
const sign=(a:Fraction)=>a.numerator<0n?-1:a.numerator>0n?1:0;
const scalar=(a:Fraction):Root=>({a,b:zero,d:zero});
const rootSign=(x:Root):number=>!x.b.numerator?sign(x.a):!x.a.numerator?sign(x.b):sign(x.a)===sign(x.b)?sign(x.a):sign(sub(mul(x.a,x.a),mul(mul(x.b,x.b),x.d)))*sign(x.a);
function product(x:Root,y:Root):Root{return {a:add(mul(x.a,y.a),mul(mul(x.b,y.b),x.d.numerator?x.d:y.d)),b:add(mul(x.a,y.b),mul(x.b,y.a)),d:x.d.numerator?x.d:y.d};}
function quotient(x:Root,y:Root):Root{
 const norm=sub(mul(y.a,y.a),mul(mul(y.b,y.b),y.d));if(!norm.numerator)throw new Error('Original denominator is zero.');
 const p=product(x,{...y,b:negative(y.b)});return {...p,a:div(p.a,norm),b:div(p.b,norm)};
}
function substituted(n:MathAstNode,v:string,x:Root):Root{
 if(n.type==='SYMBOL'&&n.name===v)return x;
 if(n.type==='LITERAL')return scalar(rational(n.value));
 if(n.type==='UNARY_OPERATION'){const a=substituted(n.operand,v,x);return n.operator==='-'?{...a,a:negative(a.a),b:negative(a.b)}:a;}
 if(n.type==='BINARY_OPERATION'){
  const a=substituted(n.left,v,x),b=substituted(n.right,v,x);
  if(n.operator==='+'||n.operator==='-')return {a:(n.operator==='+'?add:sub)(a.a,b.a),b:(n.operator==='+'?add:sub)(a.b,b.b),d:x.d};
  if(n.operator==='*')return product(a,b);if(n.operator==='/')return quotient(a,b);
  if(n.operator==='^'&&!b.b.numerator&&b.a.denominator===1n&&b.a.numerator>=-64n&&b.a.numerator<=64n){
   if(!rootSign(a)&&b.a.numerator<=0n)throw new Error('Undefined original power.');let p=scalar(one);for(let i=0n;i<(b.a.numerator<0n?-b.a.numerator:b.a.numerator);i++)p=product(p,a);return b.a.numerator<0n?quotient(scalar(one),p):p;
  }
 }
 throw new Error('Unsupported original rational expression.');
}
function allowed(sources:string[],v:string,x:Root):boolean{
 return sources.every(s=>{
  if(new RegExp(`^${v} (?:is real|in R)$`,'i').test(s))return true;
  const m=s.match(/^([a-z])\s*(>=|<=|!=|=|>|<)\s*([+-]?\d+(?:\.\d+)?(?:\/\d+)?)$/i);
  if(!m||m[1]!==v)throw new Error('Certified solving requires real-domain or rational comparison assumptions for the solved variable.');
  const sign=rootSign({...x,a:sub(x.a,rational(m[3]))});return m[2]==='>'?sign>0:m[2]==='<'?sign<0:m[2]==='>='?sign>=0:m[2]==='<='?sign<=0:m[2]==='!='?sign!==0:sign===0;
 });
}
function candidates(p:Poly):Root[]{
 if(p.length===1)return [];if(p.length===2)return [scalar(div(negative(p[0]),p[1]))];
 const discriminant=sub(mul(p[1],p[1]),mul({numerator:4n,denominator:1n},mul(p[2],p[0])));if(discriminant.numerator<0n)return [];
 const a=div(negative(p[1]),mul(two,p[2])),b=div(one,mul(two,p[2])),square=exactSquareRoot(discriminant);
 if(square){const first=scalar(add(a,mul(b,square)));return square.numerator?[first,scalar(sub(a,mul(b,square)))]:[first];}
 return [{a,b,d:discriminant},{a,b:negative(b),d:discriminant}];
}
function rootText(x:Root):string{return x.b.numerator?`(${fractionText(x.a)})+(${fractionText(x.b)})*sqrt(${fractionText(x.d)})`:fractionText(x.a);}
/** Proposed solutions use the existing solver coefficient arithmetic. The
 * certificate path reconstructs the equation with a separate implementation. */
export function boundedEquation(request:KernelRequest){
 if(request.operation!=='solve'||!request.expression)return;
 const node=safeAst(request.expression),v=request.variable??'x';if(node.type!=='EQUATION')return unsupported('Provide an equation with an equals sign.');
 const left=rationalForm(node.left,v),right=rationalForm(node.right,v);if(!left||!right)return;
 if(request.domain==='complex')return unsupported('Bounded equation solving supports the real domain.');
 if(!/^[a-z]$/i.test(v)||['e','i'].includes(v))throw new Error('Use a nonconstant single-letter variable.');
 const assumptions=request.assumptions??[];allowed(assumptions,v,scalar(zero));
 const n=plus(times(left.n,right.d),times(right.n,left.d),true),d=times(left.d,right.d),g=polyGcd(n,d),p=trim(divide(n,g).quotient);
 if(p.length>3)return;
 const conditions=[...new Set([`${v} is real`,...domainConditions(node,'real'),...assumptions])];
 const valid=(x:Root)=>{
  if(!allowed(assumptions,v,x))return false;
  try{const a=substituted(node.left,v,x),b=substituted(node.right,v,x);return sub(a.a,b.a).numerator===0n&&sub(a.b,b.b).numerator===0n;}catch(error){if(error instanceof Error&&/denominator|power/.test(error.message))return false;throw error;}
 };
 let all=p.length===1&&p[0].numerator===0n,proposals:Root[]=candidates(p);
 if(all){
  const comparisons=assumptions.flatMap(s=>{const m=s.match(/^([a-z])\s*(>=|<=|=)\s*([+-]?\d+(?:\.\d+)?(?:\/\d+)?)$/i);return m?[{op:m[2],value:rational(m[3])}]:[];});
  const equal=comparisons.find(c=>c.op==='=')??comparisons.find(c=>c.op==='>='&&comparisons.some(b=>b.op==='<='&&!sub(c.value,b.value).numerator));
  if(equal){all=false;proposals=[scalar(equal.value)];}
 }
 const values=proposals.filter(valid).map(rootText);
 const solutionSet:RealSolutionSet={kind:all?'infinite':values.length?'finite':'empty',domain:'real',variable:v,values,conditions,complete:true};
 const answer=all?'All real values satisfying the original domain':values.length?`${v} ∈ {${values.join(', ')}}`:'No real solutions';
 const result=outcome('unverified',answer,all?undefined:values,'Proposed exact rational equation solution set',[
  'Clear denominators while preserving every original denominator exclusion.',
  'Reduce common factors and solve the remaining polynomial of degree at most two.',
  'Check every candidate in the original expression and against assumptions.',
 ],conditions);
 const lp=polynomial(node.left,v),rp=polynomial(node.right,v);
 if(lp?.length===2&&rp?.length===1&&values.length===1){const rhs=fractionText(sub(rp[0],lp[0])),constant=fractionText(lp[0]),coefficient=fractionText(lp[1]);result.steps=[`Subtract ${constant} from both sides.`,`Obtain (${coefficient})*${v} = ${rhs}.`,`Divide both sides by the nonzero coefficient ${coefficient}.`,`Obtain ${v} = ${values[0]}.`,`Substitute ${v} = ${values[0]} into the original equation; the exact residual is zero.`];}
 result.solutionSet=solutionSet;return result;
}
