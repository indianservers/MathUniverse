export const chordMaximum=(radius:number)=>Math.floor(radius*1.99*10+1e-9)/10;
export function perpendicularChordModel(radius:number,chord:number){
 if(!Number.isFinite(radius)||!Number.isFinite(chord)||radius<=0||chord<=0||chord>=2*radius)throw new Error('A positive non-diameter chord inside the circle is required');
 const half=chord/2,om=Math.sqrt(radius*radius-half*half),o={x:0,y:0},a={x:-half,y:-om},b={x:half,y:-om},m={x:0,y:-om},oa=Math.hypot(a.x,a.y),ob=Math.hypot(b.x,b.y),am=Math.hypot(a.x-m.x,a.y-m.y),mb=Math.hypot(b.x-m.x,b.y-m.y),angle=(q:{x:number;y:number})=>{const u={x:o.x-m.x,y:o.y-m.y},v={x:q.x-m.x,y:q.y-m.y};return Math.atan2(Math.abs(u.x*v.y-u.y*v.x),u.x*v.x+u.y*v.y)*180/Math.PI;},angleA=angle(a),angleB=angle(b);
 return{half,om,o,a,b,m,oa,ob,am,mb,angleA,angleB,congruent:Math.abs(oa-ob)<1e-9&&Math.abs(am-mb)<1e-9&&Math.abs(angleA-90)<1e-9&&Math.abs(angleB-90)<1e-9};
}
