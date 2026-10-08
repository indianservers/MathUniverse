import type {SemanticRow} from './types';
import {normalizeLanguage} from './numberParser';
export function datasetQuality(rows:SemanticRow[]){
  const classes=new Map<string,number>(),texts=new Map<string,string>(),families=new Set<string>(),ids=new Set<string>();let duplicates=0,nearDuplicates=0,conflicts=0,duplicateIds=0;
  for(const row of rows){const key=`${row.action}:${row.subAction}`;classes.set(key,(classes.get(key)??0)+1);const text=`${row.mode}:${normalizeLanguage(row.phrase)}`,label=`${key}:${JSON.stringify(row.parameters)}`,old=texts.get(text);if(old===label)duplicates++;else if(old)conflicts++;texts.set(text,label);const family=text.replace(/-?\d+(?:\.\d+)?/g,'#').replace(/\b(please|kindly|can you|could you)\b/g,'').replace(/\s+/g,' ');if(families.has(family))nearDuplicates++;families.add(family);const id=(row as SemanticRow&{id?:string}).id;if(id){if(ids.has(id))duplicateIds++;ids.add(id);}}
  const counts=[...classes.values()],min=counts.length?Math.min(...counts):0,max=counts.length?Math.max(...counts):0;
  return {rows:rows.length,classes:[...classes].map(([operation,count])=>({operation,count})),minimumClassCount:min,maximumClassCount:max,imbalanceRatio:min?max/min:0,duplicates,nearDuplicates,conflictingLabels:conflicts,duplicateIds,lowClasses:[...classes].filter(([,n])=>n<10).map(([key])=>key)};
}
export function assertDatasetQuality(rows:SemanticRow[]){const quality=datasetQuality(rows);if(quality.conflictingLabels||quality.duplicateIds)throw new Error(`Dataset contains ${quality.conflictingLabels} conflicting labels and ${quality.duplicateIds} duplicate IDs.`);return quality;}
