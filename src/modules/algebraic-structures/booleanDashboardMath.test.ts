import {describe,it,expect} from 'vitest';
import {minimalBooleanForm,booleanKmap} from './booleanDashboardMath';
import {simplifyBooleanExpression,evaluateBoolean,parseBooleanExpression} from './algebraicStructuresEngine';
describe('Boolean dashboard calculations',()=>{
 for(const expression of ['A & (!B | C)','!!A','!!!A','A ^ B','!(A & B)','(A & B) | (C & D)','A | !A','A & !A'])it(`SOP and POS preserve ${expression}`,()=>{const a=simplifyBooleanExpression(expression);for(const positive of [true,false]){const form=minimalBooleanForm(a.variables,a.rows,positive);for(const row of a.rows){const result=form==='0'?false:form==='1'?true:evaluateBoolean(parseBooleanExpression(form),row.values);expect(result).toBe(row.result);}}});
 it('reduces redundant terms',()=>{const a=simplifyBooleanExpression('(A & B) | (A & !B)');expect(minimalBooleanForm(a.variables,a.rows)).toBe('(A)');});
 it('maps all eight three-variable rows in Gray order',()=>{const a=simplifyBooleanExpression('A & (!B | C)');const map=booleanKmap(a.variables,a.rows);expect(map.rowLabels).toEqual(['0','1']);expect(map.colLabels).toEqual(['00','01','11','10']);expect(map.cells).toEqual([[false,false,false,false],[true,true,true,false]]);});
 it('maps all sixteen four-variable rows',()=>{const a=simplifyBooleanExpression('A ^ B ^ C ^ D');const map=booleanKmap(a.variables,a.rows);expect(map.cells.flat()).toHaveLength(16);expect(map.cells.flat().filter(Boolean)).toHaveLength(8);});
});
