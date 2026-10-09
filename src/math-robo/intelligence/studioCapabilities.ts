import type {RoboSceneContext,RoboResult} from './types';
export type StudioCapability={topic:string;aliases:string[];route:string;engine:string;operations:string[];requiredContext:string;verification:string};
/** Routes below are existing App routes; this registry advertises bounded engines. */
export const studioCapabilities:StudioCapability[]=[
 {topic:'Unit Circle',aliases:['unit circle'],route:'/trigonometry/unit-circle',engine:'trigonometry',operations:['sixTrigFunctions'],requiredContext:'angle and unit convention',verification:'numerical consistency or reviewed topic'},
 {topic:'Algebra',aliases:['algebra'],route:'/algebra',engine:'algebra',operations:['solveLinearEquation','factorIntegerQuadratic'],requiredContext:'complete equation or coefficients',verification:'kernel certificate only where independently supported'},
 {topic:'Geometry',aliases:['geometry'],route:'/geometry',engine:'geometry',operations:['triangleCentres','similarityScale'],requiredContext:'defined vertices and constraints',verification:'coordinate invariants; numerical tolerance'},
 {topic:'Calculus',aliases:['calculus'],route:'/calculus',engine:'calculus',operations:['oneSidedLimits','secantToTangent'],requiredContext:'function and evaluation point',verification:'bounded kernel polynomial certificates; other results unverified'},
 {topic:'Differential Equations',aliases:['differential equations'],route:'/calculus/differential-equations',engine:'cas',operations:['cas.evaluate'],requiredContext:'equation, variables and initial conditions when needed',verification:'valid but independently unverified unless a certificate is available'},
 {topic:'Number Systems',aliases:['number systems'],route:'/number-systems',engine:'number-systems',operations:['evaluateExperiment'],requiredContext:'typed experiment parameters',verification:'bounded exact arithmetic certificates where supported'},
 {topic:'Probability',aliases:['probability','probability lab'],route:'/probability-lab',engine:'probability',operations:['binomialDistribution','diceProbability','bayesPosterior'],requiredContext:'complete probability model and event',verification:'independently unverified specialist result'},
 {topic:'2D Graph',aliases:['2d graph','2d graph workspace'],route:'/workspace/graph',engine:'active-workspace',operations:['PLOT.FUNCTION'],requiredContext:'scalar expression with domain',verification:'native scene commit; graph sampling is not universal proof'},
 {topic:'3D Graph',aliases:['3d graph','3d graph workspace'],route:'/math-lab/3d-graphing',engine:'active-workspace',operations:['PLOT.SURFACE_3D'],requiredContext:'two-variable expression',verification:'native scene commit'},
 {topic:'2D Geometry',aliases:['2d geometry','2d geometry workspace'],route:'/workspace/geometry',engine:'active-workspace',operations:['CREATE','CONSTRUCT'],requiredContext:'finite coordinates and defining constraints',verification:'independent coordinate checks where supported'},
 {topic:'3D Geometry',aliases:['3d geometry','3d geometry workspace'],route:'/workspace/3d',engine:'active-workspace',operations:['CREATE','CONSTRUCT'],requiredContext:'spatial coordinates and constraints',verification:'bounded analytic geometry checks'},
];
export function navigationRequest(text:string,scene:RoboSceneContext):RoboResult|undefined{
 const q=text.toLowerCase().trim().replace(/[.!?]+$/,''),match=q.match(/^(?:open|go to|take me to) (?:the )?(.+?)(?: studio| page)?$/);if(!match)return;
 const candidates=studioCapabilities.filter(c=>c.aliases.includes(match[1]));
 const plan={rawPhrase:text,commands:[],confidence:1};
 if(!candidates.length)return {status:/^(?:graph|geometry workspace)$/.test(match[1])?'ambiguous':'unsupported',message:/^(?:graph|geometry workspace)$/.test(match[1])?'Which workspace: 2D or 3D?':'That navigation destination is not registered. Specify an existing supported studio.',plan,effects:[],parseMs:0,executionMs:0};
 const destination=candidates[0],requiresConfirmation=scene.objects.length>0;
 return {status:requiresConfirmation?'ambiguous':'success',message:requiresConfirmation?`Opening ${destination.topic} leaves this workspace. Save any work you want to keep, then confirm the transition.`:`Opening ${destination.topic}. Incompatible task and object references will be cleared on the new page.`,navigation:{path:destination.route,title:destination.topic,requiresConfirmation},plan,effects:[],parseMs:0,executionMs:0};
}
