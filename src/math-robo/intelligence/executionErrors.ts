export type RoboErrorCode='UNKNOWN_ACTION'|'UNSUPPORTED_ACTION'|'MISSING_ARGUMENT'|'INVALID_ARGUMENT'|'OBJECT_NOT_FOUND'|'AMBIGUOUS_OBJECT'|'INCOMPATIBLE_OBJECT'|'IMPOSSIBLE_GEOMETRY'|'LOW_CONFIDENCE'|'EXECUTION_FAILED'|'VERIFICATION_FAILED';
export class RoboExecutionError extends Error {
  constructor(public code:RoboErrorCode,message:string,public candidates:string[]=[]){super(message);}
}
export function errorCode(message:string):RoboErrorCode{
  if(/UNSUPPORTED/.test(message))return 'UNSUPPORTED_ACTION';
  if(/several|which|select two/i.test(message))return 'AMBIGUOUS_OBJECT';
  if(/provide|specify|needs|requires|first query/i.test(message))return 'MISSING_ARGUMENT';
  if(/not found|no matching|no object named/i.test(message))return 'OBJECT_NOT_FOUND';
  if(/cannot form|degenerate|coincident|impossible/i.test(message))return 'IMPOSSIBLE_GEOMETRY';
  if(/not applicable|requires a circle|requires a line/i.test(message))return 'INCOMPATIBLE_OBJECT';
  return 'INVALID_ARGUMENT';
}
