import {executionOutcome} from '../../math-foundation/executionOutcome';
import {certifyKernel} from './independentVerification';
import {normalizedAssumptions} from './assumptions';
import {coreEvaluation,domainConditions,validateInputDomains,substituteAst} from './domains';
import {expressionText} from './safeExpression';
import {exactArithmetic} from './exact';
import {safeAst} from './safeExpression';
import {unsupported,type KernelRequest,type KernelResult} from './types';
export async function computeMath(request:KernelRequest):Promise<KernelResult>{const start=performance.now(),originalExpression=request?.expression;let result:KernelResult;let phase:'input'|'solver'='input';
 try{
  if(!request||typeof request!=='object'||typeof request.operation!=='string')throw new Error('A typed operation is required.');
  const finite=(v:unknown,depth=0):void=>{if(depth>40)throw new Error('Request nesting exceeds 40.');if(typeof v==='number'&&!Number.isFinite(v))throw new Error('Nonfinite input.');if(v&&typeof v==='object')Object.values(v).forEach(x=>finite(x,depth+1));};finite(request);
  if(JSON.stringify(request).length>200000)throw new Error('Request exceeds the 200 KB computation budget.');
  if(request.domain!==undefined&&!['real','complex'].includes(request.domain))throw new Error('Domain must be real or complex.');
  request={...request,assumptions:normalizedAssumptions(request.assumptions??[])};
  if(['numeric','substitute'].includes(request.operation)){const definition=request.expression?.match(/^([a-z])\(([a-z])\)\s*=\s*(.+)$/i);if(definition)request={...request,expression:definition[3]};}
  if(['syntax','structured'].includes(request.operation)){result=await (await import('./structuredExpression')).structuredCalculation(request);result.inputExpression=originalExpression;result.operation=request?.operation;result.domain=request?.domain??'real';result.assumptions=request.assumptions;result.elapsedMs=performance.now()-start;return certifyKernel(request,result);}
  if(request.expression){const input=safeAst(request.expression);validateInputDomains(request.values?substituteAst(input,request.values):input,request.domain);}
  phase='solver';
  const arithmetic=exactArithmetic(request);const exact=coreEvaluation(request)??arithmetic;
  if(exact)result=exact;
  else if(request.operation==='geometry3d')result=(await import('./geometry3d')).geometry3d(request);
  else if(request.operation==='geometry2d')result=(await import('./geometry2d')).geometry2d(request);
  else if(['root','quadrature','ode'].includes(request.operation))result=(await import('./numerical')).numericalCalculation(request)!;
  else if(['geometry','linear','statistics'].includes(request.operation))result=(await import('./specialists')).specialistCalculation(request)!;
  else result=(await import('./advancedCas')).advancedCas(request)??(await import('./symbolic')).symbolicCalculation(request)??unsupported('The requested mathematical operation is not supported.');
 }catch(error){result=unsupported(error instanceof Error?error.message:String(error));result.execution=executionOutcome(phase==='input'||/division by zero|undefined|indeterminate|domain|must be|requires|require |invalid|positive|negative|nonfinite|collinear|degenerate|contradict|singular/i.test(result.answer)?'invalid_input':'internal_error',crypto.randomUUID(),result.answer);}
 result.inputExpression=originalExpression;result.operation=request.operation;result.domain=request.domain??'real';result.assumptions=request?.assumptions??[];
 try{if(request.expression){const ast=safeAst(request.expression);result.normalizedExpression=expressionText(ast);result.conditions=[...new Set([...result.conditions,...domainConditions(ast,request.domain)])];}}catch{/* Unsupported input still has a structured result. */}
 if(['solve','trigSolve','inequality','system'].includes(request.operation))result.solutionSet=result.value;
 if(['geometry2d','geometry3d'].includes(request.operation))result.geometry=result.value;
 result.elapsedMs=performance.now()-start;return certifyKernel(request,result);
}
