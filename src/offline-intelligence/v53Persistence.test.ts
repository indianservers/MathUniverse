import {expect,it} from 'vitest';
import {addIntelligenceGeometry,nativeGeometryCommands} from './geometryAdapter';
import {intelligenceGraph3dLayers,restoredGraph3dCommands} from './graph3dAdapter';
import {interpretVisualRequest} from './commands';
import {migrateGraph3DSurfaces} from '../graph-studio/graph3dSurfaceModel';
import type {Construction} from '../workspace/geometryCommandController';
it('2D JSON restoration retains semantic ID, label, style and dependency metadata',()=>{
 const command=interpretVisualRequest('Draw circle centered (2,3) radius 5','geometry2d').command!;
 command.objectId='persisted';command.roboLabel='Saved';command.roboFillColor='#ffd700';command.roboStrokeColor='#008080';command.roboLineWidth=3;command.roboDependency={kind:'midpoint',parents:[{objectId:'parent'}]};
 const initial:Pick<Construction,'points'|'lines'|'circles'|'polygons'|'loci'>={points:[],lines:[],circles:[],polygons:[],loci:[]};const scene=addIntelligenceGeometry(initial,command);
 expect(scene.circles[0].style).toMatchObject({fill:'#ffd700',color:'#008080',strokeWidth:3});
 const restored=nativeGeometryCommands(JSON.parse(JSON.stringify(scene)));
 expect(restored).toHaveLength(1);expect(restored[0]).toMatchObject({objectId:'persisted',roboLabel:'Saved',roboFillColor:'#ffd700',roboDependency:command.roboDependency,points:[[2,3]],radius:5});
});
it.each(['sphere radius 5','cube side 4','point at (2,3,1)','vector from (0,0,0) to (2,3,1)'])('3D JSON migration keeps %s available as one semantic object',text=>{
 const command=interpretVisualRequest('Create '+text,'graph3d').command!;command.objectId='saved';command.roboLabel='Saved';
 const layers=intelligenceGraph3dLayers(command).map((row,i)=>({...row,id:`saved-${i}`}));
 const restored=restoredGraph3dCommands(migrateGraph3DSurfaces(JSON.parse(JSON.stringify({surfaces:layers}))));
 expect(restored).toHaveLength(1);expect(restored[0]).toMatchObject({objectId:'saved',roboLabel:'Saved',kind:command.kind,points:command.points,radius:command.radius});
});
