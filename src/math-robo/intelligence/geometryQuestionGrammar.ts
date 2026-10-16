export type GeometrySlots={id:number;names:Record<string,string>;numbers:number[]};
const escape=(s:string)=>s.replace(/[.*+?^${}()|[\]\\]/g,'\\$&').replace(/\s+/g,'\\s*');
const normalize=(s:string)=>s.toLowerCase().replace(/−/g,'-').replace(/[?.!]+$/,'').trim();
export function geometryQuestionGrammar(rows:ReadonlyArray<{id:number;question:string}>){
  const grammar=rows.map(row=>{
    const slots:Array<{name?:string}>=[];let pattern='',last=0;
    for(const m of row.question.matchAll(/\b(?:[A-Z]+|[cds])\b|[−-]?\d+(?:\.\d+)?/g)){
      pattern+=escape(row.question.slice(last,m.index).toLowerCase().replace(/−/g,'-'));
      if(/^\d+$/.test(m[0])&&row.question.slice(m.index!+m[0].length).startsWith('D')){pattern+=m[0];last=m.index!+m[0].length;continue;}
      const name=/^[A-Za-z]+$/.test(m[0])?m[0]:undefined;
      slots.push({name});pattern+=name?`(${name.length>1?'(?:[a-z][0-9]*){'+name.length+'}':'[a-z][a-z0-9_]*'})`:'([+-]?(?:\\d+(?:\\.\\d+)?|\\.\\d+))';last=m.index!+m[0].length;
    }
    pattern+=escape(row.question.slice(last).toLowerCase().replace(/−/g,'-').replace(/[?.!]+$/,''));
    return {id:row.id,slots,regex:new RegExp('^'+pattern+'$','i')};
  });
  return (raw:string):GeometrySlots|undefined=>{
    const text=normalize(raw).replace(/^(?:please|kindly|can you|could you)\s+/,'');
    for(const row of grammar){const m=text.match(row.regex);if(!m)continue;const names:Record<string,string>={},numbers:number[]=[];let valid=true;
      row.slots.forEach((slot,i)=>{if(!slot.name){numbers.push(Number(m[i+1]));return;}
        const keys=slot.name.length===1?[slot.name]:slot.name.split(''),values=keys.length===1?[m[i+1]]:m[i+1].match(/[a-z][0-9]*/gi)!;
        keys.forEach((k,j)=>{if(names[k]&&names[k]!==values[j])valid=false;names[k]=values[j];});
      });
      if(valid&&numbers.every(Number.isFinite))return {id:row.id,names,numbers};
    }
  };
}
