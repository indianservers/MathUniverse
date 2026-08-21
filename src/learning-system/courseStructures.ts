import type { BoardId, CoursePathway, PaperId } from "./types";

const emptyCourse=(id:string,board:BoardId,course:string,paper?:PaperId):CoursePathway=>({id,board,officialTitle:course,academicYear:"2026-27",course,paper,medium:"English",sourceIds:[],units:[],reviewStatus:"UNMAPPED",certificationState:"NOT_ELIGIBLE",knownGaps:["No checksum-verified official outcome structure has been ingested.","Lesson, practice, assessment, project and reviewer evidence are incomplete."]});
const ixChapters=[
 ["number-system","Number System",["ALG.FUNCTIONS.DOMAIN_RANGE"]],
 ["polynomials","Introduction to Polynomials",["ALG.POLYNOMIALS"]],
 ["sequences","Sequences and Progressions",["ALG.FUNCTIONS.DOMAIN_RANGE"]],
 ["identities","Exploring Algebraic Identities",["ALG.POLYNOMIALS"]],
 ["linear-equations","Linear Equations in Two Variables",["ALG.FUNCTIONS.DOMAIN_RANGE"]],
 ["coordinate-geometry","Coordinate Geometry",["GEO.COORDINATE.DISTANCE_MIDPOINT"]],
] as const;
const cbseIx:CoursePathway={id:"CBSE_IX_MATHEMATICS",board:"CBSE",officialTitle:"Mathematics Class IX",academicYear:"2026-27",course:"Class IX Mathematics",medium:"English",sourceIds:["CBSE-2026-27-IX-MATH"],reviewStatus:"HUMAN_REVIEW_REQUIRED",certificationState:"PENDING",knownGaps:["Only the first six chapter records are normalized; remaining official chapters and all lesson/practice/assessment links need human review.","No genuine reviewer approvals exist."],units:[
 {id:"cbse-ix-u1",title:"Number System",order:1,pageOrSection:"PDF p.4; Unit I",chapters:[chapter(ixChapters[0],1,"cbse-ix-outcome-number",7)]},
 {id:"cbse-ix-u2",title:"Algebra",order:2,pageOrSection:"PDF p.4; Unit II",chapters:ixChapters.slice(1,5).map((entry,index)=>chapter(entry,index+1,`cbse-ix-algebra-${index+1}`,index===0?20:undefined))},
 {id:"cbse-ix-u3",title:"Coordinate Geometry",order:3,pageOrSection:"PDF p.4; Unit III",chapters:[chapter(ixChapters[5],1,"cbse-ix-coordinate",4)]},
]};
function chapter(entry:readonly[string,string,readonly string[]],order:number,outcomeId:string,marks?:number){return{id:`cbse-ix-${entry[0]}`,title:entry[1],order,outcomeIds:[outcomeId],canonicalConceptIds:[...entry[2]],lessonIds:[],practiceFamilyIds:[],assessmentBlueprintIds:[],projectIds:[],marks,reviewStatus:"HUMAN_REVIEW_REQUIRED" as const};}

export const coursePathways:CoursePathway[]=[
 emptyCourse("NCERT_CLASS_6","NCERT","Class 6 Mathematics"),emptyCourse("NCERT_CLASS_7","NCERT","Class 7 Mathematics"),emptyCourse("NCERT_CLASS_8","NCERT","Class 8 Mathematics"),cbseIx,
 {...emptyCourse("CBSE_IX_MATHEMATICS_ADVANCED","CBSE","Class IX Mathematics Advanced"),sourceIds:["CBSE-2026-27-IX-MATH-ADV"],reviewStatus:"HUMAN_REVIEW_REQUIRED",certificationState:"PENDING"},
 {...emptyCourse("CBSE_X_MATHEMATICS","CBSE","Class X Mathematics"),sourceIds:["CBSE-2026-27-X-MATH"],reviewStatus:"HUMAN_REVIEW_REQUIRED",certificationState:"PENDING"},
 {...emptyCourse("CBSE_XI_MATHEMATICS","CBSE","Class XI Mathematics"),sourceIds:["CBSE-2026-27-XI-XII-MATH"],reviewStatus:"HUMAN_REVIEW_REQUIRED",certificationState:"PENDING"},
 {...emptyCourse("CBSE_XII_MATHEMATICS","CBSE","Class XII Mathematics"),sourceIds:["CBSE-2026-27-XI-XII-MATH"],reviewStatus:"HUMAN_REVIEW_REQUIRED",certificationState:"PENDING"},
 {...emptyCourse("CBSE_XI_APPLIED_MATHEMATICS","CBSE","Class XI Applied Mathematics"),sourceIds:["CBSE-2026-27-XI-XII-APPLIED"],reviewStatus:"HUMAN_REVIEW_REQUIRED",certificationState:"PENDING"},
 {...emptyCourse("CBSE_XII_APPLIED_MATHEMATICS","CBSE","Class XII Applied Mathematics"),sourceIds:["CBSE-2026-27-XI-XII-APPLIED"],reviewStatus:"HUMAN_REVIEW_REQUIRED",certificationState:"PENDING"},
 emptyCourse("AP_INTERMEDIATE_IA","AP_BIE","First Year Mathematics IA","IA"),emptyCourse("AP_INTERMEDIATE_IB","AP_BIE","First Year Mathematics IB","IB"),emptyCourse("AP_INTERMEDIATE_IIA","AP_BIE","Second Year Mathematics IIA","IIA"),emptyCourse("AP_INTERMEDIATE_IIB","AP_BIE","Second Year Mathematics IIB","IIB"),
 emptyCourse("TELANGANA_INTERMEDIATE_IA","TELANGANA_BIE","First Year Mathematics IA","IA"),emptyCourse("TELANGANA_INTERMEDIATE_IB","TELANGANA_BIE","First Year Mathematics IB","IB"),emptyCourse("TELANGANA_INTERMEDIATE_IIA","TELANGANA_BIE","Second Year Mathematics IIA","IIA"),emptyCourse("TELANGANA_INTERMEDIATE_IIB","TELANGANA_BIE","Second Year Mathematics IIB","IIB"),
];
export const authoringPriorityBacklogs={AP_BIE:{IA:["ALG.FUNCTIONS.DOMAIN_RANGE","ALG.MATHEMATICAL_INDUCTION","ALG.MATRICES.DETERMINANTS","TRIG.HYPERBOLIC_FUNCTIONS"],IB:["GEO.TRANSFORMATION_OF_AXES","GEO.PAIR_OF_STRAIGHT_LINES","CALC.LIMITS.CONTINUITY","CALC.DIFFERENTIATION.APPLICATIONS"],IIA:["ALG.COMPLEX.DE_MOIVRE","ALG.THEORY_OF_EQUATIONS","STAT.DISPERSION","PROB.RANDOM_VARIABLES"],IIB:["GEO.SYSTEM_OF_CIRCLES","GEO.CONICS.PARABOLA","GEO.CONICS.ELLIPSE","GEO.CONICS.HYPERBOLA","CALC.INTEGRATION.DEFINITE","CALC.ODE.FIRST_ORDER"]},TELANGANA_BIE:{IA:[],IB:[],IIA:[],IIB:[]}} as const;
export function boardDifferenceView(){const ap=coursePathways.filter((entry)=>entry.board==="AP_BIE");const tg=coursePathways.filter((entry)=>entry.board==="TELANGANA_BIE");return{sharedCanonicalConcepts:[],apOnlyMappings:ap.flatMap((entry)=>entry.units),telanganaOnlyMappings:tg.flatMap((entry)=>entry.units),sequencingDifferences:[],terminologyDifferences:[],assessmentEmphasisDifferences:[],sourceVersions:{AP_BIE:"unavailable",TELANGANA_BIE:"unavailable"},status:"COMPARISON_PENDING_OFFICIAL_SOURCES" as const};}
export function validateCourseSeparation(){const ids=new Set(coursePathways.map((entry)=>entry.id));const issues:string[]=[];for(const id of ["CBSE_IX_MATHEMATICS","CBSE_IX_MATHEMATICS_ADVANCED","CBSE_XI_MATHEMATICS","CBSE_XI_APPLIED_MATHEMATICS","AP_INTERMEDIATE_IA","AP_INTERMEDIATE_IB","AP_INTERMEDIATE_IIA","AP_INTERMEDIATE_IIB","TELANGANA_INTERMEDIATE_IA","TELANGANA_INTERMEDIATE_IB","TELANGANA_INTERMEDIATE_IIA","TELANGANA_INTERMEDIATE_IIB"])if(!ids.has(id))issues.push(`Missing separate pathway ${id}`);return issues;}
