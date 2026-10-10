import { Link } from 'react-router-dom';
import { studioGapContent } from './gapLessons';
import {labsForStudio} from '../investigations/catalog';

export default function StudioGapChecklist({ studioId }: { studioId: string }) {
  const content = studioGapContent[studioId];
  if (!content) return null;
  return <section className="studio-assumptions" aria-label="Content additions and remaining gaps">
    <h2>Added topics from the content review</h2>
    <ul>{content.topics.map(topic => <li key={topic}>{topic}</li>)}</ul>
    <p>Each lesson includes a worked derivation, assumptions, a checked numeric exercise and a misconception explanation.</p>
    <ul>{content.lessons.map(lesson => <li key={lesson.id}>
      <Link to={`/studios/${studioId}/curriculum?lesson=${lesson.id}`}>{lesson.title}</Link>
    </li>)}</ul>
    <h3>Interactive investigations</h3><ul>{labsForStudio(studioId).map(lab=><li key={lab.id}><Link to={`/studios/${studioId}/labs/${lab.id}`}>{lab.title}</Link> — {lab.idea}</li>)}</ul>
    <p>These investigations support the stated mathematical families. Check each lab’s conditions before applying its result to a broader problem.</p>
  </section>;
}
