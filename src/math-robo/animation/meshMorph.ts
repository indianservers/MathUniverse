/** Repeat complete triangles to reconcile topology without dropping either endpoint surface. */
export function blendMeshPositions(from:ArrayLike<number>,to:ArrayLike<number>,progress:number){
 if(from.length%9||to.length%9||!from.length||!to.length)throw new Error('Mesh morphs require complete finite triangles.');
 const out=new Float32Array(Math.max(from.length,to.length));
 for(let i=0;i<out.length;i++){const a=from[i%from.length],b=to[i%to.length];if(!Number.isFinite(a)||!Number.isFinite(b))throw new Error('Mesh morph vertices must be finite.');out[i]=a+(b-a)*progress;}
 return out;
}
