import {describe,expect,it} from 'vitest';
import {contextualRequest} from './objectConversation';
import {interpretVisualRequest,outlineVertices} from './languageEngine';

const command=(text:string,mode:'geometry2d'|'geometry3d'='geometry2d')=>interpretVisualRequest(text,mode).command!;
describe('workspace object references',()=>{
  it('finds an earlier line even when another shape was created afterwards',()=>{
    const objects=[{command:command('Draw line (0,0) to (6,8)')},{command:command('Create circle radius 2')}];
    expect(contextualRequest('what is the mid point of that line','geometry2d',objects)?.message).toContain('(3, 4)');
    const result=contextualRequest('Move the last line right by 2','geometry2d',objects);
    expect(result?.command).toMatchObject({kind:'line',points:[[2,0],[8,8]]});
  });
  it('anchors to the named triangle rather than the newest rectangle',()=>{
    const triangle=command('Draw triangle (0,0) (6,0) (3,4)');
    const objects=[{command:triangle},{command:command('Create rectangle 2 by 2')}];
    const result=contextualRequest('draw another rectangle starting from the end of last drawn triangle','geometry2d',objects);
    expect(outlineVertices(result!.command!)[0]).toEqual([3,4,0]);
  });
  it('uses live endpoints after a workspace drag',()=>{
    const object={command:command('Draw line (0,0) to (6,8)'),vertices:[[2,3,0],[8,11,0]]};
    expect(contextualRequest('What is the midpoint of that line','geometry2d',[object])?.message).toContain('(5, 7)');
  });
  it('constructs a tangent in the rotated circle plane',()=>{
    const circle={...command('Create circle radius 3','geometry3d'),rotation:[90,0,0] as [number,number,number]};
    const result=contextualRequest('Draw a tangent to the last circle at angle 0 degrees','geometry3d',[{command:circle}]);
    expect(result?.command?.points[0][0]).toBeCloseTo(3);
    expect(result?.command?.points[0][1]).toBeCloseTo(0);
    expect(Math.abs(result!.command!.points[0][2])).toBeCloseTo(3);
  });
  it('does not invent objects when references are missing or removed',()=>{
    expect(contextualRequest('What is the midpoint of that line','geometry2d',[])?.message).toContain('Draw a line first');
    expect(contextualRequest('Draw a tangent to that circle','geometry3d',[])?.command).toBeUndefined();
    expect(contextualRequest('Draw rectangle starting from the end of last triangle','geometry2d',[])?.command).toBeUndefined();
  });
});
