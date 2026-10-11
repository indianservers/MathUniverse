import {executionOutcome} from '../math-foundation/executionOutcome';
import {boundedEquation} from '../math-robo/kernel/boundedEquation';
import {certifyKernel} from '../math-robo/kernel/independentVerification';
import {normalizedAssumptions} from '../math-robo/kernel/assumptions';
import {validateInputDomains} from '../math-robo/kernel/domains';
import {safeAst} from '../math-robo/kernel/safeExpression';
import {unsupported,type KernelRequest,type RealSolutionSet} from '../math-robo/kernel/types';

/** Synchronous notebook adapter, using the same certification boundary as workers. */
export function certifiedEquation(expression:string,variable:string,assumptions:string[],inputRevision?:string){
 const request:KernelRequest={operation:'solve',expression:expression.includes('=')?expression:`${expression}=0`,variable,domain:'real',inputRevision};
 try{
  request.assumptions=normalizedAssumptions(assumptions.map(s=>s.replace(/^([a-z])\s+(real|integer|positive|nonnegative|negative|nonpositive|nonzero)$/i,'$1 is $2')));
  validateInputDomains(safeAst(request.expression!));
  const result=boundedEquation(request);return result?certifyKernel(request,result):undefined;
 }catch(error){const result=unsupported(error instanceof Error?error.message:String(error));result.execution=executionOutcome('invalid_input',crypto.randomUUID(),result.answer);return result;}
}
export function equationDisplay(set:RealSolutionSet):string{return set.kind==='infinite'?'All real values satisfying the original domain':set.kind==='empty'?'{}':`{${set.values.map(x=>`${set.variable} = ${x}`).join(', ')}}`;}
