import { describe,expect,it } from 'vitest';
import { INTELLIGENCE_EXAMPLES } from './expressionCorpus';
import { FLAT_SHAPES,SOLID_SHAPES } from './shapeCatalog';
import { graphExpressions,interpretVisualRequest,outlineVertices } from './commands';
import { intelligenceGraph3dLayers } from './graph3dAdapter';
import { createIntelligenceShapeGeometry, intelligenceMeshMeasurement } from './shapeGeometry3d';
import { addIntelligenceGeometry } from './geometryAdapter';
import { sampleAdvancedGraphExpression } from '../graph-studio/advancedGraphLayers';
import { sampleParametricSurface, sampleParametricCurve } from '../graph-studio/graph3dAdvanced';
import type { Construction } from '../workspace/geometryCommandController';

describe('offline intelligent expression corpus',()=>{
  it('contains at least 300 distinct requests and covers every catalog shape',()=>{
    expect(INTELLIGENCE_EXAMPLES.length).toBeGreaterThanOrEqual(300);
    expect(new Set(INTELLIGENCE_EXAMPLES.filter(e=>!e.previous).map(e=>e.request)).size).toBeGreaterThanOrEqual(300);
  });
  it.each(INTELLIGENCE_EXAMPLES)('$mode: $request ($previous)',({request,mode,expected,previous})=>{
    const initial=previous?interpretVisualRequest(previous,mode).command:undefined;
    const result=interpretVisualRequest(request,mode,initial);
    expect(result.command,result.message).toMatchObject(expected);
    if(initial)expect(result.command?.action).toBe('update');
  });
  it.each(FLAT_SHAPES)('renders %s in the 2D graph and geometry adapters',shape=>{
    const c=interpretVisualRequest(`Create ${shape}`,'graph2d').command!;
    const vertices=outlineVertices(c);expect(vertices.length).toBeGreaterThanOrEqual(3);
    const empty:Construction={points:[],lines:[],circles:[],polygons:[],arcs:[],loci:[],constraints:[]};
    const scene=addIntelligenceGeometry(empty,{...c,objectId:'test'});
    expect(scene.points.length).toBeGreaterThanOrEqual(2);
    expect(scene.polygons.length+scene.circles.length).toBe(1);
    for(const expression of graphExpressions(c)){if(expression.startsWith('param('))expect(sampleAdvancedGraphExpression(expression,-10,10)?.error).toBeUndefined();}
    const rotated=interpretVisualRequest('Rotate it 90 degrees','graph2d',c).command!;
    const before=vertices[0],after=outlineVertices(rotated)[0];expect(after[0]).toBeCloseTo(-before[1]);expect(after[1]).toBeCloseTo(before[0]);
  });
  it.each([...FLAT_SHAPES,...SOLID_SHAPES])('renders %s as real 3D geometry and graph layers',shape=>{
    const c=interpretVisualRequest(`Create ${shape}`,'graph3d').command!;
    const geometry=createIntelligenceShapeGeometry(c);expect(geometry.getAttribute('position').count).toBeGreaterThan(2);geometry.dispose();
    const layers=intelligenceGraph3dLayers(c);expect(layers.length).toBeGreaterThan(0);
    for(const layer of layers){const sample=sampleParametricSurface(layer.components,{uMin:layer.uMin,uMax:layer.uMax,vMin:layer.vMin,vMax:layer.vMax},8);expect(sample.error,shape).toBeUndefined();}
  });
  it('preserves object IDs and unrelated geometry while editing a triangle',()=>{
    const c={...interpretVisualRequest('Create triangle','geometry2d').command!,objectId:'triangle'};
    const empty:Construction={points:[{id:'unrelated',x:0,y:0,label:'O'}],lines:[],circles:[],polygons:[],arcs:[],loci:[],constraints:[]};
    const first=addIntelligenceGeometry(empty,c),nextCommand=interpretVisualRequest('Resize it to width 10 height 6','geometry2d',c).command!,next=addIntelligenceGeometry(first,nextCommand);
    expect(next.points.map(p=>p.id)).toEqual(first.points.map(p=>p.id));expect(next.polygons).toHaveLength(1);expect(next.points[0]).toEqual(empty.points[0]);
    const outline=outlineVertices(nextCommand);expect(Math.max(...outline.map(p=>p[0]))-Math.min(...outline.map(p=>p[0]))).toBeCloseTo(10);
  });
  it('tilts only in 3D, validates changes, and does not mutate prior context',()=>{
    const c=interpretVisualRequest('Create cube','geometry3d').command!,snapshot=JSON.stringify(c);
    expect(interpretVisualRequest('Tilt it 30 degrees around x axis','geometry3d',c).command?.rotation).toEqual([30,0,0]);
    expect(JSON.stringify(c)).toBe(snapshot);
    expect(interpretVisualRequest('Scale it by -2','geometry3d',c).command).toBeUndefined();
    const triangle=interpretVisualRequest('Create triangle','geometry2d').command!;
    expect(interpretVisualRequest('Tilt it 30 degrees','geometry2d',triangle).command).toBeUndefined();
    expect(interpretVisualRequest('Rotate it','normal').command).toBeUndefined();
  });
  it('builds finite coordinate-line layers',()=>{
    const c=interpretVisualRequest('Draw line (0,0,0) to (2,3,4)','graph3d').command!,layer=intelligenceGraph3dLayers(c)[0];
    expect(sampleParametricCurve(layer.components,0,1,8).error).toBeUndefined();
  });
  it('keeps a 3D triangle in its supplied plane and rejects collinear vertices',()=>{
    const c=interpretVisualRequest('Draw triangle (0,0,0), (2,0,1), (0,2,2)','geometry3d').command!,g=createIntelligenceShapeGeometry(c),p=g.getAttribute('position');
    const center=[2/3,2/3,1];
    for(let i=0;i<3;i++)expect(p.getZ(i)+center[2]).toBeCloseTo(c.points[i][2]);
    g.dispose();
    expect(interpretVisualRequest('Draw triangle (0,0), (1,1), (2,2)','geometry2d').command).toBeUndefined();
  });
  it('moves plots and interprets relative percentage and diameter changes',()=>{
    const p=interpretVisualRequest('Plot x^2','graph2d').command!,moved=interpretVisualRequest('Move it up by 2','graph2d',p).command!;
    const sample=sampleAdvancedGraphExpression(graphExpressions(moved)[0],-10,10)!;expect(sample.points[0].y).toBeCloseTo(102);
    const circle=interpretVisualRequest('Create circle diameter 8','geometry2d').command!;expect(circle.radius).toBe(4);
    expect(interpretVisualRequest('Increase it by 20%','geometry2d',circle).command?.scale).toBeCloseTo(1.2);
    expect(interpretVisualRequest('Reduce it by 20%','geometry2d',circle).command?.scale).toBeCloseTo(.8);
  });
  it('measures the generated cuboid rather than reporting zero volume',()=>{
    const c=interpretVisualRequest('Create cuboid 8 by 5 by 3','geometry3d').command!,m=intelligenceMeshMeasurement(c,[8,5,3],1);
    expect(m.volume).toBeCloseTo(120);expect(m.surfaceArea).toBeCloseTo(158);
  });
});
