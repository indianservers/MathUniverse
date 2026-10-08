import {expect,it} from 'vitest';
import {assertDatasetQuality,datasetQuality} from './datasetQuality';
import {generateStarterDataset} from './semanticDataset';
import type {SemanticRow} from './types';
const row=(parameters:SemanticRow['parameters']):SemanticRow=>({phrase:'Move it right by 3',mode:'graph2d',action:'MOVE',subAction:'OBJECT',parameters});
it('equivalent vector aliases and single-target defaults are not contradictory',()=>{
 expect(datasetQuality([row({vector:[3,0]}),row({dy:0,dx:3,multiple:false,vector:[3,0]})]).conflictingLabels).toBe(0);
});
it('different values, mismatching aliases and different actions still conflict',()=>{
 for(const other of [row({vector:[4,0]}),row({vector:[3,0],dx:4}),{...row({vector:[3,0]}),action:'DELETE'}])
  expect(()=>assertDatasetQuality([row({vector:[3,0]}),other])).toThrow('conflicting labels');
});
it('the unmodified generated starter dataset passes its production quality gate',()=>{
 const rows=generateStarterDataset();expect(assertDatasetQuality(rows).conflictingLabels).toBe(0);
});
