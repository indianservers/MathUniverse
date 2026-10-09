import { operationFor } from './actionRegistry';
import type { MathRoboCommand } from './types';
import {RoboExecutionError} from './executionErrors';
import {EPSILON} from './tolerances';
import {cross3,vector3} from '../../workspace/geometry3dKernel';
export function validateCommand(command:MathRoboCommand) {
  if(command.action==='DELETE'&&command.subAction==='ALL'&&/\b(?:except|excluding|apart from|other than|but)\b/i.test(command.rawPhrase)&&!command.parameters.preserveTargets)throw new Error('Specify which objects to keep. Nothing was cleared.');
  const op=operationFor(command.action,command.subAction);
  if(command.confidence.overall<.75)throw new RoboExecutionError('LOW_CONFIDENCE','Please clarify the request before I change any objects.');
  if(command.confidence.overall<.9&&!command.target&&!command.targets)throw new RoboExecutionError('LOW_CONFIDENCE','Please specify the object or confirm the exact command.');
  if(!op?.implemented)throw new Error(`UNSUPPORTED: ${command.action}:${command.subAction} is not available.`);
  if(!op.modes.includes(command.mode))throw new Error(`UNSUPPORTED: ${command.action}:${command.subAction} is unavailable in ${command.mode}.`);
  for(const field of op.required)if(command.parameters[field]===undefined)throw new Error(`Provide ${field} for ${command.action.toLowerCase()}.`);
  const check=(value:unknown):void=>{if(typeof value==='number'&&(!Number.isFinite(value)||Math.abs(value)>1e6))throw new Error('Use finite values within 1,000,000.');if(Array.isArray(value))value.forEach(check);};
  Object.values(command.parameters).forEach(check);
  const dimension=command.mode.endsWith('3d')?3:2;
  if(command.mode!=='normal')for(const key of ['position','vector'] as const){const value=command.parameters[key];if(value&&value.length!==dimension)throw new Error(`Provide ${dimension} coordinates for ${key}.`);}
  if(command.mode!=='normal'&&command.parameters.points?.some(point=>point.length!==dimension))throw new Error(`Provide ${dimension} coordinates per point.`);
  for(const key of ['width','height','depth','radius','diameter','factor','length']){const value=command.parameters[key];if(typeof value==='number'&&(value<=0||value>10000))throw new Error(`${key} must be positive and no greater than 10,000.`);}
  const count=command.parameters.count;if(count!==undefined&&(!Number.isInteger(count)||count<1||count>100))throw new Error('Create between 1 and 100 objects per request.');
  if(command.action==='CREATE'&&['LINE','RAY','VECTOR'].includes(command.subAction)&&(command.parameters.points?.length!==2||command.parameters.points[0].every((n,i)=>n===command.parameters.points![1][i])))throw new Error('Provide two endpoints for the line.');
  if(command.action==='CREATE'&&command.subAction==='TRIANGLE'&&command.parameters.points?.length===3){const [a,b,c]=command.parameters.points,u=vector3(b[0]-a[0],b[1]-a[1],(b[2]??0)-(a[2]??0)),v=vector3(c[0]-a[0],c[1]-a[1],(c[2]??0)-(a[2]??0)),cross=cross3(u,v);if(Math.hypot(cross.x,cross.y,cross.z)<EPSILON)throw new Error('Those collinear points cannot form a triangle.');}
  if(command.parameters.sides!==undefined&&(!Number.isInteger(command.parameters.sides)||command.parameters.sides<3||command.parameters.sides>32))throw new Error('Polygon sides must be an integer from 3 to 32.');
  if(command.action==='DELETE'&&command.subAction==='ALL'&&command.confidence.overall<0.98)throw new Error('Use an explicit clear-all command.');
  if(command.parameters.parseError)throw new Error(String(command.parameters.parseError));
  return op;
}
