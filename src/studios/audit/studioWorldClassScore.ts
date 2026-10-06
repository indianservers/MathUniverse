import {studioQualityRatings} from './studioQualityRatings';
import {studioMockups} from '../mockup/studioMockupCatalog';
/** Compatibility API. Ratings are provisional editorial bands, not a 90-point acceptance gate. */
export type LabScore={id:string;tools:number;ui:number;ux:number;engine:number};
export type StudioScore={id:string;name:string;labs:LabScore[]};
export const labMean=(item:LabScore)=>Math.round((item.tools+item.ui+item.ux+item.engine)/4*10)/10;
export const studioMean=(studio:StudioScore)=>studio.labs.length?Math.round(studio.labs.reduce((sum,item)=>sum+labMean(item),0)/studio.labs.length*10)/10:0;
export const scoredStudios:StudioScore[]=studioQualityRatings.map(s=>{const def=Object.values(studioMockups).find(d=>d.basePath==='/' + s.id);return {id:s.id,name:s.name,labs:(def?.pages.filter(p=>p.id!=='home').map(p=>p.id)||[s.id]).map(id=>({id,tools:s.tools,ui:s.ui,ux:s.content,engine:s.mathematics}))};});
export const allStudiosAtLeast=(threshold:number)=>scoredStudios.every(s=>studioMean(s)>=threshold);
