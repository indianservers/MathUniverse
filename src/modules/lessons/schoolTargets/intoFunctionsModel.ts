export const intoDomain=['a','b','c','d'],intoInitial=[0,2,2,3];
export function intoModel(mapping:(number|null)[],size=5){const codomain=Array.from({length:size},(_,i)=>i+1),map=intoDomain.map((_,i)=>{const v=mapping[i];return typeof v==='number'&&Number.isInteger(v)&&v>=0&&v<size?v:null;}),range=codomain.filter((_,j)=>map.includes(j)),unused=codomain.filter(v=>!range.includes(v)),mapped=map.filter(v=>v!==null).length,valid=mapped===4,into=valid&&unused.length>0,onto=valid&&unused.length===0,preimages=codomain.map((_,j)=>intoDomain.filter((_,i)=>map[i]===j));return{codomain,map,range,unused,mapped,valid,into,onto,preimages,coverage:range.length/size*100};}
export const intoSourceY=(i:number)=>75+i*55;
export const intoTargetY=(j:number,size:number)=>75+j*(size===5?45:55);
