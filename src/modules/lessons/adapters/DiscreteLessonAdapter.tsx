import AdapterFrame from "../components/AdapterFrame";
import type { LessonAdapterProps } from "../types";
import { discreteLessonPreset, type DiscreteLessonMode } from "../presets/discreteLessonPresets";
import { AdditionalDiscreteConceptActivity, CountingConceptActivity, GraphConceptActivity } from "./discrete/DiscreteConceptActivities";
import { GraphColouringActivity, LogicalConnectivesActivity, PowerSetActivity, QuantifiersActivity, SetBuilderActivity, SetOperationsActivity, TruthTableActivity } from "./discrete/DiscreteP0Activities";

const countingModes = new Set<DiscreteLessonMode>(["product","factorial","permutation","repeated-permutation","circular-permutation","combination","pascal","inclusion-exclusion","pigeonhole"]);
const graphModes = new Set<DiscreteLessonMode>(["graph-builder","directed","weighted","degree","paths-cycles","components","euler","hamiltonian","tree","mst","shortest-path","bipartite","planar","flow","tsp","adjacency"]);

export default function DiscreteLessonAdapter(props:LessonAdapterProps){
 const mode=discreteLessonPreset(props.lesson.id).mode;
 let activity=specialActivity(props.lesson.preset.id,props);
 if(!activity&&countingModes.has(mode))activity=<CountingConceptActivity mode={mode} {...props}/>;
 if(!activity&&graphModes.has(mode))activity=<GraphConceptActivity mode={mode} {...props}/>;
 if(!activity&&(["complement","cartesian-product","proof"] as DiscreteLessonMode[]).includes(mode))activity=<AdditionalDiscreteConceptActivity mode={mode} {...props}/>;
 if(!activity)throw new Error(`Unsupported discrete preset ${props.lesson.preset.id}`);
 return <AdapterFrame title={`${props.lesson.title} · discrete lab`} footer="The visible controls, derived state, algorithm steps, and challenge use this lesson's explicit discrete preset.">{activity}</AdapterFrame>;
}

function specialActivity(id:string,props:Pick<LessonAdapterProps,"resetToken"|"onInteraction">){
 if(id==="discrete.graph-colouring")return <GraphColouringActivity {...props}/>;
 if(id==="discrete.set-builder")return <SetBuilderActivity {...props}/>;
 if(id==="discrete.set-operations")return <SetOperationsActivity {...props}/>;
 if(id==="discrete.power-set")return <PowerSetActivity {...props}/>;
 if(id==="discrete.truth-table")return <TruthTableActivity {...props}/>;
 if(id==="discrete.logical-connectives")return <LogicalConnectivesActivity {...props}/>;
 if(id==="discrete.quantifiers")return <QuantifiersActivity {...props}/>;
 return null;
}
