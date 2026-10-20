import { coordinateCollinearityModel } from './coordinateCollinearityModel';
export type AreaPoint={x:number;y:number};
export type AreaPoints=Record<'a'|'b'|'c',AreaPoint>;
// Expand tiny scientific notation before exact decimal parsing.
function decimal(n:number){
 const [mantissa,exponent]=String(n).split('e');
 if(!exponent)return mantissa;
 const negative=mantissa.startsWith('-'),unsigned=negative?mantissa.slice(1):mantissa;
 const parts=unsigned.split('.'),digits=parts.join(''),position=parts[0].length+Number(exponent);
 const value=position<=0?'0.'+'0'.repeat(-position)+digits:position>=digits.length?digits+'0'.repeat(position-digits.length):digits.slice(0,position)+'.'+digits.slice(position);
 return (negative?'-':'')+value;
}
export function triangleAreaModel(p:AreaPoints,swapped=false){
 const exact=coordinateCollinearityModel({a:{x:decimal(p.a.x),y:decimal(p.a.y)},b:{x:decimal(p.b.x),y:decimal(p.b.y)},c:{x:decimal(p.c.x),y:decimal(p.c.y)}});
 const determinant=exact.det*(swapped?-1:1),signed=exact.signed*(swapped?-1:1),base=Math.hypot(p.b.x-p.a.x,p.b.y-p.a.y),dx=p.b.x-p.a.x,dy=p.b.y-p.a.y;
 const ux=base===0?0:dx/base,uy=base===0?0:dy/base;
 const projection=(p.c.x-p.a.x)*ux+(p.c.y-p.a.y)*uy;
 const foot=base===0?null:{x:p.a.x+projection*ux,y:p.a.y+projection*uy};
 const height=base===0?null:Math.abs((p.c.x-p.a.x)*uy-(p.c.y-p.a.y)*ux);
 return {determinant,signed,area:exact.area,base,height,foot,nonzero:!exact.collinear,extension:base===0?null:projection<0?p.a:projection>base?p.b:null,orientation:exact.collinear?'collinear':(!exact.exactDet.startsWith('-'))!==swapped?'counterclockwise':'clockwise'};
}
