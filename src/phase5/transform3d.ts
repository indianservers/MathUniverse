import type { Matrix4, Vec3 } from "./types";

export const identity4:Matrix4=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1];
export const translation=(x:number,y:number,z:number):Matrix4=>[1,0,0,x,0,1,0,y,0,0,1,z,0,0,0,1];
export const scaling=(x:number,y=x,z=x):Matrix4=>[x,0,0,0,0,y,0,0,0,0,z,0,0,0,0,1];
export function rotationAxis(axis:Vec3,angle:number):Matrix4{const l=Math.hypot(axis.x,axis.y,axis.z);if(!l)throw new Error("Rotation axis must be non-zero.");const x=axis.x/l,y=axis.y/l,z=axis.z/l,c=Math.cos(angle),s=Math.sin(angle),t=1-c;return[t*x*x+c,t*x*y-s*z,t*x*z+s*y,0,t*x*y+s*z,t*y*y+c,t*y*z-s*x,0,t*x*z-s*y,t*y*z+s*x,t*z*z+c,0,0,0,0,1];}
export function reflectionPlane(normal:Vec3):Matrix4{const l=Math.hypot(normal.x,normal.y,normal.z);if(!l)throw new Error("Reflection plane normal must be non-zero.");const x=normal.x/l,y=normal.y/l,z=normal.z/l;return[1-2*x*x,-2*x*y,-2*x*z,0,-2*y*x,1-2*y*y,-2*y*z,0,-2*z*x,-2*z*y,1-2*z*z,0,0,0,0,1];}
export function compose(a:Matrix4,b:Matrix4):Matrix4{const result=Array(16).fill(0);for(let r=0;r<4;r++)for(let c=0;c<4;c++)for(let k=0;k<4;k++)result[r*4+c]+=a[r*4+k]*b[k*4+c];return result as Matrix4;}
export function applyTransform(m:Matrix4,p:Vec3,isVector=false):Vec3{const w=isVector?0:1;return{x:m[0]*p.x+m[1]*p.y+m[2]*p.z+m[3]*w,y:m[4]*p.x+m[5]*p.y+m[6]*p.z+m[7]*w,z:m[8]*p.x+m[9]*p.y+m[10]*p.z+m[11]*w};}
export function determinant3D(m:Matrix4){return m[0]*(m[5]*m[10]-m[6]*m[9])-m[1]*(m[4]*m[10]-m[6]*m[8])+m[2]*(m[4]*m[9]-m[5]*m[8]);}
export function transformDiagnostics(m:Matrix4){const d=determinant3D(m);return{determinant:d,invertible:Math.abs(d)>1e-12,warnings:[...(Math.abs(d)<=1e-12?["Singular transform: dimensions collapse and no inverse exists."]:[]),...(d<0?["Orientation is reversed."]:[])]};}
export function cartesianToCylindrical(p:Vec3):Vec3{return{x:Math.hypot(p.x,p.y),y:Math.atan2(p.y,p.x),z:p.z};}export function cylindricalToCartesian(p:Vec3):Vec3{return{x:p.x*Math.cos(p.y),y:p.x*Math.sin(p.y),z:p.z};}export function cartesianToSpherical(p:Vec3):Vec3{const r=Math.hypot(p.x,p.y,p.z);return{x:r,y:r?Math.acos(p.z/r):0,z:Math.atan2(p.y,p.x)};}export function sphericalToCartesian(p:Vec3):Vec3{return{x:p.x*Math.sin(p.y)*Math.cos(p.z),y:p.x*Math.sin(p.y)*Math.sin(p.z),z:p.x*Math.cos(p.y)};}

