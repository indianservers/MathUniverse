import * as THREE from 'three';
import { centroid, outlineVertices, type VisualCommand } from './commands';
import { FLAT_SHAPES } from './shapeCatalog';
import { compileTwoVariableExpression } from '../utils/functionParser';
import { commandTransform3d } from './solidAdapter';

/** Local geometry in mathematical units, shared by the 3D graph and geometry adapters. */
export function createIntelligenceShapeGeometry(c:VisualCommand):THREE.BufferGeometry {
  const r=c.radius,w=c.width,h=c.height,d=c.depth??w;
  if(c.kind==='plot') {
    const fn=compileTwoVariableExpression(c.expression!),vertices:number[]=[],indices:number[]=[],finite:boolean[]=[];
    const n=32;
    for(let row=0;row<=n;row++)for(let col=0;col<=n;col++){const x=-w/2+w*col/n,y=-h/2+h*row/n,z=fn(x,y);finite.push(Number.isFinite(z)&&Math.abs(z)<10000);vertices.push(x,y,Number.isFinite(z)?z:0);}
    for(let row=0;row<n;row++)for(let col=0;col<n;col++){const a=row*(n+1)+col,b=a+1,d=a+n+1,e=d+1;if([a,b,d,e].every(i=>finite[i]))indices.push(a,b,d,b,e,d);}
    const geometry=new THREE.BufferGeometry();geometry.setAttribute('position',new THREE.Float32BufferAttribute(vertices,3));geometry.setIndex(indices);geometry.computeVertexNormals();return geometry;
  }
  if((FLAT_SHAPES as readonly string[]).includes(c.kind)) {
    const center=(c.kind==='triangle'&&c.points.length===3)||(c.kind==='polygon'&&c.points.length>=3)?centroid(c.points):c.points[0]??[0,0,0];
    if(c.dimension==='3d'&&((c.kind==='triangle'&&c.points.length===3)||(c.kind==='polygon'&&c.points.length>=3))){
      const p=c.points.map(v=>new THREE.Vector3(v[0]-center[0],v[1]-center[1],v[2]-center[2]));
      const u=p[1].clone().sub(p[0]).normalize(),normal=p[1].clone().sub(p[0]).cross(p[2].clone().sub(p[0])).normalize(),v=normal.clone().cross(u);
      const flat=p.map(point=>new THREE.Vector2(point.dot(u),point.dot(v))),triangles=THREE.ShapeUtils.triangulateShape(flat,[]).flat();
      const geometry=new THREE.BufferGeometry();geometry.setAttribute('position',new THREE.Float32BufferAttribute(p.flatMap(point=>point.toArray()),3));geometry.setIndex(triangles);geometry.computeVertexNormals();return geometry;
    }
    const points=outlineVertices({...c,rotation:[0,0,0],scale:1}).map(p=>new THREE.Vector2(p[0]-center[0],p[1]-center[1]));
    return new THREE.ShapeGeometry(new THREE.Shape(points));
  }
  switch(c.kind) {
    case 'cube': return new THREE.BoxGeometry(w,w,w);
    case 'cuboid': return new THREE.BoxGeometry(w,h,d);
    case 'sphere':return new THREE.SphereGeometry(r,32,20);
    case 'ellipsoid':return new THREE.SphereGeometry(1,32,20).scale(w/2,h/2,d/2);
    case 'hemisphere':return new THREE.SphereGeometry(r,32,16,0,Math.PI*2,0,Math.PI/2);
    case 'cylinder':return new THREE.CylinderGeometry(r,r,h,32);
    case 'cone':return new THREE.ConeGeometry(r,h,32);
    case 'frustum':return new THREE.CylinderGeometry(r/2,r,h,32);
    case 'torus':return new THREE.TorusGeometry(r,r/4,12,32);
    case 'tube':return new THREE.TorusGeometry(r,r/10,12,32);
    case 'capsule':return new THREE.CapsuleGeometry(r,h,8,24);
    case 'prism':return new THREE.CylinderGeometry(r,r,h,3);
    case 'pyramid':return new THREE.ConeGeometry(r,h,4);
    case 'tetrahedron':return new THREE.TetrahedronGeometry(r);
    case 'octahedron':return new THREE.OctahedronGeometry(r);
    case 'dodecahedron':return new THREE.DodecahedronGeometry(r);
    case 'icosahedron':return new THREE.IcosahedronGeometry(r);
    case 'wedge': {
      const vertices=[-w/2,-h/2,-d/2,w/2,-h/2,-d/2,w/2,-h/2,d/2,-w/2,-h/2,d/2,-w/2,h/2,-d/2,w/2,h/2,-d/2];
      const geometry=new THREE.BufferGeometry();geometry.setAttribute('position',new THREE.Float32BufferAttribute(vertices,3));geometry.setIndex([0,1,2,0,2,3,0,4,5,0,5,1,1,5,2,3,2,5,3,5,4,0,3,4]);geometry.computeVertexNormals();return geometry;
    }
    default:throw new Error(`No mesh is defined for ${c.kind}.`);
  }
}

export function intelligenceMeshMeasurement(c:VisualCommand,dimensions:number[],scale:number) {
  const geometry=createIntelligenceShapeGeometry(c),position=geometry.getAttribute('position'),index=geometry.index;
  const base=commandTransform3d(c).dimensions,ratios=base.map((v,i)=>dimensions[i]/v*scale);
  let volume=0,area=0;
  const vertex=(i:number)=>new THREE.Vector3(position.getX(i)*ratios[0],position.getY(i)*ratios[1],position.getZ(i)*ratios[2]);
  const count=index?.count??position.count;
  for(let i=0;i<count;i+=3){const a=vertex(index?index.getX(i):i),b=vertex(index?index.getX(i+1):i+1),d=vertex(index?index.getX(i+2):i+2);volume+=a.dot(b.clone().cross(d))/6;area+=b.clone().sub(a).cross(d.clone().sub(a)).length()/2;}
  geometry.dispose();
  return {label:c.kind,volume:(FLAT_SHAPES as readonly string[]).includes(c.kind)||c.kind==='plot'?0:Math.abs(volume),surfaceArea:area,detail:'Measured from the rendered mesh in mathematical units.'};
}
