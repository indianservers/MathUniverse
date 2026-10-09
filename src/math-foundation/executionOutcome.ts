/** Execution and mathematical confidence are separate contracts. Legacy UI statuses
 * remain adapters; a successful calculation alone never establishes verification. */
export type ExecutionStatus='verified'|'valid_unverified'|'invalid_input'|'unsupported'|'cancelled'|'timeout'|'internal_error';
export type VerificationLevel='exact_symbolic'|'exact_geometric_invariant'|'numerical_consistency'|'not_independently_verified'|'contradicted';
export type VerificationEvidence={level:VerificationLevel;independent:boolean;passed:boolean;method:string;assumptions:string[];residual?:number;counterexample?:{input:unknown;expected:unknown;actual:unknown;reason:string}};
type Common={requestId:string;message?:string;evidence:VerificationEvidence};
export type ExecutionOutcome=(Common&{status:'verified';evidence:VerificationEvidence&{independent:true;passed:true}})|(Common&{status:Exclude<ExecutionStatus,'verified'>});
export const noEvidence=(method='No independent mathematical verification'):VerificationEvidence=>({level:'not_independently_verified',independent:false,passed:false,method,assumptions:[]});
export function executionOutcome(status:ExecutionStatus,requestId:string=crypto.randomUUID(),message?:string,evidence=noEvidence()):ExecutionOutcome{
 if(status==='verified'){
  if(!evidence.independent||!evidence.passed||['not_independently_verified','contradicted'].includes(evidence.level))throw new Error('Verified execution requires independent mathematical evidence.');
  return {status,requestId,message,evidence:{...evidence,independent:true,passed:true}};
 }
 return {status,requestId,message,evidence};
}
export function executionFailure(code:string):Exclude<ExecutionStatus,'verified'|'valid_unverified'>{
 if(code==='CANCELLED')return 'cancelled';if(code==='TIMEOUT'||code==='RESOURCE_LIMIT')return 'timeout';if(code==='UNSUPPORTED')return 'unsupported';
 if(['ENGINE_ERROR','EXECUTION_FAILED','VERIFICATION_FAILED','INTERNAL_ERROR'].includes(code))return 'internal_error';return 'invalid_input';
}
export type ClarificationRequirement={kind:'missing_parameters'|'ambiguous_reference'|'underdetermined';requestId:string;question:string;slots:string[];candidates:string[];references:string[]};
