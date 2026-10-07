import { centroid, transformPoint, type VisualCommand } from './commands';
export function commandTransform3d(command:VisualCommand) {
  const diameter=command.kind==='cube'?command.width:command.radius*2;
  const center=(command.kind==='triangle'&&command.points.length===3)||(command.kind==='polygon'&&command.points.length>=3)?centroid(command.points):command.points[0]??[0,0,0];
  const position=[...center] as [number,number,number];
  const dimensions:[number,number,number]=command.kind==='point'?[0.24,0.24,0.24]:command.kind==='cuboid'||command.kind==='ellipsoid'?[command.width,command.height,command.depth??command.width]:[diameter,command.kind==='sphere'||command.kind==='cube'?diameter:command.height,diameter];
  const rotation:[number,number,number]=[...(command.rotation??[0,0,0])];
  if (command.kind==='line') {
    const [a,b]=command.points;
    const [dx,dy,dz]=transformPoint(b.map((v,i)=>v-a[i]),{...command,scale:1},[0,0,0]);
    const length=Math.hypot(dx,dy,dz);
    position.splice(0,3,...a.map((v,i)=>(v+b[i])/2));
    dimensions.splice(0,3,length,0.07,0.07);
    // Three.js uses XYZ Euler order: the local x axis becomes Ry * Rz * x.
    rotation[0]=0;
    rotation[1]=Math.atan2(-dz,dx)*180/Math.PI;
    rotation[2]=Math.asin(dy/length)*180/Math.PI;
  }
  return {position,dimensions,rotation,color:command.color};
}
