import type { Vec3 } from './types';
export const clamp = (v: number, lo = 0, hi = 1) => Math.max(lo, Math.min(hi, v));
export const sub = (a: Vec3, b: Vec3): Vec3 => [a[0]-b[0], a[1]-b[1], a[2]-b[2]];
export const add = (a: Vec3, b: Vec3): Vec3 => [a[0]+b[0], a[1]+b[1], a[2]+b[2]];
export const mul = (a: Vec3, n: number): Vec3 => [a[0]*n,a[1]*n,a[2]*n];
export const length = (v: Vec3) => Math.hypot(...v);
export const distance = (a: Vec3,b: Vec3) => length(sub(a,b));
export const dot = (a: Vec3,b: Vec3) => a[0]*b[0]+a[1]*b[1]+a[2]*b[2];
export const angleDelta = (a: number,b: number) => Math.atan2(Math.sin(a-b),Math.cos(a-b));
export const average = (points: Vec3[]): Vec3 => points.length ? mul(points.reduce(add,[0,0,0]),1/points.length) : [0,0,0];
export const normalized = (v: Vec3): Vec3 => mul(v,1/Math.max(length(v),1e-6));
export class RingBuffer<T> {
  private entries: (T | undefined)[]; private cursor=0; private count=0;
  constructor(readonly capacity=60){this.entries=new Array(capacity);}
  push(value:T){this.entries[this.cursor]=value;this.cursor=(this.cursor+1)%this.capacity;this.count=Math.min(this.count+1,this.capacity);}
  values():T[]{const result:T[]=[];for(let i=0;i<this.count;i++){const value=this.entries[(this.cursor-this.count+i+this.capacity)%this.capacity];if(value!==undefined)result.push(value);}return result;}
  clear(){this.entries.fill(undefined);this.cursor=0;this.count=0;}
  shift():T|undefined{if(!this.count)return undefined;const index=(this.cursor-this.count+this.capacity)%this.capacity;const value=this.entries[index];this.entries[index]=undefined;this.count--;return value;}
  get size(){return this.count;}
}
