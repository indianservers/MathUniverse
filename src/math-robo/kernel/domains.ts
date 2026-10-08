import {checkSubstitutionAssumptions} from './assumptions';
import {binaryRational,sub,approximate} from './geometryPrecision';
import type {MathAstNode} from '../../math-foundation/types';
import {expressionText,safeAst,numericValue} from './safeExpression';
import {rational,fractionText} from './exact';
import {outcome,type KernelRequest} from './types';
export function domainConditions(node:MathAstNode,domain:'real'|'complex'='real'):string[]{
 const conditions:string[]=[];const walk=(n:MathAstNode)=>{
  if(n.type==='BINARY_OPERATION'){if(n.operator==='/'||n.operator==='^'&&(n.right.type==='UNARY_OPERATION'&&n.right.operator==='-'||n.right.type==='LITERAL'&&n.right.value==='0'))conditions.push(`${expressionText(n.operator==='/'?n.right:n.left)} != 0`);walk(n.left);walk(n.right);}
  else if(n.type==='FUNCTION_CALL'){const x=expressionText(n.arguments[0]);if(domain==='real'&&n.name==='sqrt')conditions.push(`${x} >= 0`);if(['ln','log'].includes(n.name))conditions.push(`${x} ${domain==='real'?'>':'!='} 0`);if(domain==='real'&&['asin','acos'].includes(n.name))conditions.push(`-1 <= ${x} <= 1`);if(['tan','sec'].includes(n.name))conditions.push(`cos(${x}) != 0`);if(['cot','csc'].includes(n.name))conditions.push(`sin(${x}) != 0`);n.arguments.forEach(walk);}
  else if(n.type==='UNARY_OPERATION')walk(n.operand);else if(n.type==='EQUATION'||n.type==='INEQUALITY'){walk(n.left);walk(n.right);}
 };walk(node);return [...new Set(conditions)];
}
export function substituteAst(node:MathAstNode,values:Record<string,string>):MathAstNode{
 if(node.type==='SYMBOL'&&Object.hasOwn(values,node.name))return safeAst(values[node.name]);
 if(node.type==='BINARY_OPERATION'||node.type==='EQUATION'||node.type==='INEQUALITY')return {...node,left:substituteAst(node.left,values),right:substituteAst(node.right,values)};
 if(node.type==='UNARY_OPERATION')return {...node,operand:substituteAst(node.operand,values)};
 if(node.type==='FUNCTION_CALL')return {...node,arguments:node.arguments.map(n=>substituteAst(n,values))};return node;
}
export function coreEvaluation(request:KernelRequest){
 if(!['numeric','substitute'].includes(request.operation))return;
 const node=safeAst(request.expression??''),values=request.values??{};if(Object.keys(values).length>26)throw new Error('At most 26 substitutions are supported.');
 for(const [name,value] of Object.entries(values)){if(!/^[a-z\u03b1-\u03c9\u0391-\u03a9]$/i.test(name)||value.length>256)throw new Error('Substitutions need single-letter variables and bounded scalar values.');safeAst(value);}
 checkSubstitutionAssumptions(request.assumptions??[],values);
 const replaced=substituteAst(node,values),source=expressionText(replaced),conditions=domainConditions(node,request.domain);
 if(request.operation==='substitute'){
  try{const f=rational(source),answer=fractionText(f);return outcome('verified_exact',answer,answer,'Exact AST substitution and rational evaluation',[],conditions);}catch{return outcome('unverified',source,source,'Typed substitution; symbolic result retained',[],conditions);}
 }
 const answer=numericValue(replaced);let exactError:string|undefined,residual:number|undefined;try{const exact=rational(source),error=sub(binaryRational(answer),exact),absolute={...error,numerator:error.numerator<0n?-error.numerator:error.numerator};exactError=fractionText(absolute);residual=approximate(absolute);}catch{/* Transcendental evaluation has no independent accuracy certificate. */}
 const result=outcome(exactError===undefined?'unverified':'verified_numerical',`≈ ${answer}`,answer,exactError===undefined?'Finite IEEE-754 AST evaluation; accuracy is not independently certified':'Floating result checked against independent exact rational arithmetic',[],conditions,residual);result.approximation=String(answer);result.errorBound=exactError===undefined?undefined:`Exact absolute rounding/evaluation error: ${exactError}`;result.warnings=['IEEE-754 approximation; no arbitrary-precision transcendental error bound.'];return result;
}
