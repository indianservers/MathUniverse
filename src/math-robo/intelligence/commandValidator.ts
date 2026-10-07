import { operationFor } from './actionRegistry';
import type { MathRoboCommand } from './types';
export function validateCommand(command:MathRoboCommand) {
  const op=operationFor(command.action,command.subAction);
  if(!op?.implemented)throw new Error(`UNSUPPORTED: ${command.action}:${command.subAction} is not available.`);
  if(!op.modes.includes(command.mode))throw new Error(`UNSUPPORTED: ${command.action}:${command.subAction} is unavailable in ${command.mode}.`);
  for(const field of op.required)if(command.parameters[field]===undefined)throw new Error(`Provide ${field} for ${command.action.toLowerCase()}.`);
  const check=(value:unknown):void=>{if(typeof value==='number'&&(!Number.isFinite(value)||Math.abs(value)>1e6))throw new Error('Use finite values within 1,000,000.');if(Array.isArray(value))value.forEach(check);};
  Object.values(command.parameters).forEach(check);
  const dimension=command.mode.endsWith('3d')?3:2;
  if(command.mode!=='normal')for(const key of ['position','vector'] as const){const value=command.parameters[key];if(value&&value.length!==dimension)throw new Error(`Provide ${dimension} coordinates for ${key}.`);}
  if(command.mode!=='normal'&&command.parameters.points?.some(point=>point.length!==dimension))throw new Error(`Provide ${dimension} coordinates per point.`);
  for(const key of ['width','height','depth','radius','diameter','factor']){const value=command.parameters[key];if(typeof value==='number'&&(value<=0||value>10000))throw new Error(`${key} must be positive and no greater than 10,000.`);}
  if(command.parameters.sides!==undefined&&(!Number.isInteger(command.parameters.sides)||command.parameters.sides<3||command.parameters.sides>32))throw new Error('Polygon sides must be an integer from 3 to 32.');
  if(command.action==='DELETE'&&command.subAction==='ALL'&&command.confidence.overall<0.98)throw new Error('Use an explicit clear-all command.');
  if(command.parameters.parseError)throw new Error(String(command.parameters.parseError));
  return op;
}
