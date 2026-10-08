import type {KernelRequest} from './types';
export function kernelRequest(raw:string):KernelRequest|undefined{
 const text=raw.trim().replace(/[?.!]+$/,'').replace(/^please\s+/i,'');
 const substitution=text.match(/^evaluate\s+(.+?)\s+at\s+([a-z])\s*=\s*(.+)$/i);if(substitution)return {operation:'substitute',expression:substitution[1],values:{[substitution[2]]:substitution[3]}};
 const inequality=text.match(/^(?:solve\s+)?inequality\s+(.+)$/i);if(inequality)return {operation:'inequality',expression:inequality[1]};
 const system=text.match(/^solve\s+system\s+(.+)$/i);if(system){const equations=system[1].split(/\s*;\s*/);return {operation:'system',equations,variables:['x','y']};}
 const division=text.match(/^polynomial\s+(divide|gcd|multiply|add)\s+(.+?)\s+(?:by|and)\s+(.+)$/i);if(division)return {operation:'polynomial',expression:division[2],other:division[3],args:[division[1].toLowerCase()]};
 const analysis=text.match(/^analyze\s+function\s+(.+)$/i);if(analysis)return {operation:'analyze',expression:analysis[1]};
 const certifiedOperation=text.match(/^certified\s+(?:differentiate|integrate|simplify)\s+(.+)\s+assuming\s+(.+)$/i);if(certifiedOperation){const operation=text.split(/\s+/)[1].toLowerCase() as KernelRequest['operation'];return {operation,expression:certifiedOperation[1],assumptions:certifiedOperation[2].split(/\s*,\s*/)};}
 const decimal=text.match(/^decimal\s+(.+?)\s+to\s+(\d+)\s+(?:decimal )?places$/i);if(decimal)return {operation:'decimal',expression:decimal[1],precision:Number(decimal[2])};
 const numberTheory=text.match(/^(gcd|lcm|mod)\s+(?:of\s+)?([^,]+)\s*(?:,|and)\s*(.+)$/i);if(numberTheory)return {operation:numberTheory[1].toLowerCase() as KernelRequest['operation'],args:numberTheory.slice(2)};
 const trig=text.match(/^solve\s+((?:sin|cos)\(\w\)\s*=.+?)(?:\s+over the reals)?$/i);if(trig)return {operation:'trigSolve',expression:trig[1]};
 const solve=text.match(/^(?:certified\s+)?solve\s+(sqrt\(.+?\)\s*=.+)$/i);if(solve)return {operation:'solve',expression:solve[1]};
 const explicit=text.match(/^(?:exact|certified)\s+(?:(evaluate|simplify|expand|factor|solve|differentiate|integrate)\s+)?(.+)$/i);if(explicit)return {operation:(explicit[1]?.toLowerCase()??'evaluate') as KernelRequest['operation'],expression:explicit[2]};
 const evaluation=text.match(/^(?:evaluate|calculate)\s+(.+)$/i);if(evaluation&&/^[\d\s()+*/.^-]+$|^(?:sqrt|sin|cos|tan)\(/i.test(evaluation[1]))return {operation:'evaluate',expression:evaluation[1]};
 const equality=text.match(/^(?:verify|check)\s+(.+?)\s+(?:is equivalent to|equals)\s+(.+)$/i);if(equality)return {operation:'equivalent',expression:equality[1],other:equality[2]};
 if(/^[\d\s()+*/.^-]+$/.test(text)||/^(?:sqrt|sin|cos|tan|sec|csc|cot|abs)\(/i.test(text))return {operation:'evaluate',expression:text};
 const numerical=text.match(/^(?:numerical root|numerically integrate)\s+(.+?)\s+from\s+(-?\d+(?:\.\d+)?)\s+to\s+(-?\d+(?:\.\d+)?)$/i);if(numerical)return {operation:/^numerical root/i.test(text)?'root':'quadrature',expression:numerical[1],args:numerical.slice(2).map(Number)};
 return undefined;
}
