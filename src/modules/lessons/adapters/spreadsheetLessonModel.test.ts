import{describe,it,expect}from'vitest';
import{evaluateSpreadsheetGrid,fillDownFormula,shiftSpreadsheetFormula,parseCellName,rangeToCsv}from'../../../workspace/spreadsheetKernel';
import{parseLessonCsv,sortLessonGrid,numericColumn,sheetSummary,sheetRegression}from'./spreadsheetLessonModel';
describe('Topic-specific spreadsheet activities',()=>{
 it('moves relative references and preserves both kinds of dollar-sign locks',()=>{expect(shiftSpreadsheetFormula('=A1+$B1+C$1+$D$1',2,1)).toBe('=B3+$B3+D$1+$D$1');expect(parseCellName('$AA$3')).toEqual({row:2,column:26});expect(parseCellName('A0')).toBeNull();});
 it('evaluates and fills an absolute-reference multiplication',()=>{const grid=[['x','y','z'],['10','3','=B2*$A$2'],['2','5','']];const filled=fillDownFormula(grid,'C2','C2:C3');expect(filled[2][2]).toBe('=B3*$A$2');expect(evaluateSpreadsheetGrid(filled).values[2][2]).toBe('50');});
 it('reports undefined arithmetic as a cell error',()=>{const result=evaluateSpreadsheetGrid([['=1/0']]);expect(result.values[0][0]).toBe('#ERR');expect(result.errors[0].message).toContain('Undefined');});
 it('sorts whole records and shifts formulas to the destination row',()=>{const sorted=sortLessonGrid([['x','y','change'],['1','3','=B2-A2'],['4','12','=B3-A3'],['2','5','=B4-A4']],1,true);expect(sorted[1]).toEqual(['4','12','=B2-A2']);expect(sorted[3]).toEqual(['1','3','=B4-A4']);expect(evaluateSpreadsheetGrid(sorted).values[1][2]).toBe('8');});
 it('reads quoted commas, escaped quotes, CRLF and quoted newlines',()=>{expect(parseLessonCsv('name,value\r\n"a,b",5\r\n"say ""hi""",7')).toEqual([['name','value'],['a,b','5'],['say "hi"','7']]);expect(parseLessonCsv('name,value\n"two\nlines",4')[1][0]).toBe('two\nlines');});
 it('rejects an unfinished CSV quote and pads short rows',()=>{expect(()=>parseLessonCsv('a,b\n"bad,1')).toThrow('Close');expect(parseLessonCsv('a,b,c\n1,2')[1]).toEqual(['1','2','']);});
 it('round-trips exported quotes and formula strings',()=>{const grid=[['x','text'],['1','a,"b"'],['2','=A2*2']];expect(parseLessonCsv(rangeToCsv(grid,'A1:B3'))).toEqual(grid);});
 it('summarizes only numerical nonempty values and handles even medians',()=>{const values=numericColumn([['v'],['3'],[''],['5'],['8'],['12'],['#ERR']],0);expect(sheetSummary(values)).toEqual({n:4,sum:28,mean:7,median:6.5,min:3,max:12,range:9});expect(sheetSummary([])).toBeNull();});
 it('fits the exact live linked line and rejects a repeated-x fit',()=>{const fit=sheetRegression([1,2,3,4].map(x=>({x,y:2*x+1})))!;expect(fit.slope).toBe(2);expect(fit.intercept).toBe(1);expect(fit.sse).toBe(0);expect(fit.r2).toBe(1);expect(sheetRegression([{x:1,y:2},{x:1,y:3}])).toBeNull();});
});
