import {test,expect} from 'vitest';
import {graphCommand,restoredGraphInventory} from './graphInventory';
import type {VisualCommand} from '../../offline-intelligence/commands';
test('saved multi-row shape restores one semantic object and its metadata',()=>{
 const triangle:VisualCommand={...graphCommand('triangle-stable','', '#ef4444',true,'2d'),kind:'triangle',roboNativeRow:undefined,points:[[0,0],[7,0],[2,6]],roboExplicitVertices:true,roboFillColor:'#ffd700',roboLabel:'Saved triangle'};
 const rows=[0,1,2].map(i=>({id:`triangle-stable-${i}`,input:`param(${i},t,0,1)`,color:triangle.color,visible:true,roboCommand:triangle}));
 const inventory=restoredGraphInventory([...rows,{id:'user-function',input:'x^2',color:'#22c55e',visible:true}],()=>false);
 expect(inventory).toHaveLength(2);expect(inventory[0]).toMatchObject({objectId:'triangle-stable',kind:'triangle',roboFillColor:'#ffd700',roboLabel:'Saved triangle'});expect(inventory[0].roboNativeRow).toBeUndefined();expect(inventory[1]).toMatchObject({objectId:'user-function',kind:'plot',roboNativeRow:true});
 expect(restoredGraphInventory(rows,()=>true)).toEqual([]);
});
