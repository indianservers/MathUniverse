import type {VerificationEvidence} from '../../math-foundation/executionOutcome';
import {noEvidence} from '../../math-foundation/executionOutcome';
import {safeAst} from './safeExpression';
import {domainConditions} from './domains';
import type {KernelRequest,KernelResult,RealSolutionSet} from './types';
import * as c from './certificateArithmetic';

export function equationCertificate(request:KernelRequest,result:KernelResult):VerificationEvidence{
 const assumptions=request.assumptions??[],v=request.variable??'x';
 let supported=false;
 try{
  if(request.domain==='complex')return noEvidence('Real equation certificates do not cover complex solving.');
  const node=safeAst(request.expression??'');if(node.type!=='EQUATION')return noEvidence();
  const left=c.rationalForm(node.left,v),right=c.rationalForm(node.right,v);
  const numerator=c.pAdd(c.pMul(left.n,right.d),c.pNeg(c.pMul(right.n,left.d))),denominator=c.pMul(left.d,right.d);
  const reduced=c.pDivide(numerator,c.pGcd(numerator,denominator)).quotient;
  if(reduced.length>3)return noEvidence('Independent completeness requires reduced degree at most two.');
  const permitted=c.restrictions(assumptions,v);
  const valid=(x:c.A)=>{
   if(!permitted(x))return false;
   try{return c.aEqual(c.evaluate(node.left,v,x),c.evaluate(node.right,v,x));}catch(error){if(error instanceof Error&&/denominator|power/.test(error.message))return false;throw error;}
  };
  let infinite=reduced.length===1&&!reduced[0].n,expected=c.roots(reduced);
  if(infinite){
   const bounds=assumptions.flatMap(s=>{const m=s.match(/^([a-z])\s*(>=|<=|=)\s*([+-]?\d+(?:\.\d+)?(?:\/\d+)?)$/i);return m?[{op:m[2],value:c.evaluate(safeAst(m[3]))}]:[];});
   const singleton=bounds.find(b=>b.op==='=')??bounds.find(b=>b.op==='>='&&bounds.some(a=>a.op==='<='&&c.aEqual(a.value,b.value)));
   if(singleton){infinite=false;expected=[singleton.value];}
  }
  expected=expected.filter(valid);
  supported=true;
  const set=result.solutionSet as RealSolutionSet|undefined;
  const values=Array.isArray(result.value)?result.value:[];
  const reported=values.map(value=>{if(typeof value!=='string')throw new Error('Malformed solution candidate.');return c.evaluate(safeAst(value));});
  const required=[...new Set([`${v} is real`,...domainConditions(node,'real'),...assumptions])];
  const expectedKind=infinite?'infinite':expected.length?'finite':'empty';
  const metadata=!!set&&set.kind===expectedKind&&set.domain==='real'&&set.variable===v&&set.complete===true&&
   Array.isArray(set.values)&&set.values.length===values.length&&set.values.every((x,i)=>x===values[i])&&
   Array.isArray(set.conditions)&&required.every(s=>set.conditions.includes(s))&&required.every(s=>result.conditions.includes(s));
  const answer=infinite?'All real values satisfying the original domain':values.length?`${v} ∈ {${values.join(', ')}}`:'No real solutions';
  const passed=metadata&&result.answer===answer&&reported.length===expected.length&&reported.every(valid)&&
   expected.every(root=>reported.filter(x=>c.aEqual(x,root)).length===1)&&
   (!infinite||result.value===undefined);
  return {level:passed?'exact_symbolic':'contradicted',passed,independent:true,scope:'solutions',complete:passed,method:'Independent rational normalization, quadratic-field substitution, original exclusions and complete root classification',assumptions:required,
   ...(!passed?{counterexample:{input:request,expected:{kind:expectedKind,values:expected.map(c.aText)},actual:result.solutionSet??result.value,reason:'Solution values, original-domain conditions or completeness contradict the independent certificate.'}}:{})};
 }catch{return supported?{level:'contradicted',passed:false,independent:true,scope:'solutions',complete:false,method:'Supported equation returned malformed or unsupported solution metadata',assumptions,counterexample:{input:request,expected:'A complete real solution set',actual:result.value,reason:'The solver output cannot represent solutions of this supported equation.'}}:noEvidence('Equation lies outside independent rational/quadratic certificate support.');}
}
