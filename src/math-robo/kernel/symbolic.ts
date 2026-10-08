import nerdamer from 'nerdamer';
import 'nerdamer/Algebra';
import 'nerdamer/Calculus';
import 'nerdamer/Solve';
import type {MathAstNode} from '../../math-foundation/types';
import {rationalSubtract} from '../../math-foundation/values';
import {polynomial,fractionText,rational,exactSquareRoot,type Fraction} from './exact';
import {rationalAdd,rationalMultiply,rationalDivide} from '../../math-foundation/values';
import {safeAst,expressionText,numericValue} from './safeExpression';
import {outcome,unsupported,type KernelRequest} from './types';
type Expression={toString:()=>string;sub:(variable:string,value:string)=>Expression;evaluate:(variables?:Record<string,string>)=>Expression;text:(mode?:string)=>string};
const cas=(s:string)=>nerdamer(s) as unknown as Expression;
const canonical=(s:string)=>cas(`simplify(${s})`).toString();
function piMultiple(node:MathAstNode):Fraction|undefined{
 if(node.type==='LITERAL'&&Number(node.value)===0)return {numerator:0n,denominator:1n};
 if(node.type==='SYMBOL'&&node.name==='pi')return {numerator:1n,denominator:1n};
 if(node.type==='UNARY_OPERATION'){const value=piMultiple(node.operand);return value&&{...value,numerator:node.operator==='-'?-value.numerator:value.numerator};}
 if(node.type==='BINARY_OPERATION'){
  const a=piMultiple(node.left),b=piMultiple(node.right);
  if(node.operator==='+'&&a&&b)return rationalAdd(a,b);
  try{if(node.operator==='/'&&a)return rationalDivide(a,rational(expressionText(node.right)));if(node.operator==='*'&&a)return rationalMultiply(a,rational(expressionText(node.right)));if(node.operator==='*'&&b)return rationalMultiply(b,rational(expressionText(node.left)));}catch{/* Not a rational multiple of pi. */}
 }return;
}
function exactTrig(node:MathAstNode){
 if(node.type!=='FUNCTION_CALL'||!['sin','cos','tan','sec','csc','cot'].includes(node.name))return;
 const multiple=piMultiple(node.arguments[0]);if(!multiple||12n*multiple.numerator%multiple.denominator!==0n)return;
 const index=Number((12n*multiple.numerator/multiple.denominator%24n+24n)%24n);
 // Unit-circle special angles, with quadrant signs and period reduction.
 const first=['0',undefined,'1/2','sqrt(2)/2','sqrt(3)/2',undefined,'1'];
 const sine=(k:number):string|undefined=>{k=(k%24+24)%24;const quadrant=k<=6?k:k<=12?12-k:k<=18?k-12:24-k,value=first[quadrant];return value===undefined?undefined:k>12?`-(${value})`:value;};
 const s=sine(index),c=sine(index+6);if(s===undefined||c===undefined)return;
 const n=node.name==='sin'?s:node.name==='cos'?c:node.name==='tan'?`${s}/(${c})`:node.name==='cot'?`${c}/(${s})`:node.name==='sec'?`1/(${c})`:`1/(${s})`;
 if(['tan','sec'].includes(node.name)&&canonical(c)==='0'||['cot','csc'].includes(node.name)&&canonical(s)==='0')return unsupported('This trigonometric value is undefined (zero denominator).');
 const answer=canonical(n);return outcome('verified_exact',answer,answer,'Exact unit-circle identities, quadrant signs and period reduction',['Reduce the angle modulo 2π.','Use exact special-angle values and the quadrant sign.'],['angles are radians']);
}
function domainConditions(node:MathAstNode):string[]{
 const conditions:string[]=[];function visit(n:MathAstNode){if(n.type==='BINARY_OPERATION'){if(n.operator==='/')conditions.push(`${expressionText(n.right)} != 0`);visit(n.left);visit(n.right);}else if(n.type==='FUNCTION_CALL'){if(n.name==='sqrt')conditions.push(`${expressionText(n.arguments[0])} >= 0`);if(n.name==='ln'||n.name==='log')conditions.push(`${expressionText(n.arguments[0])} > 0`);n.arguments.forEach(visit);}else if(n.type==='UNARY_OPERATION')visit(n.operand);else if(n.type==='EQUATION'||n.type==='INEQUALITY'){visit(n.left);visit(n.right);}}visit(node);return [...new Set(conditions)];
}
export function symbolicCalculation(request:KernelRequest){
 const node=safeAst(request.expression??''),source=expressionText(node),v=request.variable??'x';if(!/^[a-zA-Z]$/.test(v))throw new Error('Use one letter for the variable.');const conditions=[...domainConditions(node),...(request.assumptions??[])];
 if(request.operation==='evaluate'){const exact=exactTrig(node);if(exact)return exact;}
 if(request.operation==='equivalent'){
  const other=safeAst(request.other??''),a=polynomial(node,v),b=polynomial(other,v);if(a&&b){const same=Array.from({length:Math.max(a.length,b.length)},(_,i)=>rationalSubtract(a[i]??{numerator:0n,denominator:1n},b[i]??{numerator:0n,denominator:1n})).every(c=>c.numerator===0n);return outcome('verified_exact',String(same),same,'Independent exact polynomial coefficient comparison',[],[...conditions,...domainConditions(other)]);}
  return outcome('unverified','General symbolic equivalence is not certified by this kernel.',undefined,'No proof for this expression class',[],conditions);
 }
 if(request.operation==='trigSolve'){
  if(node.type!=='EQUATION'||node.left.type!=='FUNCTION_CALL'||!['sin','cos'].includes(node.left.name)||node.left.arguments[0].type!=='SYMBOL'||node.left.arguments[0].name!==v)return unsupported('General solutions currently support sin(x)=c and cos(x)=c over the reals.');
  const c=numericValue(node.right);let outside=Math.abs(c)>1;
  try{const exact=rational(expressionText(node.right));outside=exact.numerator>exact.denominator||exact.numerator<-exact.denominator;}catch{if(Math.abs(Math.abs(c)-1)<1e-12)return unsupported('This non-rational boundary value needs a stronger exact range check.');}
  if(outside)return outcome('verified_with_assumptions','No real solutions',[],'Real sine/cosine range is [-1,1]; exact rational comparison where applicable',[],['x is real']);
  // Keep the inverse function symbolic: backend decimal-to-rational conversion
  // cannot replace an exact principal value such as asin(1/2).
  const inverse=node.left.name==='sin'?'asin':'acos',a=`${inverse}(${expressionText(node.right)})`,families=node.left.name==='sin'?[`${v} = ${a} + 2*pi*k`,`${v} = pi-(${a}) + 2*pi*k`]:[`${v} = ${a} + 2*pi*k`,`${v} = -(${a}) + 2*pi*k`];
  return outcome('verified_with_assumptions',families.join('; '),families,'Inverse principal branch, symmetry and 2π periodicity',['Use the principal inverse value.','Apply symmetry and include every integer period.'],['k is an integer','angles are radians','x is real']);
 }
 if(request.operation==='solve'){
  if(node.type!=='EQUATION')return unsupported('Provide an equation with an equals sign.');
  if(request.domain==='complex')return unsupported('This certified solver currently returns complete sets for supported real linear/quadratic equations. Use the existing complex CAS for unverified proposals.');
  let difference:MathAstNode={...node,type:'BINARY_OPERATION',operator:'-',left:node.left,right:node.right};let radical=false;
  if(node.left.type==='FUNCTION_CALL'&&node.left.name==='sqrt'){
   const right=polynomial(node.right,v),inside=polynomial(node.left.arguments[0],v);if(!right||!inside)return unsupported('Radical solving supports sqrt(polynomial)=polynomial yielding degree at most two.');
   const squared:MathAstNode={...node,type:'BINARY_OPERATION',operator:'*',left:node.right,right:node.right};difference={...node,type:'BINARY_OPERATION',operator:'-',left:node.left.arguments[0],right:squared};radical=true;conditions.push(`${expressionText(node.right)} >= 0`);
  }
  const coefficients=polynomial(difference,v);if(!coefficients)return unsupported('Certified solving supports rational-coefficient linear/quadratic equations and supported principal-root equations.');while(coefficients.length>1&&coefficients.at(-1)!.numerator===0n)coefficients.pop();
  if(coefficients.length>3)return unsupported('Higher-degree completeness is not certified by this kernel.');
  if(coefficients.length===1)return outcome('verified_with_assumptions',coefficients[0].numerator===0n?'All real values satisfying the original domain':'No solutions',undefined,'Exact zero/constant polynomial',[],conditions);
  const c=fractionText(coefficients[0]),b=fractionText(coefficients[1]),a=coefficients[2]&&fractionText(coefficients[2]);let candidates:string[];
  if(!a)candidates=[canonical(`-(${c})/(${b})`)];
  else{const af=coefficients[2],bf=coefficients[1],cf=coefficients[0],df=rationalSubtract(rationalMultiply(bf,bf),rationalMultiply({numerator:4n,denominator:1n},rationalMultiply(af,cf))),discriminant=fractionText(df);if(df.numerator<0n)return outcome('verified_with_assumptions','No real solutions',[],'Exact quadratic discriminant is negative',[],['x is real',...conditions]);const root=exactSquareRoot(df),negativeB={...bf,numerator:-bf.numerator},denominator=rationalMultiply({numerator:2n,denominator:1n},af);candidates=root?[fractionText(rationalDivide(rationalAdd(negativeB,root),denominator)),fractionText(rationalDivide(rationalSubtract(negativeB,root),denominator))]:[canonical(`(-(${b})+sqrt(${discriminant}))/(2*(${a}))`),canonical(`(-(${b})-sqrt(${discriminant}))/(2*(${a}))`)];}
  const restrictions=(request.assumptions??[]).map(text=>{if(/^(?:x|[a-z]) (?:is real|in R)$/i.test(text))return ()=>true;const match=text.match(/^([a-z])\s*(>=|<=|!=|>|<|=)\s*(-?\d+(?:\.\d+)?)$/i);if(!match||match[1]!==v)throw new Error('Certified solving accepts real-domain and numeric comparison assumptions for the solved variable.');const threshold=Number(match[3]);return (candidate:string,x:number)=>{try{const a=rational(candidate),b=rational(match[3]),sign=a.numerator*b.denominator-b.numerator*a.denominator;return match[2]==='>'?sign>0n:match[2]==='<'?sign<0n:match[2]==='>='?sign>=0n:match[2]==='<='?sign<=0n:match[2]==='!='?sign!==0n:sign===0n;}catch{if(!Number.isFinite(x)||Math.abs(x-threshold)<1e-12)throw new Error('This assumption comparison needs stronger exact branch verification.');return match[2]==='>'?x>threshold:match[2]==='<'?x<threshold:match[2]==='>='?x>=threshold:match[2]==='<='?x<=threshold:match[2]==='!='?x!==threshold:x===threshold;}};});
  const accepted:string[]=[],rejected:string[]=[];const exact=true;
  for(const candidate of [...new Set(candidates)]){const x=Number(cas(candidate).evaluate().text('decimals'));let valid=true;
   if(radical){const right=canonical(cas(expressionText(node.right)).sub(v,candidate).toString());try{valid=rational(right).numerator>=0n;}catch{const approximation=Number(cas(right).evaluate().text('decimals'));if(!Number.isFinite(approximation)||Math.abs(approximation)<1e-12)return unsupported('The principal-root sign is not certified at this precision.');valid=approximation>=0;}}
   let residual:string;try{const xExact=rational(candidate);let value:Fraction={numerator:0n,denominator:1n};for(const coefficient of [...coefficients].reverse())value=rationalAdd(rationalMultiply(value,xExact),coefficient);residual=fractionText(value);}catch{residual=canonical(cas(`(${expressionText(node.left)})-(${expressionText(node.right)})`).sub(v,candidate).toString());}
   if(valid&&residual!=='0')return unsupported('Exact substitution could not certify this candidate; no complete solution set is claimed.');
   if((request.assumptions?.length??0)>0&&!Number.isFinite(x))return unsupported('Assumption verification exceeds the supported numeric range.');
   valid&&=restrictions.every(check=>check(candidate,x));if(valid)accepted.push(candidate);else rejected.push(candidate);
  }
  const steps=[radical?'Square only to generate candidates; retain principal-root domain restrictions.':'Use the complete linear/quadratic solution formula.',`Candidates: ${[...new Set(candidates)].join(', ')}.`,`Substitute into the original equation; accepted: ${accepted.join(', ')||'none'}; rejected: ${rejected.join(', ')||'none'}.`];
  const lp=polynomial(node.left,v),rp=polynomial(node.right,v);if(!radical&&lp?.length===2&&rp?.length===1&&accepted.length===1){const rhs=fractionText(rationalSubtract(rp[0],lp[0])),constant=fractionText(lp[0]),coefficient=fractionText(lp[1]);steps.splice(0,steps.length,`Subtract ${constant} from both sides.`,`Obtain (${coefficient})*${v} = ${rhs}.`,`Divide both sides by the nonzero coefficient ${coefficient}.`,`Obtain ${v} = ${accepted[0]}.`,`Substitute ${v} = ${accepted[0]} into the original equation; the exact residual is zero.`);}
  return outcome(exact?'verified_with_assumptions':'verified_numerical',accepted.length?`${v} ∈ {${accepted.join(', ')}}`:'No real solutions',accepted,exact?'Exact original-equation substitution and real-domain candidate checks':'Original-equation numerical residual and domain checks',steps,['x is real',...conditions]);
 }
 if(!['evaluate','simplify','expand','factor','differentiate','integrate'].includes(request.operation))return undefined;
 if(node.type==='EQUATION'||node.type==='INEQUALITY')return unsupported('Use solve for equations; inequalities remain in the existing CAS.');
 if(request.operation==='evaluate'&&node.type==='FUNCTION_CALL'&&!['sqrt','abs'].includes(node.name))return outcome('unverified',source,source,'Exact symbolic expression retained; no elementary identity certified',[],conditions);
 const op=request.operation,answer=op==='expand'?cas(`expand(${source})`).toString():op==='factor'?cas(`factor(${source})`).toString():op==='differentiate'?cas(`diff(${source},${v})`).toString():op==='integrate'?cas(`integrate(${source},${v})`).toString():canonical(source);
 if(/integrate\(/.test(answer))return unsupported('No supported closed-form antiderivative was found.');
 const poly=polynomial(node,v);let verified=false,method='Symbolic backend result, not independently certified';
 if(['simplify','expand','factor'].includes(op)&&poly){const result=polynomial(safeAst(answer),v);verified=!!result&&Array.from({length:Math.max(poly.length,result.length)},(_,i)=>rationalSubtract(poly[i]??{numerator:0n,denominator:1n},result[i]??{numerator:0n,denominator:1n})).every(c=>c.numerator===0n);method='Independent exact polynomial coefficient comparison';}
 if(op==='differentiate'&&poly){const got=polynomial(safeAst(answer),v),wanted=poly.slice(1).map((c,i)=>({...c,numerator:c.numerator*BigInt(i+1)}));verified=!!got&&Array.from({length:Math.max(got.length,wanted.length)},(_,i)=>rationalSubtract(got[i]??{numerator:0n,denominator:1n},wanted[i]??{numerator:0n,denominator:1n})).every(c=>c.numerator===0n);method='Independent rational polynomial power rule';}
 if(op==='integrate'&&poly){const got=polynomial(safeAst(answer),v);verified=!!got&&poly.every((c,i)=>{const coefficient=got[i+1];return coefficient&&rationalSubtract(c,{...coefficient,numerator:coefficient.numerator*BigInt(i+1)}).numerator===0n;});method='Differentiate rational polynomial antiderivative coefficients';}
 // Exact elementary constants can be checked by algebraic identities, not by rounding.
 if(op==='evaluate'&&node.type==='FUNCTION_CALL'&&node.name==='sqrt'){const argument=rational(expressionText(node.arguments[0]));verified=argument.numerator>=0n&&canonical(`(${answer})^2-(${expressionText(node.arguments[0])})`)==='0';method='Exact square identity with nonnegative principal-root domain';}
 return outcome(verified?(conditions.length?'verified_with_assumptions':'verified_exact'):'unverified',op==='integrate'?`${answer} + C`:answer,answer,method,[`${op}: ${source} → ${answer}${op==='integrate'?' + C':''}`],conditions);
}
