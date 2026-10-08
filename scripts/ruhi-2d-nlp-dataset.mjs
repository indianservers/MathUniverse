import fs from 'node:fs';
import crypto from 'node:crypto';
export const directory='reports/ruhi-2d-nlp';
export const sourcePath='C:/Users/saisa/Downloads/ruhi_2d_nlp_300_dataset.json';
export const sha=p=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
export function prepareDataset(){
  const source=JSON.parse(fs.readFileSync(sourcePath,'utf8')),seen=new Set(),turns=new Map(),issues=[];
  if(!Array.isArray(source.records))throw new Error('The source must contain records.');
  const records=source.records.map(r=>{
    const invalid=[];if(!r.id||seen.has(r.id))invalid.push('Missing/duplicate ID');seen.add(r.id);
    if(typeof r.input!=='string'||!r.input.trim())invalid.push('Missing utterance');
    if(!['execute','clarify','conditional','reject'].includes(r.expected?.type))invalid.push('Unknown expected outcome');
    if(r.expected?.type==='execute'&&(!Array.isArray(r.expected.actions)||r.expected.actions.some(a=>typeof a.op!=='string')))invalid.push('Invalid expected action list');
    if(r.expected?.type==='clarify'&&(!r.expected.missing_slot||!r.follow_up?.must_not_execute))invalid.push('Incomplete clarification contract');
    const scenarioId=r.scenario_id??r.id,turnIndex=turns.get(scenarioId)??0;turns.set(scenarioId,turnIndex+1);
    const warnings=[];
    if(/regular trapezoid/.test(r.input))warnings.push('A regular trapezoid has no unique conventional definition; do not silently invent vertices.');
    if(r.context?.angle_degrees!==undefined){const object=r.context.objects?.[0],v=object?.vertices;if(v){const at=r.context.active_angle?.split('.').at(-1),names=['A','B','C'],i=names.indexOf(at),p=v[names[i]],q=v[names[(i+1)%3]],z=v[names[(i+2)%3]];if(p&&q&&z){const u=q.map((x,j)=>x-p[j]),w=z.map((x,j)=>x-p[j]),angle=Math.acos(u.reduce((s,x,j)=>s+x*w[j],0)/(Math.hypot(...u)*Math.hypot(...w)))*180/Math.PI;if(Math.abs(angle-r.context.angle_degrees)>1e-6)warnings.push(`Illustrative angle ${r.context.angle_degrees} disagrees with coordinates (${angle}); coordinate fixture is authoritative.`);}}}
    if(r.context?.objects?.some(o=>typeof o==='string'||!o.vertices))warnings.push('Missing geometric coordinates: use the explicitly documented deterministic fixture convention.');
    if(r.context?.segments)warnings.push('Missing segment endpoints: use documented fixture endpoints (0,0) and (6,4).');
    if(invalid.length||warnings.length)issues.push({id:r.id,invalid,warnings});
    return {schemaVersion:1,id:r.id,scenarioId,turnIndex,userUtterance:r.input,initialScene:r.context,expected:r.expected,followUp:r.follow_up,category:r.category,difficulty:r.difficulty,valid:!invalid.length,ambiguous:warnings.some(x=>x.startsWith('A regular')),issues:{invalid,warnings},original:r};
  });
  const groups=[...new Set(records.map(r=>r.scenarioId))].map(id=>({id,rows:records.filter(r=>r.scenarioId===id)})).sort((a,b)=>crypto.createHash('sha256').update('ruhi2d-seed-2026:'+a.id).digest('hex').localeCompare(crypto.createHash('sha256').update('ruhi2d-seed-2026:'+b.id).digest('hex')));
  const counts={train:0,validation:0,test:0},targets={train:210,validation:45,test:45};
  for(const g of groups){const split=Object.keys(counts).sort((a,b)=>(targets[b]-counts[b])-(targets[a]-counts[a]))[0];for(const row of g.rows)row.split=split;counts[split]+=g.rows.length;}
  fs.mkdirSync(directory,{recursive:true});fs.mkdirSync('datasets/ruhi-2d-nlp',{recursive:true});
  fs.writeFileSync('datasets/ruhi-2d-nlp/v1.normalized.json',JSON.stringify({schemaVersion:1,sourceSha256:sha(sourcePath),metadata:source.metadata,records},null,2));
  fs.writeFileSync(directory+'/dataset-validation.json',JSON.stringify({total:records.length,valid:records.filter(r=>r.valid).length,invalid:records.filter(r=>!r.valid).length,ambiguous:records.filter(r=>r.ambiguous).length,issues,sourcePath,sourceSha256:sha(sourcePath),fixturePolicy:'For absent geometry: triangle (0,0),(6,0),(2,5); circle centered (0,0), radius 4; rectangle centered (0,0), 4×6; line (0,0) to (6,2); segment (0,0) to (6,4); upper/lower triangles y±6; two conditional lines y=x and y=-x. Existing scenario state is retained. These are test fixtures, never runtime assumptions.'},null,2));
  fs.writeFileSync(directory+'/dataset-partition.json',JSON.stringify({seed:'ruhi2d-seed-2026',counts,scenarios:groups.length,records:records.map(r=>({id:r.id,scenarioId:r.scenarioId,split:r.split})),scenarioLeakage:false,templateLeakage:'Repeated linguistic families remain across splits; final generalization claims require separate unseen paraphrases.',heldOutPolicy:'Original all-300 baseline/regression is labeled regression. Repairs use development records only; held-out is not used for training or checkpoint selection.'},null,2));
  return records;
}
if(process.argv[1]?.replaceAll('\\','/').endsWith('/ruhi-2d-nlp-dataset.mjs'))console.log(prepareDataset().length,'records normalized');
