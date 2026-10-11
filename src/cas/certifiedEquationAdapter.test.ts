import {it,expect} from 'vitest';
import {createNotebookCell,evaluateNotebookCells} from './casNotebookEngine';
import {evaluateCasInput} from './casResult';
import {evaluateCertifiedCas} from '../phase4/casEngine';

it('CAS command and notebook solve share independent completeness and exclusions',()=>{
 const command=evaluateCasInput('Solve[(x^2-1)/(x-1)=0,x]');
 expect(command.status).toBe('ok');expect(command.exact).toBe('{x = -1}');
 expect(command.execution?.status).toBe('verified');expect(command.solutionSet).toMatchObject({kind:'finite',complete:true,values:['-1']});
 const [cell]=evaluateNotebookCells([createNotebookCell('(x^2-1)/(x-1)=0','solve')],'x real','exact');
 expect(cell.execution?.status).toBe('verified');expect(cell.conditions?.join(' ')).toContain('!= 0');
 expect(cell.solutionSet?.values).toEqual(['-1']);
 const wrapped=evaluateCertifiedCas('(x^2-1)/(x-1)=0');
 expect(wrapped.execution?.status).toBe('verified');expect(wrapped.solutionSet?.values).toEqual(['-1']);
 expect(wrapped.conditions.some(c=>c.expression.includes('!= 0'))).toBe(true);
});
it('notebook reruns bind changed inputs and assumptions to a new certificate',()=>{
 const [original]=evaluateNotebookCells([createNotebookCell('x^2=2','solve')],'x real','exact');
 const [restricted]=evaluateNotebookCells([original],'x real; x > 0','exact');
 expect(original.solutionSet?.values).toHaveLength(2);expect(restricted.solutionSet?.values).toHaveLength(1);
 expect(original.execution?.evidence.inputRevision).not.toBe(restricted.execution?.evidence.inputRevision);
 const [empty]=evaluateNotebookCells([{...restricted,input:''}],'x real','exact');expect(empty.execution).toBeUndefined();expect(empty.solutionSet).toBeUndefined();
 const [unsupported]=evaluateNotebookCells([{...restricted,input:'x^3=1'}],'x real','exact');expect(unsupported.execution).toBeUndefined();
});
it('contradictory assumptions and undefined inputs never gain notebook certificates',()=>{
 for(const [expression,assumptions] of [['x^2=4',['x > 0','x < 0']],['1/0=2',[]]] as const){
  const result=evaluateCasInput(`Solve[${expression},x]`,{assumptions:[...assumptions]});expect(result.status).toBe('error');expect(result.execution?.status).toBe('invalid_input');
 }
});
