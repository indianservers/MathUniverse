import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export default function UpcomingCubeScene({edge}:{edge:number}) {
 const host=useRef<HTMLDivElement>(null);const [failed,setFailed]=useState(false);
 useEffect(()=>{const element=host.current;if(!element)return;let renderer:THREE.WebGLRenderer;try{renderer=new THREE.WebGLRenderer({antialias:true,alpha:true});}catch{setFailed(true);return;}
  const scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(38,1,.1,1000);camera.position.set(edge*1.8,edge*1.4,edge*2);renderer.setPixelRatio(Math.min(window.devicePixelRatio,2));element.appendChild(renderer.domElement);
  renderer.domElement.setAttribute('aria-label',`${edge} by ${edge} by ${edge} cube with ${edge**3} unit cubes. Drag to rotate; scroll to zoom.`);renderer.domElement.setAttribute('role','img');
  const controls=new OrbitControls(camera,renderer.domElement);controls.enableDamping=true;controls.enablePan=false;controls.minDistance=edge*1.2;controls.maxDistance=edge*6;
  scene.add(new THREE.AmbientLight(0xffffff,2));const light=new THREE.DirectionalLight(0xffffff,3);light.position.set(5,10,8);scene.add(light);
  const geometry=new THREE.BoxGeometry(.91,.91,.91),materials=[0x129dff,0x7653ee,0x06c8d0].map(color=>new THREE.MeshStandardMaterial({color,roughness:.34,metalness:.08}));
  for(let x=0;x<edge;x++)for(let y=0;y<edge;y++)for(let z=0;z<edge;z++){if(x>0&&x<edge-1&&y>0&&y<edge-1&&z>0&&z<edge-1)continue;const cube=new THREE.Mesh(geometry,materials[y%3]);cube.position.set(x-(edge-1)/2,y-(edge-1)/2,z-(edge-1)/2);scene.add(cube);}
  const resize=()=>{const w=element.clientWidth,h=280;renderer.setSize(w,h);camera.aspect=w/h;camera.updateProjectionMatrix();};resize();const observer=new ResizeObserver(resize);observer.observe(element);let frame=0;const animate=()=>{frame=requestAnimationFrame(animate);controls.update();renderer.render(scene,camera);};animate();
  return()=>{cancelAnimationFrame(frame);observer.disconnect();controls.dispose();geometry.dispose();materials.forEach(m=>m.dispose());renderer.dispose();renderer.domElement.remove();};
 },[edge]);
 return <div className="ul-cube-scene"><div ref={host}/>{failed?<p>One layer: {edge} × {edge}. Number of layers: {edge}. Total: {edge**3} unit cubes.</p>:<p>Drag to rotate · Scroll to zoom · {edge} equal layers</p>}</div>;
}
