import type {MathRoboCommand,RoboTarget} from './types';

export type CommandIR={
  action:string; object:{kind?:string;references:RoboTarget[]};
  parameters:MathRoboCommand['parameters']; constraints:{dimension:2|3;finite:boolean;nondegenerate:boolean};
  expected:{mutates:boolean;output:'object'|'measurement'|'history'|'selection'|'answer'};
  confidence:MathRoboCommand['confidence']; provenance:MathRoboCommand['source'];
};
/** Typed interpretation contract shared by planning and developer diagnostics. */
export function commandIR(c:MathRoboCommand):CommandIR{
  return {action:c.action,object:{kind:c.action==='CREATE'?c.subAction.toLowerCase():undefined,references:c.targets??(c.target?[c.target]:[])},
    parameters:structuredClone(c.parameters),constraints:{dimension:c.mode.endsWith('3d')?3:2,finite:true,nondegenerate:['RAY','VECTOR','LINE','TRIANGLE'].includes(c.subAction)},
    expected:{mutates:!['FIND','CHECK','COMPARE','COUNT','EXPLAIN','UNSUPPORTED','UNHANDLED'].includes(c.action),output:c.action==='CREATE'?'object':['UNDO','REDO'].includes(c.action)?'history':['SELECT','DESELECT'].includes(c.action)?'selection':c.action==='FIND'?'measurement':'answer'},
    confidence:{...c.confidence},provenance:{...c.source}};
}
