import type {ComponentProps} from 'react';
import {LessonCartesianGraph} from './LessonCartesianGraph';

/** Polar samples remain lesson-owned; projection, navigation and theme are shared. */
export function LessonPolarGraph(props:Omit<ComponentProps<typeof LessonCartesianGraph>,'grid'|'unitAspectRatio'>){
 return <LessonCartesianGraph {...props} grid="polar" unitAspectRatio={1}/>;
}
