import {describe,it,expect} from 'vitest';
import {quartiles} from './quartilesLessonModel';
import {regression} from './scatterPlotLessonModel';
import {regressionFit} from './linearRegressionLessonModel';
import {exponentialFit} from './exponentialRegressionLessonModel';
describe('Interactive statistics boundaries',()=>{
 it('keeps the single-observation quartiles finite',()=>{expect(quartiles([7])).toEqual({min:7,q1:7,median:7,q3:7,max:7,iqr:0,lowerFence:7,upperFence:7});});
 it('uses the median-of-halves answer key for box-plot practice',()=>{expect(quartiles([12,14,15,17,21,23,23,24,26,28,29,31,33,34,37,40,43,46,52])).toMatchObject({q1:21,q3:37,iqr:16});});
 it('marks empty and constant-variable correlation undefined',()=>{for(const data of [[],[{x:1,y:2}],[{x:1,y:2},{x:1,y:3}],[{x:1,y:2},{x:2,y:2}]])expect(regression(data).defined).toBe(false);});
 it('retains negative perfect correlation',()=>{expect(regression([{x:1,y:7},{x:2,y:6},{x:3,y:5}])).toMatchObject({defined:true,r:-1,slope:-1,intercept:8});});
 it('does not divide by zero on constant regression coordinates',()=>{const fit=regressionFit([{x:1,y:2},{x:1,y:4}]);expect(fit.slope).toBe(0);expect(fit.intercept).toBe(3);expect(fit.sse).toBe(2);});
 it('refuses to claim a log-linear fit with nonpositive y or repeated x',()=>{expect(exponentialFit([{x:0,y:0},{x:1,y:2}]).defined).toBe(false);expect(exponentialFit([{x:1,y:2},{x:1,y:4}]).defined).toBe(false);expect(exponentialFit([{x:0,y:2},{x:1,y:4}]).defined).toBe(true);});
});
