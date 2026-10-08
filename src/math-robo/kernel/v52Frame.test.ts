import {test,expect} from 'vitest';
import * as THREE from 'three';
import {graphScenePose3d,intelligenceGraph3dLayers} from '../../offline-intelligence/graph3dAdapter';
import {transformPoint,type VisualCommand} from '../../offline-intelligence/commands';
test('graph display frame matches independent mathematical XYZ rotation and translation',()=>{const rotation:[number,number,number]=[.3,-.7,1.2],position:[number,number,number]=[4,5,6],pose=graphScenePose3d(position,rotation),p=[2,3,4],scene=new THREE.Vector3(p[0],p[2],p[1]).applyQuaternion(new THREE.Quaternion(...pose.quaternion)).add(new THREE.Vector3(...pose.position)),expected=transformPoint(p,{rotation:rotation.map(x=>x*180/Math.PI),scale:1} as VisualCommand,[0,0,0]).map((x,i)=>x+position[i]);expect(scene.x).toBeCloseTo(expected[0],12);expect(scene.y).toBeCloseTo(expected[2],12);expect(scene.z).toBeCloseTo(expected[1],12);});
test('3D graph lines carry real viewport-clipped linear commands',()=>{const c:VisualCommand={kind:'line',linearExtent:'line',dimension:'3d',points:[[0,0,0],[1,2,3]],width:6,height:4,radius:3,color:'#22d3ee'};expect(intelligenceGraph3dLayers(c)[0].roboCommand).toEqual(c);});
