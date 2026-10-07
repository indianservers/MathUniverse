import { describe, expect, it } from 'vitest';
import { graphExpressions, interpretVisualRequest, modeForPath } from './commands';
import { addIntelligenceGeometry } from './geometryAdapter';
import { commandTransform3d } from './solidAdapter';
import { sampleAdvancedGraphExpression } from '../graph-studio/advancedGraphLayers';
import type { Construction } from '../workspace/geometryCommandController';

describe('offline page-aware math intelligence',()=>{
  it.each([
    ['/','normal'],['/workspace/graph','graph2d'],['/math-lab/graphing-calculator','graph2d'],
    ['/math-lab/3d-graphing','graph3d'],['/workspace/geometry','geometry2d'],['/workspace/3d','geometry3d'],
  ] as const)('resolves %s', (path,mode)=>expect(modeForPath(path)).toBe(mode));
  it.each(['normal','graph2d','geometry2d'] as const)('creates a misspelled rectangle in %s',mode=>{
    const result=interpretVisualRequest('Create a blue rectagle 6 wide and 4 tall',mode);
    expect(result.command).toMatchObject({kind:'rectangle',dimension:'2d',width:6,height:4,color:'#3b82f6'});
  });
  it('uses the current graph dimension',()=>{
    expect(interpretVisualRequest('Plot sin(x)','graph2d').command?.dimension).toBe('2d');
    expect(interpretVisualRequest('Plot sin(x)','graph3d').command?.dimension).toBe('3d');
    expect(interpretVisualRequest('Embed a 3D graph of sin(x)*cos(y)','normal').command?.expression).toBe('sin(x)*cos(y)');
    expect(interpretVisualRequest('Can you draw a graph of y = x^3 - 2*x?','graph2d').command?.expression).toBe('x^3 - 2*x');
  });
  it.each(['Create rectangle width -2','Create circle radius 0','Create sphere radius 10001','Draw a line connecting these axes','Draw line (1,1) to (1,1)','Create point','Plot fetch(x)','Plot x +','Create 2D sphere'])('does not create invalid or ambiguous request %s',input=>{
    const result=interpretVisualRequest(input,'normal');expect(result.command).toBeUndefined();expect(result.message).toBeTruthy();
  });
  it('leaves questions to the existing solver',()=>expect(interpretVisualRequest('2x+5=15','normal')).toEqual({message:''}));
  it('creates all four rectangle edges with correct endpoints',()=>{
    const command=interpretVisualRequest('Create rectangle 6 by 4','graph2d').command!;
    const edges=graphExpressions(command).map(expression=>sampleAdvancedGraphExpression(expression,-10,10)!);
    expect(edges).toHaveLength(4);
    expect(edges.every(edge=>!edge.error)).toBe(true);
    expect(edges[0].points[0]).toMatchObject({x:-3,y:-2});
    expect(edges[0].points.at(-1)).toMatchObject({x:3,y:-2});
    expect(edges[3].points.at(-1)).toMatchObject({x:-3,y:-2});
  });
  it('adds editable geometry in mathematical coordinates without losing existing objects',()=>{
    const initial:Construction={points:[{id:'existing',x:320,y:210,label:'O'}],lines:[],circles:[],polygons:[],arcs:[],loci:[],constraints:[]};
    const command=interpretVisualRequest('Create rectangle 6 by 4','geometry2d').command!;
    const next=addIntelligenceGeometry(initial,command);
    expect(next.points).toHaveLength(5);expect(next.polygons[0].points).toHaveLength(4);
    expect(next.points[1]).toMatchObject({x:200,y:290});
    expect(initial.points).toHaveLength(1);
  });
  it('converts sphere radius to diameter',()=>{
    const command=interpretVisualRequest('Create sphere radius 2','geometry3d').command!;
    expect(commandTransform3d(command).dimensions).toEqual([4,4,4]);
  });
  it('positions and rotates a 3D line through requested endpoints',()=>{
    const command=interpretVisualRequest('Draw line (1,2,3) to (4,6,8)','geometry3d').command!;
    const before=JSON.stringify(command);
    const transform=commandTransform3d(command);
    expect(transform.position).toEqual([2.5,4,5.5]);
    expect(transform.dimensions[0]).toBeCloseTo(Math.sqrt(50));
    const y=transform.rotation[1]*Math.PI/180,z=transform.rotation[2]*Math.PI/180;
    expect(Math.cos(y)*Math.cos(z)*transform.dimensions[0]).toBeCloseTo(3);
    expect(Math.sin(z)*transform.dimensions[0]).toBeCloseTo(4);
    expect(-Math.sin(y)*Math.cos(z)*transform.dimensions[0]).toBeCloseTo(5);
    expect(JSON.stringify(command)).toBe(before);
  });
});
