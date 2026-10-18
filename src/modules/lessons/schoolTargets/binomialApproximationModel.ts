export function baValues(x:number,n:number){
 const linear=1+n*x, exact=(1+x)**n;
 const signed=n===0||n===1||x===0?0:Math.expm1(n*Math.log1p(x))-n*x;
 const error=Math.abs(signed),percent=100*error/exact;
 return{exact,linear,error,percent,leading:n*(n-1)*x*x/2};
}
export function baGraph(n:number,zoom:number){
 const points=Array.from({length:401},(_,i)=>{const x=-zoom+2*zoom*i/400;return{x,...baValues(x,n)};});
 const values=points.flatMap(p=>[p.exact,p.linear]),lo=Math.min(...values),hi=Math.max(...values),pad=Math.max((hi-lo)*.12,.05),ymin=lo-pad,ymax=hi+pad;
 const mx=(x:number)=>54+(x+zoom)/(2*zoom)*576,my=(y:number)=>270-(y-ymin)/(ymax-ymin)*238;
 const path=(key:'exact'|'linear')=>points.map((p,i)=>`${i?'L':'M'}${mx(p.x)},${my(p[key])}`).join(' ');
 return{ymin,ymax,mx,my,curve:path('exact'),line:path('linear')};
}
