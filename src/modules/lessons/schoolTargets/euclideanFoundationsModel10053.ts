export const efCategories10053=['Definitions','Common Notions (Axioms)','Geometric Postulates']as const;
export type EFCategory10053=typeof efCategories10053[number];
export const efCards10053=[
{id:1,text:'A line segment is the part of a line bounded by two endpoints.',category:'Definitions'},
{id:2,text:'Things equal to the same thing are equal to one another.',category:'Common Notions (Axioms)'},
{id:3,text:'All right angles are equal to each other.',category:'Geometric Postulates'},
{id:4,text:'Through a given point not on a given line, exactly one line can be drawn parallel to that line.',category:'Geometric Postulates'},
{id:5,text:'A circle is the set of points in a plane at a fixed positive distance from a centre.',category:'Definitions'},
{id:6,text:'If equals are added to equals, the wholes are equal.',category:'Common Notions (Axioms)'}]as const;
export const efInitial10053:Record<number,EFCategory10053>=Object.fromEntries(efCards10053.map(c=>[c.id,c.category]));
export const efCanPlace10053=(id:number,category:string)=>efCards10053.some(c=>c.id===id)&&efCategories10053.some(c=>c===category);
export const efCorrect10053=(assigned:Record<number,EFCategory10053>)=>efCards10053.filter(c=>assigned[c.id]===c.category).length;
export type EFChoice10053={classification:string;reason:string};
export const efReasons10053=[[
{value:'construction',text:'It asserts that a geometric construction exists, without proving it.'},
{value:'definition',text:'It only explains what the word circle means.'},
{value:'measured',text:'A measured example proves the universal statement.'}
],[
{value:'assumed',text:'Euclid accepts this as his fourth geometric postulate.'},
{value:'measured',text:'Measuring two examples proves the statement for every right angle.'},
{value:'theorem',text:'It is a proved theorem in Euclid’s original list of assumptions.'}
]];
export const efReview10053=(choices:EFChoice10053[])=>[0,1].map(i=>{const classification=choices[i]?.classification==='postulate',reason=choices[i]?.reason===['construction','assumed'][i];return{classification,reason,correct:classification&&reason};});
