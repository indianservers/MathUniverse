import {expect,it} from 'vitest';
import {SemanticEngine} from './semanticEngine';
import {parseSemanticCommand} from './semanticParser';
import type {VisualCommand} from '../../offline-intelligence/commands';
import {compileFunctionExpression} from '../../utils/functionParser';

for(const phrase of ['add sin(x^2)','insert sin(x^2)','create sin(x^2)','draw sin(x^2)','plot sin(x^2)','add y = sin(x^2)']){
  it(`${phrase} creates the requested function`,async()=>{
    const engine=new SemanticEngine('graph2d'),effects:VisualCommand[]=[];
    const result=await engine.execute(phrase,async command=>{effects.push(command);});
    expect(result.status,result.message).toBe('success');
    expect(result.plan.commands[0]).toMatchObject({action:'PLOT',subAction:'FUNCTION'});
    expect(effects).toHaveLength(1);
    expect(effects[0]).toMatchObject({kind:'plot',expression:'sin(x^2)'});
    expect(compileFunctionExpression(effects[0].expression!)(2)).toBeCloseTo(Math.sin(4));
  });
}
it('retains explicit shape commands',()=>{
  expect(parseSemanticCommand('add circle radius 3 at (2,1)','graph2d')).toMatchObject({action:'CREATE',subAction:'CIRCLE'});
});
it('invalid function syntax creates no fallback shape',async()=>{
  const effects:VisualCommand[]=[];
  const result=await new SemanticEngine('graph2d').execute('add sin(x^)',async command=>{effects.push(command);});
  expect(result.status).toBe('invalid');expect(effects).toEqual([]);
});
