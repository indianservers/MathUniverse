import {describe,expect,it} from 'vitest';
import audit from './lessonUpgradeAudit.generated.json';
import {unifiedLessons} from './unifiedLessons';
describe('interaction upgrade audit',()=>{
 it('lists every registered ID and every recent draft without duplicates',()=>{
  expect(audit.rows.map(r=>r.lessonId)).toEqual(unifiedLessons.map(l=>l.id));
  expect(new Set(audit.rows.map(r=>r.lessonId)).size).toBe(audit.total);
  expect(audit.rows.filter(r=>r.recent)).toHaveLength(448);
  expect(audit.priorities.P1+audit.priorities.P2).toBe(448);
 });
 it('distinguishes inspected recent models from unreviewed existing candidates',()=>{
  for(const row of audit.rows){if(row.recent)expect(row.model.length).toBeGreaterThan(0);else if(row.lessonId!==10102)expect(row.auditStatus).toContain('page-level review pending');}
  expect(audit.rows.find(r=>r.lessonId===10102)?.priority).toBe('Reference');
 });
 it('proposes topic-specific workbenches for the new PG and statistics lessons',()=>{
  expect(audit.rows.find(r=>r.lessonId===32025)?.creativeControls).toContain('input/kernel grid');
  expect(audit.rows.find(r=>r.lessonId===32032)?.creativeControls).toContain('X/Z/H');
  expect(audit.rows.find(r=>r.lessonId===30314)?.creativeControls).toContain('Add/remove class rows');
 });
});
